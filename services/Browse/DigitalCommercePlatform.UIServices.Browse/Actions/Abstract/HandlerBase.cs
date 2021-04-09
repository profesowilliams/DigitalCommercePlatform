using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.Abstract
{
    public abstract class HandlerBase<T> where T : class
    {
        protected ILogger Logger { get; }
        protected IHttpClientFactory HttpClientFactory { get; }

        protected HandlerBase(ILoggerFactory loggerFactory, IHttpClientFactory httpClientFactory)
        {
            Logger = loggerFactory.CreateLogger<T>();
            HttpClientFactory = httpClientFactory;
        }

        protected async Task<TResponse> GetAsync<TResponse>(Uri uri, string token, CancellationToken cancellationToken)
        {
            // this is temp code once DF team exposes the clitent we need to replace this code.
            using HttpClient httpClient = HttpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");

            using var httpRequest = new HttpRequestMessage()
            {
                RequestUri = uri,
                Method = HttpMethod.Get,
            };
            var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true, };

            HttpResponseMessage response = await httpClient.SendAsync(httpRequest, cancellationToken);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<TResponse>(responseBody, serializerOptions);
            return data;
        }
    }
}