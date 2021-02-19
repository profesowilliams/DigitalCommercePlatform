using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIService.Product.Model;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIService.Product.HttpClients
{
    public class PriceClient : MiddleTierHttpClient, IPriceClient
    {
        private readonly ILogger<PriceClient> _logger;

        public PriceClient(ILogger<PriceClient> logger, IHttpContextAccessor contextAccessor, HttpClient client, IContext context)
             : base(client, context, contextAccessor)
        {
            _logger = logger;
        }

        public async Task<Dictionary<string, PriceModel>> GetMultipleAsync(string[] ids)
        {
            if (ids == null || ids.Length == 0)
                return null;

            try
            {
                var queryParametersBuilder = new StringBuilder();

                foreach (var id in ids)
                    queryParametersBuilder.Append($"id={id}&");

                var url = $"v1/?{queryParametersBuilder.ToString().Trim('&')}";

                var priceResponse = await GetAsync<Dictionary<string, PriceModel>>(url).ConfigureAwait(false);

                return priceResponse;
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error getting price, ids: {string.Join(",", ids)}, details: " + ex.Message;
                _logger.LogError(errorMessage);

                Exception exception = new Exception(errorMessage, ex);
                throw exception;
            }
        }
    }
}