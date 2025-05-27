type BookProgressConstructor = {
  id: string;
  userID: string;
  bookID: string;
  currentChunkIndex: string;
  totalTypedCharacters: string;
  totalMistakes: string;
  updatedAt: Date;
}

export default class BookProgress {
  public id: string;
  public userID: string;
  public bookID: string;
  public currentChunkIndex: string;
  public totalTypedCharacters: string;
  public totalMistakes: string;
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
