using Domain.Dto.Movie;
using Domain.Models;
using Domain.Repositories.MovieRepository.Props;

namespace Domain.Repositories.MovieRepository;

public interface IMovieRepository
{
    Task<ListResult<Movie>> SearchMoviesAsync(MovieFilter filter, CancellationToken cancellationToken);
    Task<MovieDetails?> GetByIdAsync(string id, CancellationToken cancellationToken);
}