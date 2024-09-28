import {Result} from "types/Result";
import {IMovieData} from "interfaces/IMovieData";
import {IMovieDetailsData} from "interfaces/IMovieDetails";

export interface MoviesResponse {
    list: IMovieData[];
    totalResults: number;
}

export interface ISearchParams {
    input: string;
    year?: string;
    type?: string;
    page?: number;
}

export interface IMovieService {
    searchBy(params: ISearchParams): Promise<Result<MoviesResponse>>;

    movieDetails(id: string): Promise<IMovieDetailsData>;
}