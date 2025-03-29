import React from 'react';

interface LibraryViewProps {
  books: string[];
  onBookSelect: (book: string) => void;
  onViewAll: () => void;
}

export default function LibraryView({
  books,
  onBookSelect,
  onViewAll
}: LibraryViewProps) {
  return (
    <div className="bg-black text-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Book Library</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {books.map((book, index) => (
          <button
            key={index}
            onClick={() => onBookSelect(book)}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors"
          >
            {book.replace('.txt', '')}
          </button>
        ))}
      </div>

      {books.length >= 5 && (
        <div className="text-center">
          <button
            onClick={onViewAll}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg"
          >
            View Full Library
          </button>
        </div>
      )}
    </div>
  );
}
