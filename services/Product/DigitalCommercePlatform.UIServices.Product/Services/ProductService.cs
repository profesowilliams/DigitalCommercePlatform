//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Product.Actions;
using DigitalCommercePlatform.UIServices.Product.Models.Product.Product;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Product.Services
{
    public class ProductService : IProductService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _appProductUrl;
        private readonly ILogger<ProductService> _logger;

        public ProductService(IMiddleTierHttpClient middleTierHttpClient,
            IAppSettings appSettings,
            ILogger<ProductService> logger)
        {
            _middleTierHttpClient = middleTierHttpClient;
            _appProductUrl = appSettings.GetSetting("App.Product.Url");
            _logger = logger;
        }

        public async Task<IEnumerable<ProductModel>> GetProductDetails(ProductDetails.Request request)
        {
            var productURL = _appProductUrl.BuildQuery(request);
            _logger.LogInformation("Calling app-product from GetProductDetails");
            var getProductResponse = await _middleTierHttpClient.GetAsync<IEnumerable<ProductModel>>(productURL);
            return getProductResponse;
        }
    }
}
