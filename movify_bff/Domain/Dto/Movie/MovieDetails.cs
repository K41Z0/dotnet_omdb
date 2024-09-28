using System.Text.Json.Serialization;

namespace Domain.Dto.Movie;

[method: JsonConstructor]
public record MovieDetails(
    string Title,
    string Year,
    string ImdbId,
    string Type,
    string Poster,
    string Rated,
    string Released,
    string Runtime,
    string Genre,
    string Director,
    string Writer,
    string Actors,
    string Plot,
    string Language,
    string Country,
    string Awards,
    List<Rating> Ratings,
    string Metascore,
    string ImdbRating,
    string ImdbVotes,
    string Dvd,
    string BoxOffice,
    string Production,
    string Website,
    string Response)
    : Movie(Title, Year, ImdbId, Type, Poster);