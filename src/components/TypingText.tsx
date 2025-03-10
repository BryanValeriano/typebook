'use client';

type TypingTextProps = {
  targetText: string;
  currentPos: number;
  mistakes: boolean[];
};

export default function TypingText({
  targetText,
  currentPos,
  mistakes,
}: TypingTextProps) {
  return (
    <div className="text-xl font-mono whitespace-pre-wrap break-words max-w-2xl">
      {targetText.split('').map((char, index) => {
        const isCurrent = index === currentPos;
        const isPast = index < currentPos;
        const isMistake = mistakes[index];

        return (
          <span
            key={index}
            className={[
              isCurrent ? 'border-b-2 border-white' : '',
              isPast ? (isMistake ? 'text-red-500' : 'text-gray-500') : 'text-white',
            ].join(' ')}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}

