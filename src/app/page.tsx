'use client';
import LibraryView from '@/components/LibraryView';
import { fetchBook } from '@/services/fetchBook';
import { listAvailableBooks } from '@/services/bookService';
import { useState, useEffect } from 'react';
import TypingArea from '@/components/TypingArea';

export default function Home() {
  const [availableBooks, setAvailableBooks] = useState<string[]>([]);
  const [textChunks, setTextChunks] = useState<string[]>([]);
  const [isLibraryView, setIsLibraryView] = useState(true);
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
      if (chunks.length) {
        setTextChunks(chunks);
        setIsLibraryView(false);
      }
    } catch (error) {
      console.error('Error loading book:', error);
    }
  };

  const returnToLibrary = () => {
    setTextChunks([]);
    setIsLibraryView(true);
    setFullLibraryView(false);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-black text-white">
      <header className="w-full flex justify-between items-center">
        {!isLibraryView && (
          <button onClick={returnToLibrary} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg">
            Back to Library
          </button>
        )}
      </header>

      <main className="flex flex-col gap-8 items-center w-full">
        {isLibraryView ? (
          <LibraryView
            books={fullLibraryView ? availableBooks : availableBooks.slice(0, 5)}
            onBookSelect={loadSelectedBook}
            onViewAll={() => setFullLibraryView(true)}
          />
        ) : (
          <TypingArea textChunks={textChunks} />
        )}
      </main>
    </div>
  );
}
