'use client';
import HiddenTextarea from '@/components/HiddenTextarea';
import ProgressBar from '@/components/ProgressBar';
import TypingText from '@/components/TypingText';
import { fetchBook } from '@/services/fetchBook';
import { useState, useEffect, useRef } from 'react';

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
  // Track whether the textarea is focused
  const [isFocused, setIsFocused] = useState(true);
  // We'll also store a ref to the hidden textarea so we can programmatically focus it
  const hiddenTextareaRef = useRef<HTMLTextAreaElement | null>(null);


  // Fetch and prepare text chunks
  useEffect(() => {
    async function loadBook() {
      const chunks = await fetchBook();

      if (!chunks.length) {
        setTargetText("Failed to load text. Please try again.");
      } else {
        setTextChunks(chunks);
        setTargetText(chunks[0]);
      }
    }

    loadBook();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!isFocused) {
      setIsFocused(true);
      hiddenTextareaRef.current?.focus();
    }
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
  const handleFocusChange = (focused: boolean) => {
    setIsFocused(focused);
  };

  // If user clicks or presses any key on the overlay, re-focus the textarea
  const handleOverlayClick = () => {
    setIsFocused(true);
    hiddenTextareaRef.current?.focus();
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-black text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        {/* If not focused, show overlay */}
        {!isFocused && (
          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center
                     bg-black bg-opacity-70 text-white z-50 cursor-pointer"
            onClick={handleOverlayClick}
          >
            <p className="text-lg font-semibold text-center px-4">
              Click here or press any key to focus
            </p>
          </div>
        )}
        <div className="flex flex-col gap-8 items-center">
          <h1 className="text-2xl font-bold mb-8">Typing Speed Test</h1>

          <ProgressBar overallProgress={overallProgress} />
          <TypingText
            targetText={targetText}
            currentPos={currentPos}
            mistakes={mistakes}
            isFocused={isFocused}
          />
          <HiddenTextarea
            textareaRef={hiddenTextareaRef as React.RefObject<HTMLTextAreaElement>}
            handleKeyDown={handleKeyPress}
            onFocusChange={handleFocusChange}
          />
          <div className="text-sm text-gray-400">
            Progress: {overallProgress}% ({currentChunkIndex + 1}/{textChunks.length} chunks)
          </div>

        </div>
      </main>
    </div>
  );
}
