using RestApi.Validators;
using Xunit;

namespace RestApi.Text.Validators;

public class ImdbValidatorsTests
{
    [Theory]
    [InlineData("tt0000001", true, null)]
    [InlineData("", false, "ID is required.")]
    [InlineData("tt", false, "Invalid movie ID.")]
    [InlineData("1234567", false, "Invalid movie ID.")]
    public void IsValidImdbId_TestCases(string id, bool expectedIsValid, string? expectedMessage)
    {
        var isValid = ImdbValidators.IsValidImdbId(id, out var message);

        Assert.Equal(expectedIsValid, isValid);
        Assert.Equal(expectedMessage, message);
    }
}