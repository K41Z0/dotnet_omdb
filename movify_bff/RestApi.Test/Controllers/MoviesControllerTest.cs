using Domain.Dto.Movie;
using Domain.Repositories.MovieRepository;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RestApi.Controllers;
using Xunit;

namespace RestApi.Text.Controllers;

[TestSubject(typeof(MoviesController))]
public class MoviesControllerTest
{
    [Fact]
    public async Task GetMovieById_ValidId_MovieNotFound_ReturnsNotFound()
    {
        var mockRepository = new Mock<IMovieRepository>();
        mockRepository.Setup(repo => repo.GetByIdAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((MovieDetails?)null);
        var controller = new MoviesController(mockRepository.Object);
        const string validId = "tt1234567";
        var result = await controller.GetMovieById(validId);
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);

        Assert.Equal($"Movie with ID '{validId}' was not found.", notFoundResult.Value);
    }
}