import {CodeEnum} from "enums/CodeEnum";
import {IMovieService, ISearchParams, MoviesResponse} from "interfaces/IMovieService";
import {Result} from "types/Result";
import {IMovieData} from "interfaces/IMovieData";
import {IMovieDetailsData} from "interfaces/IMovieDetails";

export class MovieService implements IMovieService {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async searchBy(params: ISearchParams): Promise<Result<MoviesResponse>> {
        const queryParams = new URLSearchParams({
            'title': params.input,
            'page': params.page?.toString() ?? (1).toString(),
        });

        if (params.year) {
            queryParams.append('year', params.year);
        }
        if (params.type) {
            queryParams.append('type', params.type);
        }

        let response: Response;
        let json: Record<string, any>;
        try {
            response = await fetch(`${this.baseUrl}movies/search?${queryParams.toString()}`);
            json = await response.json();
        } catch (error: any) {
            return {
                hasError: true,
                error: {
                    code: CodeEnum.InternalError,
                    message: 'Exception with fetch method.',
                },
            };
        }

        if (json.hasError) {
            if (json.errorMessage !== '') {
                return {
                    hasError: true,
                    error: {
                        code: CodeEnum.Info,
                        message: json.Error,
                    },
                };
            }
        }

        if (json.search) {
            return {
                hasError: false,
                value: {
                    list: json.search.map((jsonMovie: Record<string, any>): IMovieData => {
                        return {
                            title: jsonMovie.title,
                            year: jsonMovie.year,
                            imdbId: jsonMovie.imdbId,
                            type: jsonMovie.type,
                            poster: jsonMovie.poster,
                        }
                    }),
                    totalResults: json.totalResults,
                },
            };
        }

        return {
            hasError: true,
            error: {
                code: CodeEnum.InternalError,
                message: '',
            },
        };
    }

    async movieDetails(id: string): Promise<IMovieDetailsData> {
        const response = await fetch(`${this.baseUrl}movies/${id}`).catch((error) => {
            throw new Error(`Failed to fetch movie details: ${error}`);
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json: Record<string, any> = await response.json();

        try {
            return {
                rated: json.rated,
                released: json.released,
                runtime: json.runtime,
                genre: json.genre,
                director: json.director,
                writer: json.writer,
                actors: json.actors,
                plot: json.plot,
                language: json.language,
                country: json.country,
                awards: json.awards,
                ratings: json.ratings.map((rating: Record<string, any>) => ({
                    source: rating.source,
                    value: rating.value
                })),
                metascore: json.metascore,
                imdbRating: json.imdbRating,
                imdbVotes: json.imdbVotes,
                dvd: json.dvd,
                boxOffice: json.boxOffice,
                production: json.production,
                website: json.website,
                response: json.response,
                title: json.title,
                year: json.year,
                imdbId: json.imdbId,
                type: json.type,
                poster: json.poster
            };
        } catch (mappingError) {
            throw new Error(`Error mapping JSON to MovieDetails: ${mappingError}`);
        }
    }
}