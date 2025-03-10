'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  // Text chunks from the book
  const [textChunks, setTextChunks] = useState<string[]>([]);
  // Current chunk index
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  // Current text to type
  const [targetText, setTargetText] = useState('');
  // Current position in the text
  const [currentPos, setCurrentPos] = useState(0);
  // Track which characters were typed incorrectly
  const [mistakes, setMistakes] = useState<boolean[]>([]);
  // Track if current character has been mistyped
  const [currentMistake, setCurrentMistake] = useState(false);
  // Overall progress
  const [overallProgress, setOverallProgress] = useState(0);

  // Fetch and prepare text chunks
  useEffect(() => {
    async function fetchBookText() {
      try {
        const response = await fetch('/brascubas.txt');
        const fullText = await response.text();

        // Split text into chunks of about 100 words
        const chunks = fullText
          .split(/\s+/)
          .reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / 100);

            if (!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = [];
            }

            resultArray[chunkIndex].push(item);

            return resultArray;
          }, [] as string[][])
          .map(chunk => chunk.join(' '));

        setTextChunks(chunks);
        setTargetText(chunks[0]);
      } catch (error) {
        console.error('Failed to fetch book text', error);
        setTargetText("Failed to load text. Please try again.");
      }
    }

    fetchBookText();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Only handle printable characters
    if (e.key.length === 1) {
      // Normalize both the typed key and the target character to handle accents
      const normalizedTypedKey = e.key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedTargetChar = targetText[currentPos].normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (normalizedTypedKey.toLowerCase() === normalizedTargetChar.toLowerCase()) {
        // Correct key pressed
        if (currentPos < targetText.length - 1) {
          // Move to next character
          setMistakes(prev => [...prev, currentMistake]);
          setCurrentPos(prev => prev + 1);
          setCurrentMistake(false);
        } else {
          // Reached end of current chunk
          if (currentChunkIndex < textChunks.length - 1) {
            const nextChunkIndex = currentChunkIndex + 1;
            setCurrentChunkIndex(nextChunkIndex);
            setTargetText(textChunks[nextChunkIndex]);
            setCurrentPos(0);
            setMistakes([]);
            setCurrentMistake(false);

            // Calculate overall progress
            const progress = ((nextChunkIndex + 1) / textChunks.length) * 100;
            setOverallProgress(Math.round(progress));
          }
        }
      } else {
        // Wrong key pressed
        setCurrentMistake(true);
      }
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-black text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="flex flex-col gap-8 items-center">
          <h1 className="text-2xl font-bold mb-8">Typing Speed Test</h1>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-2 mb-4">
            <div
              className="bg-green-500 h-2"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>

          {/* Display area for text */}
          <div className="text-xl font-mono whitespace-pre-wrap break-words max-w-2xl">
            {targetText.split('').map((char, index) => (
              <span key={index}
                className={`
                  ${index === currentPos ? 'border-b-2 border-white' : ''}
                  ${index < currentPos ?
                    (mistakes[index] ? 'text-red-500' : 'text-gray-500')
                    : 'text-white'}
                `}>
                {char}
              </span>
            ))}
          </div>

          {/* Hidden textarea for capturing input */}
          <textarea
            className="opacity-0 h-1 w-1 absolute"
            autoFocus
            onKeyDown={handleKeyPress}
          />

          {/* Progress Text */}
          <div className="text-sm text-gray-400">
            Progress: {overallProgress}% ({currentChunkIndex + 1}/{textChunks.length} chunks)
          </div>
        </div>
      </main>
    </div>
  );
}
