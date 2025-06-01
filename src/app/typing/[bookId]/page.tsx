'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TypingArea from '@/components/TypingArea';
import Book from '@/server/entities/Book';

// Splits full text into chunks of roughly `chunkSize` words
function chunkText(fullText: string, chunkSize = 100): string[] {
  return fullText
    .split(/\s+/)
    .reduce<string[][]>((buckets, word, idx) => {
      const i = Math.floor(idx / chunkSize);
      if (!buckets[i]) buckets[i] = [];
      buckets[i].push(word);
      return buckets;
    }, [])
    .map(words => words.join(' '));
}

interface Progress {
  currentChunkIndex: number;
  totalMistakes: number;
  totalCharacters: number;
}

export default function TypingPage() {
  const params = useParams();
  const bookId = params.bookId as string;

  const [book, setBook] = useState<Book | null>(null);
  const [chunks, setChunks] = useState<string[] | null>(null);
  const [progress, setProgress] = useState<Progress>({
    currentChunkIndex: 0,
    totalMistakes: 0,
    totalCharacters: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        // 1. Fetch metadata
        const metaRes = await fetch(`/api/books/${bookId}`, { cache: 'no-store' });
        if (!metaRes.ok) throw new Error(`Metadata fetch failed (${metaRes.status})`);
        const response = await metaRes.json();
        const bookData = response.response as Book;
        setBook(bookData);

        console.log('Book metadata:', bookData);

        // 2. Fetch raw text
        const textUrl = bookData.urlTextSource.startsWith('/')
          ? bookData.urlTextSource
          : `/${bookData.urlTextSource}`;
        const textRes = await fetch(textUrl, { cache: 'no-store' });
        if (!textRes.ok) throw new Error(`Text fetch failed (${textRes.status})`);
        const fullText = await textRes.text();
        setChunks(chunkText(fullText));

        // 3. Fetch progress
        // const progRes = await fetch(`/api/progress/${bookId}`, { cache: 'no-store' });
        // if (!progRes.ok) throw new Error(`Progress fetch failed (${progRes.status})`);
        //const { progress: prog } = await progRes.json();
        const prog = {
          currentChunkIndex: 0,
          totalMistakes: 0,
          totalCharacters: 0,
        }; // Placeholder
        setProgress(prog);
      } catch (e: any) {
        console.error('Error loading book data:', e);
        setError(e.message);
      }
    }

    loadAll();
  }, [bookId]);

  // Error state
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  // Loading state
  if (!book || !chunks) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{book.title}</h1>
        <p className="text-gray-600">by {book.authorName}</p>
        {book.description && <p className="mt-2">{book.description}</p>}
      </header>
      <TypingArea
        bookId={bookId}
        textChunks={chunks}
        initialChunkIndex={progress.currentChunkIndex}
        totalMistakes={progress.totalMistakes}
        totalCharacters={progress.totalCharacters}
      />
    </div>
  );
}

