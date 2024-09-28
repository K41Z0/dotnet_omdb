import {IMovieService, MoviesResponse} from "interfaces/IMovieService";
import {MovieModel} from "models/MovieModel";
import {notification} from 'antd';
import React, {createContext, useContext, useRef, useState} from 'react';
import {Result} from "types/Result";
import {CodeEnum} from "enums/CodeEnum";
import {IException} from "interfaces/IException";
import {IMovieDetailsData} from "interfaces/IMovieDetails";

interface ISearchParams {
    input: string;
    year?: string;
    type?: string;
}

export interface IResultState {
    isLoading: boolean;
    list: MovieModel[];
    totalResults: number;
    page: number;
    totalPages: number;
    inputHistory: Map<string, number>;
}

interface ISearchMovieContextState {
    result: IResultState;
    searchBy: (params: ISearchParams) => Promise<void>;
    changePage: (page: number) => Promise<void>;
    getDetails: (id: string) => Promise<IMovieDetailsData | null>;
}

const SearchMovieContext = createContext<ISearchMovieContextState | undefined>(undefined);

const initialResultState: IResultState = {
    isLoading: false,
    list: [],
    totalResults: 0,
    page: 1,
    totalPages: 1,
    inputHistory: new Map<string, number>()
};

export const SearchMovieContextProvider: React.FC<{
    children: React.ReactNode,
    movieService: IMovieService
}> = ({children, movieService}) => {
    const [showNotification, notificationHolder] = notification.useNotification();
    const [result, setResult] = useState<IResultState>(initialResultState);
    const searchParamsHistoryRef = useRef<ISearchParams | null>(null);
    const pageRef = useRef<number>(1);

    const _handleServiceError = (error: IException): void => {
        setResult(prevResult => ({
            ...prevResult,
            isLoading: false,
        }));

        if (error.code === CodeEnum.Info) {
            showNotification['error']({
                message: error.message,
            });
        } else {
            showNotification['error']({
                message: 'Something goes wrong!',
            });
        }
    };

    const _handleServiceSuccess = (
        data: Result<MoviesResponse>,
        params?: ISearchParams,
        page: number = 1,
    ): void => {
        if (data.hasError) return;

        if (data.value.list.length > 0) {
            const mappedValue: MovieModel[] = data.value.list.map(movie => MovieModel.fromMovieData(movie));
            setResult(prevResult => ({
                ...prevResult,
                isLoading: false,
                list: mappedValue,
                totalResults: data.value.totalResults,
                page: page,
                totalPages: data.value.totalResults > 10 ?
                    Math.ceil(data.value.totalResults / data.value.list.length)
                    : 1,
                inputHistory: params ?
                    prevResult.inputHistory.set(params.input.trim(), data.value.totalResults) :
                    prevResult.inputHistory,
            }));
        } else {
            setResult(prevResult => ({
                ...prevResult,
                isLoading: false
            }));
        }
    };

    const searchBy = async (params: ISearchParams): Promise<void> => {
        const input: string = params.input.trim();
        if (input.length < 2) {
            showNotification['warning']({
                message: 'Invalid Input',
                description: 'Please enter at least 2 characters to search for a movie.',
            });
            return;
        }

        setResult(prevResult => ({...prevResult, isLoading: true}));

        try {
            const data = await movieService.searchBy({...params});
            if (data.hasError) {
                _handleServiceError(data.error);
            } else {
                searchParamsHistoryRef.current = params;
                pageRef.current = 1;
                _handleServiceSuccess(data, params);
                showNotification['success']({
                    message: 'Search result',
                    description: `Found ${data.value.totalResults} movies.`,
                });
            }
        } catch {
            _handleServiceError({code: CodeEnum.Info, message: 'Something goes wrong!'});
        }
    };

    const changePage = async (page: number): Promise<void> => {
        if (page === pageRef.current || !searchParamsHistoryRef.current?.input) return;

        setResult(prevResult => ({...prevResult, isLoading: true}));

        try {
            const data = await movieService.searchBy({...searchParamsHistoryRef.current, page});
            if (data.hasError) {
                _handleServiceError(data.error);
            } else {
                pageRef.current = page;
                _handleServiceSuccess(data, undefined, page);
            }
        } catch {
            _handleServiceError({code: CodeEnum.Info, message: 'Something goes wrong!'});
        }
    };

    const getDetails = async (id: string): Promise<IMovieDetailsData | null> => {
        try {
            return await movieService.movieDetails(id);
        } catch (error) {
            showNotification['error']({
                message: 'Something goes wrong!',
            });
            return null;
        }
    }

    return (
        <SearchMovieContext.Provider
            value={{
                result,
                searchBy,
                changePage,
                getDetails,
            }}>
            <>
                {notificationHolder}
                {children}
            </>
        </SearchMovieContext.Provider>
    );
};

export const useSearchMovieContext = () => {
    const context = useContext(SearchMovieContext);
    if (!context) {
        throw new Error('useSearchMovieContext must be used within an SearchMovieContextProvider');
    }
    return context;
};