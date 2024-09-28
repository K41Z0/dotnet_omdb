import {IMovieData} from "interfaces/IMovieData";


export class MovieModel {
    imdbId: string;
    title: string;
    year: string;
    type: string;
    poster: string;

    constructor(object: {
        imdbId: string;
        title: string;
        year: string;
        type: string;
        poster: string;

    }) {
        this.imdbId = object.imdbId;
        this.title = object.title;
        this.year = object.year;
        this.type = object.type;
        this.poster = object.poster;
    }

    static fromMovieData(movieData: IMovieData): MovieModel {
        return new MovieModel({
            imdbId: movieData.imdbId,
            title: movieData.title,
            year: movieData.year,
            type: movieData.type,
            poster: movieData.poster,
        });
    }
}

