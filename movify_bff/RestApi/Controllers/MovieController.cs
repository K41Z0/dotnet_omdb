using Domain.Dto.Movie;
using Domain.Models;
using Domain.Repositories.MovieRepository;
using Domain.Repositories.MovieRepository.Props;
using Microsoft.AspNetCore.Mvc;
using RestApi.Exceptions;
using RestApi.Validators;

namespace RestApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController(IMovieRepository movieRepository) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<MovieDetails>> GetMovieById(string id, CancellationToken cancellationToken = default)
    {
        if (!ImdbValidators.IsValidImdbId(id, out var validationMessage)) return BadRequest(validationMessage);

        var movie = await movieRepository.GetByIdAsync(id, cancellationToken);
        if (movie == null || (!string.IsNullOrWhiteSpace(movie.Response) && movie.Response == "False")) 
            return NotFound($"Movie with ID '{id}' was not found.");

        return Ok(movie);
    }

    [HttpGet("search")]
    public async Task<ActionResult<ListResult<Movie>>> SearchMovies(
        [FromQuery] string title = "",
        [FromQuery] int page = 1,
        [FromQuery] int? year = null,
        [FromQuery] string? type = null,
        CancellationToken cancellationToken = default
    )
    {
        if (string.IsNullOrWhiteSpace(title)) return BadRequest("Movie title is required");

        if (title.Length < 2) return BadRequest("Movie title must be at least 2 characters long. Please try again.");

        var filter = new MovieFilter
        {
            Title = title,
            Page = page,
            Year = year,
            Type = type
        };

        var movies = await movieRepository.SearchMoviesAsync(filter, cancellationToken);
        if (movies.HasError) throw new NotFoundException(movies.ErrorMessage);

        return Ok(movies);
    }
}