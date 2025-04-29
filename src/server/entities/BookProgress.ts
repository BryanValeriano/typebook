type BookProgressConstructor = {
  id: string;
  userID: number;
  bookID: number;
  currentChunkIndex: number;
  totalTypedCharacters: number;
  totalMistakes: number;
  updatedAt: Date;
}

export default class BookProgress {
  public id: string;
  public userID: number;
  public bookID: number;
  public currentChunkIndex: number;
  public totalTypedCharacters: number;
  public totalMistakes: number;
  public updatedAt: Date;


  constructor(bookProgress: BookProgressConstructor) {
    this.id = bookProgress.id;
    this.userID = bookProgress.userID;
    this.bookID = bookProgress.bookID;
    this.currentChunkIndex = bookProgress.currentChunkIndex;
    this.totalTypedCharacters = bookProgress.totalTypedCharacters;
    this.totalMistakes = bookProgress.totalMistakes;
    this.updatedAt = bookProgress.updatedAt;
  }
}
