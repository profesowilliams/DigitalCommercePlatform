using DigitalCommercePlatform.UIServices.Common.Product.Contracts;
using DigitalCommercePlatform.UIServices.Common.Product.Models;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Product.Services
{
    public class ProductService : IProductService
    {
        private readonly string _appProductURL;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;

        public ProductService(IOptions<AppSettings> options, IMiddleTierHttpClient middleTierHttpClient)
        {
            if (options == null) { throw new ArgumentNullException(nameof(options)); }
            _appProductURL = options.Value?.TryGetSetting("App.Product.Url") ?? throw new InvalidOperationException("App.Product.Url is missing from AppSettings");

            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
        }

        public async Task<ProductData> FindProductDetailsAsync(FindProductDto findProductDto)
        {
            var productURL = _appProductURL.AppendPathSegment("Find").BuildQuery(findProductDto);
            var productData = await _middleTierHttpClient.GetAsync<ProductData>(productURL);
            return productData;
        }

        public async Task<SummaryDetails> FindSummaryDetailsAsync(FindProductDto findProductDto)
        {
            var productURL = _appProductURL.AppendPathSegment("Find").BuildQuery(findProductDto);
            var getProductResponse = await _middleTierHttpClient.GetAsync<SummaryDetails>(productURL);
            return getProductResponse;
        }

        public async Task<IEnumerable<ProductModel>> GetProductDetailsAsync(ProductDetailDto productDetailDto)
        {
            var productURL = _appProductURL.BuildQuery(productDetailDto);
            var getProductResponse = await _middleTierHttpClient.GetAsync<IEnumerable<ProductModel>>(productURL);
            return getProductResponse;
        }

        public async Task<SummaryModel> GetProductSummaryAsync(ProductDetailDto productDetailDto)
        {
            var productURL = _appProductURL.BuildQuery(productDetailDto);
            var getProductResponse = await _middleTierHttpClient.GetAsync<IEnumerable<SummaryModel>>(productURL);
            return getProductResponse.FirstOrDefault();
        }
    }
}