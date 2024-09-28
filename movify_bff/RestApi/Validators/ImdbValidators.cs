using System.Text.RegularExpressions;

namespace RestApi.Validators;

public static partial class ImdbValidators
{
    [GeneratedRegex(@"^tt\d+$")]
    private static partial Regex IdRegex();

    public static bool IsValidImdbId(string id, out string? message)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            message = "ID is required.";
            return false;
        }

        if (!IdRegex().IsMatch(id))
        {
            message = "Invalid movie ID.";
            return false;
        }

        message = null;
        return true;
    }
}