type BookConstructor = {
  id: string;
  title: string;
  authorName: string;
  description: string;
  coverImage: string;
}

export default class Book {
  public id: string;
  public title: string;
  public authorName: string;
  public description: string;
  public coverImage: string;

  constructor(book: BookConstructor) {
    this.id = book.id;
    this.title = book.title;
    this.authorName = book.authorName;
    this.description = book.description;
    this.coverImage = book.coverImage;
  }
}
