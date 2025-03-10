'use client';

type TypingTextProps = {
  targetText: string;
  currentPos: number;
  mistakes: boolean[];
  isFocused: boolean;
};

export default function TypingText({
  targetText,
  currentPos,
  mistakes,
  isFocused,
}: TypingTextProps) {
  return (
    <div className="text-xl font-mono whitespace-pre-wrap break-words max-w-2xl">
      {targetText.split('').map((char, index) => {
        const isCurrent = index === currentPos;
        const isPast = index < currentPos;
        const isMistake = mistakes[index];

        // Add "blinking-cursor" only if it's the current character and we are focused
        const classes = [
          isCurrent && isFocused ? 'blinking-cursor' : '',
          isPast ? (isMistake ? 'text-red-500' : 'text-gray-500') : 'text-white'
        ];

        return (
          <span key={index} className={classes.join(' ')}>
            {char}
          </span>
        );
      })}
    </div>
  );
}

