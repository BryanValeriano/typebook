'use client';

type HiddenTextareaProps = {
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function HiddenTextarea({ handleKeyDown }: HiddenTextareaProps) {
  return (
    <textarea
      className="opacity-0 h-1 w-1 absolute"
      autoFocus
      onKeyDown={handleKeyDown}
    />
  );
}

