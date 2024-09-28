using System.Text.Json.Serialization;

namespace Domain.Models;

[method: JsonConstructor]
public class ListResult<T>()
{
    [JsonPropertyOrder(-4)]
    [JsonPropertyName("search")]
    public IReadOnlyCollection<T> Search { get; set; } = new List<T>();

    [JsonPropertyOrder(-3)]
    [JsonPropertyName("totalResults")]
    public int TotalResults { get; set; } = 0;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyOrder(-2)]
    [JsonPropertyName("errorMessage")]
    public string? ErrorMessage { get; set; } = null;

    [JsonPropertyOrder(-1)]
    [JsonPropertyName("hasError")]
    public bool HasError => ErrorMessage != null && !string.IsNullOrWhiteSpace(ErrorMessage?.Trim());
}