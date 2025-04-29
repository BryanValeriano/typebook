import BookProgress from "@/server/entities/BookProgress";
import IBookProgressRepository from "@/server/repositories/IBookProgressRepository";

type Dependencies = {
  bookProgressRepository: IBookProgressRepository;
};


export default class GetBookProgressService {
  private bookProgressRepository: IBookProgressRepository;

  constructor({ bookProgressRepository }: Dependencies) {
    this.bookProgressRepository = bookProgressRepository;
  }

  public async execute(userID: number, bookID: number): Promise<BookProgress | void> {
    const bookProgress = await this.bookProgressRepository.getProgressByUserAndBookIDs(userID, bookID);
    return bookProgress;
  }
}
