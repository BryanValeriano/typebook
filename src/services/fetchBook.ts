export async function fetchBook(bookname: string): Promise<string[]> {
  try {
    const response = await fetch(`/books/${bookname}.txt`);
    const fullText = await response.text();
    // Split text into chunks of ~100 words
    const chunks = fullText
      .split(/\s+/)
      .reduce((resultArray, word, index) => {
        const chunkIndex = Math.floor(index / 100);
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [];
        }
        resultArray[chunkIndex].push(word);
        return resultArray;
      }, [] as string[][])
      .map(chunk => chunk.join(' '));
    return chunks;
  } catch (error) {
    console.error('Failed to fetch book text', error);
    return [];
  }
}

