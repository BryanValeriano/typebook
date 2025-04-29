import BookProgress from "@/server/entities/BookProgress";
import IBookProgressRepository from "@/server/repositories/IBookProgressRepository";

type Dependencies = {
  bookProgressRepository: IBookProgressRepository;
}

type Input = Omit<BookProgress, "id" | "updatedAt">;

export default class SaveBookProgressService {
  private bookProgressRepository: IBookProgressRepository;

  constructor({ bookProgressRepository }: Dependencies) {
    this.bookProgressRepository = bookProgressRepository;
  }

  public async execute({ userID, bookID, currentChunkIndex, totalTypedCharacters, totalMistakes }: Input): Promise<BookProgress> {
    const id = `${userID}-${bookID}}`;
    const bookProgress = new BookProgress({
      id: id,
      userID,
      bookID,
      currentChunkIndex,
      totalTypedCharacters,
      totalMistakes,
      updatedAt: new Date(),
    });
    await this.bookProgressRepository.saveBookProgress(bookProgress);
    return bookProgress;
  }
}
