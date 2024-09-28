using System.Text.Json.Serialization;
using Domain.Dto.Movie;

namespace Infrastructure.Models;

[method: JsonConstructor]
public class OmDbMovieSearchResponse()
{
    [JsonPropertyOrder(-4)]
    [JsonPropertyName("Search")]
    public IReadOnlyCollection<Movie> Search { get; set; } = new List<Movie>();

    [JsonPropertyOrder(-3)]
    [JsonPropertyName("totalResults")]
    public int TotalResults { get; set; } = 0;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyOrder(-2)]
    [JsonPropertyName("Error")]
    public string? ErrorMessage { get; set; } = null;

    [JsonPropertyOrder(-1)]
    [JsonPropertyName("Response")]
    public bool HasError => ErrorMessage != null && !string.IsNullOrWhiteSpace(ErrorMessage?.Trim());
}