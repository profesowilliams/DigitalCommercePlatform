using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Customer.Actions.Abstracts
{
    public abstract class HandlerBase<T> where T : class
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;

        protected ILogger Logger { get; set; }
        protected IOptions<AppSettings> Options { get; set; }
        protected IHttpClientFactory HttpClientFactory { get; set; }

        protected HandlerBase(IMiddleTierHttpClient client,
                           ILoggerFactory loggerFactory,
                           IOptions<AppSettings> options,
                           IHttpClientFactory httpClientFactory)
        {
            if (client == null)
                throw new ArgumentNullException(nameof(client));
            else
                _middleTierHttpClient = client;

            if (loggerFactory == null)
                throw new ArgumentNullException(nameof(loggerFactory));
            else
                Logger = loggerFactory.CreateLogger<T>();

            if (options == null)
                throw new ArgumentNullException(nameof(options));
            else
                Options = options;

            if (httpClientFactory == null)
                throw new ArgumentNullException(nameof(httpClientFactory));
            else
                HttpClientFactory = httpClientFactory;

        }

        protected async Task<U> GetAsync<U>(Uri url, string token, CancellationToken cancellationToken) where U : class
        {
            HttpClient httpClient = HttpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");

            var httpRequest = new HttpRequestMessage()
            {
                RequestUri = url,
                Method = HttpMethod.Get,
            };
            var serializerOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true, };

            HttpResponseMessage response = await httpClient.SendAsync(httpRequest, cancellationToken);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<U>(responseBody, serializerOptions);
            return data;
        }
    }
}
