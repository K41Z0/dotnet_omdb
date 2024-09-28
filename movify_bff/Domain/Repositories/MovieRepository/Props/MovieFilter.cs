using Domain.Repositories.Props;

namespace Domain.Repositories.MovieRepository.Props;

public class MovieFilter : ListFilter
{
    public required string Title { get; init; }
    public int? Year { get; init; }
    public string? Type { get; init; }
}