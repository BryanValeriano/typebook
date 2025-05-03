import TypingArea from '@/components/TypingArea';
import { headers } from 'next/headers';

export default async function TypingPage({ params }: { params: { bookId: string } }) {
  const bookId = params.bookId;

  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  //const [textRes, progressRes] = await Promise.all([
  //  fetch(`${baseUrl}/api/bookText/${bookId}`, { cache: 'no-store' }),
  //  fetch(`${baseUrl}/api/progress/${bookId}`, { cache: 'no-store' }),
  //]);
  const textRes = await fetch(`${baseUrl}/api/bookText/${bookId}`, { cache: 'no-store' });
  const progressRes = {
    ok: true,
    json: async () => ({
      progress: {
        currentChunkIndex: 0,
        totalMistakes: 0,
        totalCharacters: 0,
      },
    }),
  }

  if (!textRes.ok || !progressRes.ok) {
    return <div className="text-red-500">Failed to load book data.</div>;
  }

  const { chunks } = await textRes.json();
  const { progress } = await progressRes.json();

  return (
    <TypingArea
      bookId={bookId}
      textChunks={chunks}
      initialChunkIndex={progress?.currentChunkIndex ?? 0}
      totalMistakes={progress?.totalMistakes ?? 0}
      totalCharacters={progress?.totalCharacters ?? 0}
    />
  );
}

