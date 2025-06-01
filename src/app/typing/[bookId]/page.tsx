'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TypingArea from '@/components/TypingArea';
import Book from '@/server/entities/Book';

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
  totalTypedCharacters: number;
}

export default function TypingPage() {
  const params = useParams();
  const bookId = params.bookId as string;

  const [book, setBook] = useState<Book | null>(null);
  const [chunks, setChunks] = useState<string[] | null>(null);
  const [progress, setProgress] = useState<Progress>({
    currentChunkIndex: 0,
    totalMistakes: 0,
    totalTypedCharacters: 0,
  });
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadBookMetadata(bookId: string): Promise<Book> {
    const res = await fetch(`/api/books/${bookId}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Metadata fetch failed (${res.status})`);
    }
    const json = await res.json();
    return json.response as Book;
  }

  async function loadTextChunks(urlTextSource: string): Promise<string[]> {
    const textUrl = urlTextSource.startsWith('/') ? urlTextSource : `/${urlTextSource}`;
    const res = await fetch(textUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Text fetch failed (${res.status})`);
    }
    const fullText = await res.text();
    return chunkText(fullText);
  }

  async function loadProgress(bookId: string): Promise<Progress> {
    const res = await fetch(`/api/progress/${bookId}`, { cache: 'no-store' });

    if (res.status === 404) {
      return {
        currentChunkIndex: 0,
        totalMistakes: 0,
        totalTypedCharacters: 0,
      };
    }
    if (!res.ok) {
      throw new Error(`Progress fetch failed (${res.status})`);
    }

    const json = await res.json();
    const raw = json.response as {
      currentChunkIndex: string;
      totalTypedCharacters: string;
      totalMistakes: string;
    };

    return {
      currentChunkIndex: Number(raw.currentChunkIndex) || 0,
      totalMistakes: Number(raw.totalMistakes) || 0,
      totalTypedCharacters: Number(raw.totalTypedCharacters) || 0,
    };
  }

  useEffect(() => {
    async function initialize() {
      try {
        const bookData = await loadBookMetadata(bookId);
        setBook(bookData);

        const textChunks = await loadTextChunks(bookData.urlTextSource);
        setChunks(textChunks);

        const loadedProgress = await loadProgress(bookId);
        setProgress(loadedProgress);
        setProgressLoaded(true);
      } catch (e: any) {
        console.error('Error loading book data:', e);
        setError(e.message);
      }
    }

    initialize();
  }, [bookId]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!book || !chunks || !progressLoaded) {
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
        totalTypedCharacters={progress.totalTypedCharacters}
      />
    </div>
  );
}

