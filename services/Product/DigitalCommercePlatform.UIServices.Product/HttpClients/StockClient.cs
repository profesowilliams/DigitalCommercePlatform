using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIService.Product.Model;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Core.Models.DTO.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIService.Product.HttpClients
{
    public class StockClient : MiddleTierHttpClient, IStockClient
    {
        private readonly ILogger<StockClient> _logger;

        public StockClient(ILogger<StockClient> logger, IHttpContextAccessor contextAccessor, HttpClient client, IContext context)
             : base(client, context, contextAccessor)
        {
            _logger = logger;
        }

        public async Task<IDictionary<string, StockModel>> GetMultipleAsync(string[] ids)
        {
            if (ids == null || ids.Length == 0)
                return null;

            try
            {
                var queryParameters = string.Empty;

                foreach (var id in ids)
                    queryParameters += $"ids={id}&";

                var url = $"v1/?{queryParameters}";

                var stockResponse = await GetAsync<Response<IDictionary<string, StockModel>>>(url).ConfigureAwait(false);

                return stockResponse?.ReturnObject;
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error getting stock, ids: {string.Join(",", ids)}, details: " + ex.Message;
                _logger.LogError(errorMessage);

                // todo: what to do when stock is down?
                //throw new Exception(errorMessage, ex);
                return null;
            }
        }
    }
}