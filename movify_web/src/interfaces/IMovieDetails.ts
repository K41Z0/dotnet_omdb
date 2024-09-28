import {IMovieData} from "interfaces/IMovieData";

interface Rating {
    source: string;
    value: string;
}

export interface IMovieDetailsData extends IMovieData {
    rated: string;
    released: string;
    runtime: string;
    genre: string;
    director: string;
    writer: string;
    actors: string;
    plot: string;
    language: string;
    country: string;
    awards: string;
    ratings: Rating[];
    metascore: string;
    imdbRating: string;
    imdbVotes: string;
    dvd: string;
    boxOffice: string;
    production: string;
    website: string;
    response: string;
}
