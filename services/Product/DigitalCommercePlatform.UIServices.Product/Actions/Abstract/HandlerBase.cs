using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Actions.Abstract
{
    [ExcludeFromCodeCoverage]
    public abstract class HandlerBase<T> where T : class
    {
        protected readonly ILogger _logger;
        protected readonly IHttpClientFactory _httpClientFactory;

        protected HandlerBase(ILoggerFactory loggerFactory, IHttpClientFactory httpClientFactory)
        {
            _logger = loggerFactory.CreateLogger<T>();
            _httpClientFactory = httpClientFactory;
        }

        protected async Task<T> GetAsync<T>(string url, string token, CancellationToken cancellationToken)
        {
            // this is temp code once DF team exposes the clitent we need to replace this code.
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");

            var httpRequest = new HttpRequestMessage()
            {
                RequestUri = new Uri(url),
                Method = HttpMethod.Get,
            };
            var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true, };

            HttpResponseMessage response = await httpClient.SendAsync(httpRequest, cancellationToken);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<T>(responseBody, serializerOptions);
            return data;
        }
    }
}
