using System.Text;
using Domain.Dto.Movie;
using Domain.Models;
using Domain.Repositories.MovieRepository;
using Domain.Repositories.MovieRepository.Props;
using Infrastructure.Interfaces;

namespace Infrastructure.Repositories;

public class MovieRepository(IHttpDataSource httpDataSource) : IMovieRepository
{
    private const string ApiKey = "731e41f";

    public async Task<ListResult<Movie>> SearchMoviesAsync(MovieFilter filter, CancellationToken cancellationToken)
    {
        var uri = BuildSearchUri(filter);
        var movies = await httpDataSource.GetAsync<ListResult<Movie>>(uri, cancellationToken);

        return movies;
    }

    public async Task<MovieDetails?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        var query = BaseQueryBuilder().Append($"&i={id}");
        var uri = new Uri(query.ToString(), UriKind.Relative);
        var movies = await httpDataSource.GetAsync<MovieDetails>(uri, cancellationToken);

        return movies;
    }

    private static StringBuilder BaseQueryBuilder()
    {
        return new StringBuilder($"?apikey={ApiKey}");
    }

    private static Uri BuildSearchUri(MovieFilter filter)
    {
        var queryStringBuilder = BaseQueryBuilder()
            .Append($"&s={filter.Title}")
            .Append($"&page={filter.Page}");

        if (filter.Year.HasValue) queryStringBuilder.Append($"&y={filter.Year}");

        if (!string.IsNullOrWhiteSpace(filter.Type)) queryStringBuilder.Append($"&t={filter.Type}");

        return new Uri(queryStringBuilder.ToString(), UriKind.Relative);
    }
}