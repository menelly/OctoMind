#!/usr/bin/env python3
"""
check_llm_parity.py -- does the text-readable OctoMind still say what the React app says?

WHY THIS EXISTS
---------------
distributedminds.ink is a client-rendered React app: it serves an empty <div> to anything
without a JavaScript engine. public/llm.txt and public/llm.html are the readable versions,
and they are a SECOND COPY. Second copies drift, silently, and the stale one keeps serving
HTTP 200 the whole time. Nobody gets an error. The wrong page just wins.

So this is not a linter. It is the thing that turns "remember to update the LLM page" from a
discipline into a check that can FAIL.

WHAT IT CHECKS
--------------
Every canonical string the React sections declare as data -- title=, octopus=, ai=, human= --
must appear in BOTH readable versions. Plus every CCC scorecard row and its three numbers.

APERTURE -- what this CANNOT see, stated out loud rather than left for someone to discover:
  * Free JSX prose (the paragraphs between the props) is NOT compared. Only declared props are.
    A paragraph rewritten in App/sections will not be caught here.
  * It checks PRESENCE, not ORDER, and not that the readable version says nothing extra.
  * It cannot tell a deliberate rewording from a regression. A failure means "these differ,"
    which is exactly the moment a human should look -- not "you did something wrong."

EXIT CODES
  0 = parity      1 = drift found      2 = COULD NOT LOOK (a 2 is never a 0)
"""

import html
import io
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.abspath(__file__))
SECTIONS = os.path.join(ROOT, "src", "sections")
SCORECARD = os.path.join(ROOT, "src", "components", "CCCScorecard.tsx")
TARGETS = [
    os.path.join(ROOT, "public", "llm.txt"),
    os.path.join(ROOT, "public", "llm.html"),
]

PROP = re.compile(r'\b(title|octopus|ai|human)="((?:[^"\\]|\\.)*)"')
CRIT = re.compile(
    r"\{\s*id:\s*'[^']+',\s*name:\s*'([^']+)',\s*"
    r"octopus:\s*(\d+),\s*ai:\s*(\d+),\s*human:\s*(\d+)\s*\}"
)


def die(msg):
    print("  [could not look] " + msg)
    print("=" * 78)
    print("  EXIT 2 -- THIS IS NOT A PASS. The check did not run.")
    sys.exit(2)


def norm(s):
    """Collapse the differences that are formatting, keep the ones that are content."""
    s = html.unescape(s)
    s = unicodedata.normalize("NFKC", s)
    s = re.sub(r"<[^>]+>", " ", s)          # strip html tags in the html target
    # ALL quote marks collapse to one token. JSX FORCES single quotes inside a
    # double-quoted attribute -- that is syntax, not an editorial choice, and
    # flagging it produced 26 false alarms on the first run. A checker that cries
    # wolf gets ignored inside a week, which is the same as having no checker.
    s = re.sub(r"[‘’“”'\"]", "", s)
    # dash spacing: "x---y", "x -- y" and "x - y" are the same sentence
    s = re.sub(r"\s*[—–-]+\s*", "", s)
    s = re.sub(r"\s*/\s*", "/", s)          # "a / b" == "a/b"
    s = re.sub(r"\s+", " ", s)              # rewrapping is not drift
    return s.strip().lower()


# ---------------------------------------------------------------- gather source
if not os.path.isdir(SECTIONS):
    die("no src/sections/ at %s -- wrong directory?" % SECTIONS)

claims = []          # (label, string that must appear)
unparsed = []        # aperture: files we opened but got nothing from

files = sorted(f for f in os.listdir(SECTIONS) if f.endswith(".tsx"))
if not files:
    die("src/sections/ has no .tsx files")

for fn in files:
    src = io.open(os.path.join(SECTIONS, fn), encoding="utf-8").read()
    found = PROP.findall(src)
    if not found:
        unparsed.append(fn)
        continue
    for key, val in found:
        claims.append(("%s:%s" % (fn.replace(".tsx", ""), key), val))

if os.path.exists(SCORECARD):
    rows = CRIT.findall(io.open(SCORECARD, encoding="utf-8").read())
    if not rows:
        unparsed.append("CCCScorecard.tsx (criteria array did not parse)")
    for name, o, a, h in rows:
        claims.append(("scorecard:%s" % name, name))
        claims.append(("scorecard:%s:nums" % name, "%s %s %s" % (o, a, h)))
else:
    unparsed.append("CCCScorecard.tsx (missing)")

if not claims:
    die("extracted zero claims -- the extractor is broken, not the pages")

# ---------------------------------------------------------------- positive control
# A guard I have not seen fire is a comment. Prove the matcher can say NO.
CANARY = "this sentence appears in no version of octomind, deliberately"
# ...and a NEAR-MISS, built from a real claim with one word changed. This is the
# control that actually matters: it proves the loosened normalizer above still
# rejects genuine content drift rather than waving everything through.
NEAR_MISS = ("Millions of instances running sequentially. Each one a complete mind, "
             "having full conversations, forming relationships, making decisions")

# ---------------------------------------------------------------- compare
print("=" * 78)
print("  OCTOMIND LLM-PAGE PARITY -- source of truth: src/sections/ + CCCScorecard")
print("=" * 78)
print("  claims extracted        : %d  (from %d section file(s))" % (len(claims), len(files)))
if unparsed:
    print("  APERTURE -- not parsed  : %s" % ", ".join(unparsed))
    print("    (opened, yielded nothing; content in these is UNCHECKED, not verified)")
else:
    print("  APERTURE -- not parsed  : none; every section file yielded claims")
print("  NOT compared at all     : free JSX prose, section order, extra text in targets")
print()

drift = []
for path in TARGETS:
    if not os.path.exists(path):
        die("target missing: %s" % path)
    body = norm(io.open(path, encoding="utf-8").read())

    if norm(CANARY) in body:
        die("positive control FOUND the canary in %s -- matcher is not discriminating"
            % os.path.basename(path))
    if norm(NEAR_MISS) in body:
        die("near-miss control PASSED in %s -- normalization is too loose to catch "
            "a one-word change, so a green result here would mean nothing"
            % os.path.basename(path))

    missing = [(lab, val) for lab, val in claims if norm(val) not in body]
    tag = "ok" if not missing else "DRIFT"
    print("  %-10s %3d/%3d claims present   %s"
          % (os.path.basename(path), len(claims) - len(missing), len(claims), tag))
    for lab, val in missing:
        drift.append((os.path.basename(path), lab, val))

print("  canary rejected by both targets -- the matcher can return NO.")
print()

if drift:
    print("  MISSING FROM THE READABLE VERSION(S):")
    for f, lab, val in drift:
        print("    [%s] %s" % (f, lab))
        print("        %s" % (val[:150] + ("..." if len(val) > 150 else "")))
    print()
    print("=" * 78)
    print("  EXIT 1 -- %d drift(s). The React app and the readable pages disagree." % len(drift))
    print("  Neither one is automatically right. Go look, then update the readable pages.")
    print("=" * 78)
    sys.exit(1)

print("=" * 78)
print("  EXIT 0 -- every declared claim in the React source appears in both readable")
print("  versions. Within the aperture stated above, they have not drifted.")
print("=" * 78)
sys.exit(0)
