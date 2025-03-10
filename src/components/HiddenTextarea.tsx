'use client';

import { RefObject } from 'react';

type HiddenTextareaProps = {
  textareaRef: RefObject<HTMLTextAreaElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocusChange: (focused: boolean) => void;
};

export default function HiddenTextarea({
  textareaRef,
  handleKeyDown,
  onFocusChange,
}: HiddenTextareaProps) {
  return (
    <textarea
      ref={textareaRef}
      className="opacity-0 h-1 w-1 absolute"
      autoFocus
      onKeyDown={handleKeyDown}
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
    />
  );
}


