using System.Text.Json.Serialization;

namespace Domain.Dto.Movie;

[method: JsonConstructor]
public record Rating(string Source, string Value);