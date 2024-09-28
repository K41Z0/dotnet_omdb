using System.Net.Http.Json;
using System.Text.Json;
using Infrastructure.Interfaces;

namespace Infrastructure.DataSources;

public class OmDbDataSource(HttpClient httpClient) : IHttpDataSource
{
    public async Task<T> GetAsync<T>(Uri uri, CancellationToken cancellationToken)
    {
        var httpResponse = await httpClient.GetAsync(uri, cancellationToken);

        if (httpResponse.IsSuccessStatusCode)
            try
            {
                var response = await httpResponse.Content.ReadFromJsonAsync<T>(cancellationToken);
                if (response == null) throw new Exception("Failed to deserialize JSON response.");

                return response;
            }
            catch (HttpRequestException ex)
            {
                throw new Exception("Error occurred while making the HTTP request.", ex);
            }
            catch (NotSupportedException ex)
            {
                throw new Exception("The content type is not supported.", ex);
            }
            catch (JsonException ex)
            {
                throw new Exception("Error occurred while deserializing the JSON content.", ex);
            }
            catch (OperationCanceledException ex)
            {
                throw new Exception("The operation was canceled.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("Unexpected error", ex);
            }

        var contentMessage = await httpResponse.Content.ReadAsStringAsync(cancellationToken);

        throw new HttpRequestException(contentMessage, null, httpResponse.StatusCode);
    }
}