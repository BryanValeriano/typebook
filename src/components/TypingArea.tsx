'use client';

import { useState, useEffect, useRef } from 'react';
import TypingText from './TypingText';
import HiddenTextarea from './HiddenTextarea';
import ProgressBar from './ProgressBar';

interface TypingAreaProps {
  textChunks: string[];
  bookId: string;
  initialChunkIndex?: number;
  totalCharacters?: number;
  totalMistakes?: number;
  onComplete?: () => void;
}

export default function TypingArea({
  textChunks,
  bookId,
  initialChunkIndex = 0,
  totalCharacters = 0,
  totalMistakes = 0,
  onComplete,
}: TypingAreaProps) {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(initialChunkIndex);
  const [targetText, setTargetText] = useState('');
  const [currentPos, setCurrentPos] = useState(0);
  const [mistakes, setMistakes] = useState<boolean[]>([]);
  const [currentMistake, setCurrentMistake] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const [cursorFlash, setCursorFlash] = useState(false);

  const [cumulativeCharacters, setCumulativeCharacters] = useState(totalCharacters);
  const [cumulativeMistakes, setCumulativeMistakes] = useState(totalMistakes);

  const hiddenTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (textChunks.length > 0) {
      setTargetText(textChunks[currentChunkIndex]);
    }
  }, [textChunks, currentChunkIndex]);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!isFocused) {
      setIsFocused(true);
      hiddenTextareaRef.current?.focus();
    }

    if (e.key.length === 1) {
      const normalizedTypedKey = e.key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedTargetChar = targetText[currentPos].normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (normalizedTypedKey.toLowerCase() === normalizedTargetChar.toLowerCase()) {
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        setCursorFlash(true);
        flashTimeoutRef.current = setTimeout(() => setCursorFlash(false), 800);

        if (currentPos < targetText.length - 1) {
          setMistakes(prev => [...prev, currentMistake]);
          setCurrentPos(prev => prev + 1);
          setCurrentMistake(false);
        } else {
          const nextChunkIndex = currentChunkIndex + 1;
          const charsTyped = targetText.length;
          const mistakesCount = mistakes.filter(Boolean).length + (currentMistake ? 1 : 0);

          const updatedCharacters = cumulativeCharacters + charsTyped;
          const updatedMistakes = cumulativeMistakes + mistakesCount;

          if (nextChunkIndex < textChunks.length) {
            setCurrentChunkIndex(nextChunkIndex);
            setCurrentPos(0);
            setMistakes([]);
            setCurrentMistake(false);

            setCumulativeCharacters(updatedCharacters);
            setCumulativeMistakes(updatedMistakes);

            const progress = ((nextChunkIndex + 1) / textChunks.length) * 100;
            setOverallProgress(Math.round(progress));

            // Save progress
            fetch(`/api/progress/${bookId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                currentChunkIndex: nextChunkIndex,
                totalCharacters: updatedCharacters,
                totalMistakes: updatedMistakes,
              }),
            });
          } else {
            onComplete?.();
          }
        }
      } else {
        setCurrentMistake(true);
      }
    }
  };

  const handleOverlayClick = () => {
    setIsFocused(true);
    hiddenTextareaRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl">
      {!isFocused && (
        <div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50 cursor-pointer"
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
          cursorFlash={cursorFlash}
        />

        <HiddenTextarea
          textareaRef={hiddenTextareaRef}
          handleKeyDown={handleKeyPress}
          onFocusChange={setIsFocused}
        />

        <div className="text-sm text-gray-400">
          Progress: {overallProgress}% ({currentChunkIndex + 1}/{textChunks.length} chunks)
        </div>
      </div>
    </div>
  );
}

