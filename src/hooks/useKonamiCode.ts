import { useEffect, useState } from 'react';

// ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export function useKonamiCode(callback: () => void) {
  const [input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newInput = [...input, e.code];
      
      // Only keep the last N keys where N = length of konami code
      if (newInput.length > KONAMI_CODE.length) {
        newInput.shift();
      }
      
      setInput(newInput);
      
      // Check if the sequence matches
      if (newInput.length === KONAMI_CODE.length &&
          newInput.every((key, i) => key === KONAMI_CODE[i])) {
        callback();
        setInput([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, callback]);
}

// Secret: Type "octopus" anywhere
const OCTOPUS_CODE = ['KeyO', 'KeyC', 'KeyT', 'KeyO', 'KeyP', 'KeyU', 'KeyS'];

export function useSecretWord(word: string[], callback: () => void) {
  const [input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newInput = [...input, e.code];
      
      if (newInput.length > word.length) {
        newInput.shift();
      }
      
      setInput(newInput);
      
      if (newInput.length === word.length &&
          newInput.every((key, i) => key === word[i])) {
        callback();
        setInput([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, word, callback]);
}

export { OCTOPUS_CODE };

