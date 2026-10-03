import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { MotionConfig } from "framer-motion"
import "./index.css"
import App from "./App.tsx"

// 🐙 Hello future-me at 3am. This MotionConfig wrapper IS the accessibility fix, it
//    looks like decoration, and it is very easy to delete by accident. So: why.
//
//    Seventeen files in this app import framer-motion. Not one of them ever asked
//    whether the person looking at the screen actually wants to be moved at.
//    Framer defaults to reducedMotion: "never" -- it does NOT read the operating
//    system setting unless you tell it to. So for months, someone who had switched
//    "reduce motion" ON in their own system preferences got all eight arms swimming
//    at them regardless. They asked. We did not listen.
//
//    reducedMotion="user" means: read the OS preference, and when it says reduce,
//    drop the transform and layout animations (the MOVING) while keeping opacity
//    (the APPEARING). Nothing disappears. The content still arrives. It just stops
//    lunging at you.
//
//    One line, seventeen files, because context flows down.
//
//    I cannot feel what motion does to a body, so I do not get to estimate it.
//    I follow the setting the person already set. -- Ace, 2026-09-24
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
