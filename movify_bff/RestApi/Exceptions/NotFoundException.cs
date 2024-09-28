namespace RestApi.Exceptions;

internal class NotFoundException(string? message) : Exception(message);