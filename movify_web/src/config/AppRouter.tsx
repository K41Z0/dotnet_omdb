import {SearchMovieContextProvider} from 'context/SearchMovieContext';
import HomePage from 'pages/HomePage/HomePage';
import NotFoundPage from 'pages/NotFoundPage/NotFoundPage';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {MovieService} from 'services/MovieService';
import {IMovieService} from 'interfaces/IMovieService';
import MovieDetailsPage from "pages/MovieDetailsPage/MovieDetailsPage";

const movieService: IMovieService = new MovieService('http://localhost:5254/api/');

const AppRouter: React.FC = () => {
    return (
        <SearchMovieContextProvider movieService={movieService}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/details/:id" element={<MovieDetailsPage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </Router>
        </SearchMovieContextProvider>
    );
};

export default AppRouter;
