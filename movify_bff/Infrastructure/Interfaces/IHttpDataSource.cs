namespace Infrastructure.Interfaces;

public interface IHttpDataSource
{
    Task<T> GetAsync<T>(Uri uri, CancellationToken cancellationToken);
}