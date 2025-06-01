'use client';

import LibraryView from '@/components/LibraryView';
import Book from '@/server/entities/Book';
import { useState, useEffect } from 'react';

export default function Home() {
  const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('/api/books', { cache: 'no-store' }); // adjust later for real user
        const reponse = await res.json();
        const books = reponse.response || [];
        setAvailableBooks(books);
      } catch (err) {
        console.error('Error loading books:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (isLoading) {
    return <div className="text-gray-400">Loading your books...</div>;
  }

  return (
    <LibraryView
      books={availableBooks}
    />
  );
}

