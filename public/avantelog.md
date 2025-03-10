> I want you to behave like a tutor teaching me react and nextjs. I am an experienced programmer, but I don't work with frontend. I have used react and nextjs in the past, but I dont remember much.
> For the teaching we are going to develop a typingspeed webapp. Our first take is a page with a textarea and some text. There will be an underscore on the characte the user needs to type. The underscore will not advance as long as the user doesnt type the correct character. If the user typed the wrong character at least one time, the character will become red when the underscore advances. If the user typed the correct character on the first attempt, the character will become gray when the underscore advances. The text will be white

I'll help you learn React and Next.js by building a typing speed web app. Let's break this down into steps and explain the concepts as we go.

First, let's understand what we need:

1. State management for:
   - The target text
   - Current position (for the underscore)
   - User input
   - Tracking mistakes

2. React concepts we'll use:
   - useState hook for state management
   - useEffect hook for handling keyboard input
   - Controlled components for the textarea

Let's modify the page with a basic implementation:

Filepath: src/app/page.tsx
Replace lines: 2-14
```typescriptreact
'use client';
import { useState } from 'react';

export default function Home() {
  // The text to type
  const [targetText] = useState("The quick brown fox jumps over the lazy dog.");
  // Current position in the text
  const [currentPos, setCurrentPos] = useState(0);
  // Track which characters were typed incorrectly
  const [mistakes, setMistakes] = useState<boolean[]>([]);
  // Track if current character has been mistyped
  const [currentMistake, setCurrentMistake] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Only handle printable characters
    if (e.key.length === 1) {
      if (e.key === targetText[currentPos]) {
        // Correct key pressed
        if (currentPos < targetText.length - 1) {
          // Move to next character
          setMistakes(prev => [...prev, currentMistake]);
          setCurrentPos(prev => prev + 1);
          setCurrentMistake(false);
        }
      } else {
        // Wrong key pressed
        setCurrentMistake(true);
      }
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-black text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="flex flex-col gap-8 items-center">
          <h1 className="text-2xl font-bold mb-8">Typing Speed Test</h1>
          
          {/* Display area for text */}
          <div className="text-xl font-mono whitespace-pre">
            {targetText.split('').map((char, index) => (
              <span key={index} 
                className={`
                  ${index === currentPos ? 'border-b-2 border-white' : ''}
                  ${index < currentPos ? 
                    (mistakes[index] ? 'text-red-500' : 'text-gray-500') 
                    : 'text-white'}
                `}>
                {char}
              </span>
            ))}
          </div>

          {/* Hidden textarea for capturing input */}
          <textarea
            className="opacity-0 h-1 w-1 absolute"
            autoFocus
            onKeyDown={handleKeyPress}
          />
        </div>
      </main>
    </div>
  );
}
```

Let me explain the key concepts in this implementation:

1. `'use client'` directive:
   - Next.js uses server components by default
   - We need client-side interactivity, so we mark this as a client component

2. State Management:
   ```typescript
   const [targetText] = useState("The quick brown fox...");
   const [currentPos, setCurrentPos] = useState(0);
   const [mistakes, setMistakes] = useState<boolean[]>([]);
   const [currentMistake, setCurrentMistake] = useState(false);
   ```
   - `useState` is a React Hook that lets us add state to functional components
   - Each state variable comes with its setter function
   - We track the current position and mistakes separately

3. Event Handling:
   ```typescript
   const handleKeyPress = (e: React.KeyboardEvent)
   ```
   - We listen for keyboard events
   - Check if the pressed key matches the expected character
   - Update state accordingly

4. Rendering:
   ```typescript
   {targetText.split('').map((char, index) => (
     <span key={index} className={...}>
   ```
   - We split the text into individual characters
   - Each character is wrapped in a span with conditional styling
   - The underscore effect is achieved with a border-bottom
   - Colors change based on whether the character was typed correctly

5. Hidden Textarea:
   - We use a hidden textarea to capture keyboard input
   - It's positioned absolutely and nearly invisible
   - This gives us a native way to handle keyboard input

Try this out - you should see:
- White text with an underscore under the first character
- Characters turn gray when typed correctly
- Characters turn red if you made any mistakes
- The underscore only moves forward on correct input

Would you like me to explain any part in more detail? Or shall we move on to adding more features like:
- WPM calculation
- Timer
- Multiple text samples
- Restart functionality

**Generation complete!** Please review the code suggestions above.


- Selected files:
  - src/app/page.tsx

> I've added a full book in txt on the public/brascubas.txt file. You don't need to read this file, it's very large. I want to import this text and show it on the text area. The text is very large, so we need to show a limit number of words. Every time the user reaches the limit during the typing, we show the next section of the text for the user to type. We can also show a percentage of the progress of the text.

