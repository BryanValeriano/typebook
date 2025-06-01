'use client';
import Link from 'next/link';
import Book from '@/server/entities/Book';

interface Props { books: Book[] }

export default function LibraryView({ books }: Props) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Library</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/typing/${book.id}`}
            className="block bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition"
          >
            <h3 className="text-xl font-semibold">{book.title}</h3>
            <p className="text-sm text-gray-400">by {book.authorName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

