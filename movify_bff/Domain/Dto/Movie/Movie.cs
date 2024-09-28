using System.Text.Json.Serialization;

namespace Domain.Dto.Movie;

[method: JsonConstructor]
public record Movie(string Title, string Year, string ImdbId, string Type, string Poster);