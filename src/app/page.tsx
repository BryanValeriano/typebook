'use client';
import HiddenTextarea from '@/components/HiddenTextarea';
import ProgressBar from '@/components/ProgressBar';
import TypingText from '@/components/TypingText';
import LibraryView from '@/components/LibraryView';
import { fetchBook } from '@/services/fetchBook';
import { listAvailableBooks } from '@/services/bookService';
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
  // Track whether to show the cursor flash
  const [cursorFlash, setCursorFlash] = useState(false);
  // We'll also store a ref to the hidden textarea so we can programmatically focus it
  const hiddenTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  // This ref holds the current timeout ID
  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // New state for library view
  const [isLibraryView, setIsLibraryView] = useState(true);
  const [availableBooks, setAvailableBooks] = useState<string[]>([]);
  const [fullLibraryView, setFullLibraryView] = useState(false);


  // Fetch available books
  useEffect(() => {
    async function loadAvailableBooks() {
      const books = await listAvailableBooks();
      setAvailableBooks(books);
    }

    loadAvailableBooks();
  }, []);

  // Fetch and prepare text chunks
  const loadSelectedBook = async (bookName: string) => {
    try {
      const chunks = await fetchBook(bookName);

      if (!chunks.length) {
        setTargetText("Failed to load text. Please try again.");
      } else {
        setTextChunks(chunks);
        setTargetText(chunks[0]);
        setIsLibraryView(false);
      }
    } catch (error) {
      console.error('Error loading book:', error);
      setTargetText("Failed to load text. Please try again.");
    }
  };

  // Method to return to library
  const returnToLibrary = () => {
    console.log("teste")
    // Reset all typing-related states
    setTextChunks([]);
    setCurrentChunkIndex(0);
    setTargetText('');
    setCurrentPos(0);
    setMistakes([]);
    setCurrentMistake(false);
    setOverallProgress(0);
    setIsFocused(true);

    // Return to library view
    setIsLibraryView(true);
    setFullLibraryView(false);

    // Ensure textarea is unfocused
    if (hiddenTextareaRef.current) {
      hiddenTextareaRef.current.blur();
    }
  };

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
        // Clear existing timeout
        if (flashTimeoutRef.current) {
          clearTimeout(flashTimeoutRef.current);
        }
        // Trigger a brief "flash" so the cursor is fully visible
        setCursorFlash(true);
        // Start a new timer
        flashTimeoutRef.current = setTimeout(() => {
          setCursorFlash(false);
        }, 800);

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
    <div className="grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-black text-white">
      {/* Global Header with Library Button */}
      <header className="w-full flex justify-between items-center row-start-1 mb-4">
        {!isLibraryView && (
          <button
            onClick={returnToLibrary}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            Back to Library
          </button>
        )}
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center w-full">
        {isLibraryView ? (
          <LibraryView
            books={fullLibraryView ? availableBooks : availableBooks.slice(0, 5)}
            onBookSelect={loadSelectedBook}
            onViewAll={() => setFullLibraryView(true)}
          />
        ) : (
          <div className="relative w-full max-w-2xl">
            {/* Typing Area Container */}
            <div className="relative">
              {/* Focus Overlay */}
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

              {/* Typing Content */}
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
                  textareaRef={hiddenTextareaRef as React.RefObject<HTMLTextAreaElement>}
                  handleKeyDown={handleKeyPress}
                  onFocusChange={handleFocusChange}
                />
                <div className="text-sm text-gray-400">
                  Progress: {overallProgress}% ({currentChunkIndex + 1}/{textChunks.length} chunks)
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );

}