Great idea! We'll modify the component to:
1. Fetch the text file
2. Split it into chunks
3. Implement progressive text loading
4. Add a progress indicator

Here's an implementation:

Filepath: src/app/page.tsx
Replace lines: 1-63
```typescriptreact
'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  // Text chunks from the book
  const [textChunks, setTextChunks] = useState<string[]>([]);
  // Current chunk index
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  // Current text to type
  const [targetText, setTargetText] = useState('');
  // Current position in the text
  const [currentPos, setCurrentPos] = useState(0);
  // Track which characters were typed incorrectly
  const [mistakes, setMistakes] = useState<boolean[]>([]);
  // Track if current character has been mistyped
  const [currentMistake, setCurrentMistake] = useState(false);
  // Overall progress
  const [overallProgress, setOverallProgress] = useState(0);

  // Fetch and prepare text chunks
  useEffect(() => {
    async function fetchBookText() {
      try {
        const response = await fetch('/brascubas.txt');
        const fullText = await response.text();
        
        // Split text into chunks of about 100 words
        const chunks = fullText
          .split(/\s+/)
          .reduce((resultArray, item, index) => { 
            const chunkIndex = Math.floor(index/100);
            
            if(!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = [];
            }
            
            resultArray[chunkIndex].push(item);
            
            return resultArray;
          }, [] as string[][])
          .map(chunk => chunk.join(' '));

        setTextChunks(chunks);
        setTargetText(chunks[0]);
      } catch (error) {
        console.error('Failed to fetch book text', error);
        setTargetText("Failed to load text. Please try again.");
      }
    }

    fetchBookText();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Only handle printable characters
    if (e.key.length === 1) {
      if (e.key === targetText[currentPos]) {
        // Correct key pressed
        if (currentPos < targetText.length - 1) {
          // Move to next character
          setMistakes(prev => [...prev, currentMistake]);
          setCurrentPos(prev => prev + 1);
          setCurrentMistake(false);
        } else {
          // Reached end of current chunk
          if (currentChunkIndex < textChunks.length - 1) {
            const nextChunkIndex = currentChunkIndex + 1;
            setCurrentChunkIndex(nextChunkIndex);
            setTargetText(textChunks[nextChunkIndex]);
            setCurrentPos(0);
            setMistakes([]);
            setCurrentMistake(false);

            // Calculate overall progress
            const progress = ((nextChunkIndex + 1) / textChunks.length) * 100;
            setOverallProgress(Math.round(progress));
          }
        }
      } else {
        // Wrong key pressed
        setCurrentMistake(true);
      }
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-black text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="flex flex-col gap-8 items-center">
          <h1 className="text-2xl font-bold mb-8">Typing Speed Test</h1>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-2 mb-4">
            <div 
              className="bg-green-500 h-2" 
              style={{width: `${overallProgress}%`}}
            ></div>
          </div>

          {/* Display area for text */}
          <div className="text-xl font-mono whitespace-pre-wrap break-words max-w-2xl">
            {targetText.split('').map((char, index) => (
              <span key={index}
                className={`
                  ${index === currentPos ? 'border-b-2 border-white' : ''}
                  ${index < currentPos ?
                    (mistakes[index] ? 'text-red-500' : 'text-gray-500')
                    : 'text-white'}
                `}>
                {char}
              </span>
            ))}
          </div>

          {/* Hidden textarea for capturing input */}
          <textarea
            className="opacity-0 h-1 w-1 absolute"
            autoFocus
            onKeyDown={handleKeyPress}
          />

          {/* Progress Text */}
          <div className="text-sm text-gray-400">
            Progress: {overallProgress}% ({currentChunkIndex + 1}/{textChunks.length} chunks)
          </div>
        </div>
      </main>
    </div>
  );
}
```

Key changes and explanations:

1. Text Chunk Management
   - `textChunks`: Stores the entire book split into 100-word chunks
   - `currentChunkIndex`: Tracks which chunk we're currently typing
   - `useEffect` to fetch and process the book text on component mount

2. Progress Tracking
   - `overallProgress`: Calculates percentage of book typed
   - Added a progress bar and text indicator
   - Progress updates when a chunk is completed

3. Chunk Progression
   - When a chunk is fully typed, automatically load the next chunk
   - Reset current position, mistakes, etc.

4. Error Handling
   - Added basic error handling for text fetching
   - Fallback text if book can't be loaded

5. Styling Improvements
   - Added `whitespace-pre-wrap` and `break-words` for better text display
   - Progress bar shows overall typing progress

Improvements to consider:
- Add error boundary
- Implement restart functionality
- Add typing speed/accuracy metrics
- Handle very large files more efficiently

Would you like me to elaborate on any part of the implementation?


