'use client';

import LibraryView from '@/components/LibraryView';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MyBooksPage() {
  const [availableBooks, setAvailableBooks] = useState<string[]>([]);
  const [fullLibraryView, setFullLibraryView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('/api/users/3/books', { cache: 'no-store' }); // adjust later for real user
        const books = await res.json();
        setAvailableBooks(books);
      } catch (err) {
        console.error('Error loading books:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const handleBookSelect = (bookId: string) => {
    router.push(`/typing/${bookId}`);
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading your books...</div>;
  }

  return (
    <LibraryView
      books={fullLibraryView ? availableBooks : availableBooks.slice(0, 5)}
      onBookSelect={handleBookSelect}
      onViewAll={() => setFullLibraryView(true)}
    />
  );
}

