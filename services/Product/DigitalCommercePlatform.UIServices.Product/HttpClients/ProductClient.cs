using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Actions.Product;
using DigitalCommercePlatform.UIService.Product.Dto;
using DigitalCommercePlatform.UIService.Product.Dto.Find;
using DigitalCommercePlatform.UIService.Product.Dto.GetProduct;
using DigitalCommercePlatform.UIService.Product.Dto.GetProductMultiple;
using DigitalCommercePlatform.UIService.Product.Model;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Core.Models.DTO.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIService.Product.HttpClients
{
    public class ProductClient : MiddleTierHttpClient, IProductClient
    {
        private readonly IMapper _mapper;
        private readonly ILogger<ProductClient> _logger;

        public ProductClient(IMapper mapper, ILogger<ProductClient> logger, IHttpContextAccessor contextAccessor, HttpClient client, IContext context)
            : base(client, context, contextAccessor)
        {
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<CoreProductModel> GetAsync(GetProductDetailCriteriaDto query)
        {
            try
            {
                var systemFilter = string.IsNullOrWhiteSpace(query?.SystemId) ? string.Empty : $"?systemId={query?.SystemId}";
                var url = $"v1/{query?.MaterialNumber}{systemFilter}";

                var productResponse = await GetAsync<Response<CoreProductModel>>(url).ConfigureAwait(false);

                return productResponse?.ReturnObject;
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error getting product, id={query?.MaterialNumber}, details: {ex.Message}";
                _logger.LogError(errorMessage);

                Exception exception = new Exception(errorMessage, ex);
                throw exception;
            }
        }

        public async Task<IEnumerable<ProductDetailDto>> GetMultipleAsync(GetProductMultipleCriteriaDto query)
        {
            var queryParameters = query?.ToString();
            var url = $"v1/?{queryParameters}";

            try
            {
                var response = await GetAsync<Response<IDictionary<string, CoreProductModel>>>(url).ConfigureAwait(false);

                if (response == null || response.ReturnObject == null)
                    return null;

                var productFounds = response.ReturnObject.Where(x => x.Value != null).Select(x => x.Value).ToList();

                var dtos = _mapper.Map<IEnumerable<ProductDetailDto>>(productFounds);

                return dtos;
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error getting product, parameters={queryParameters}, details: {ex.Message}";
                _logger.LogError(errorMessage);

                throw new Exception(errorMessage, ex);
            }
        }

        public async Task<CoreProductSummaryModel> GetSummaryAsync(string id)
        {
            try
            {
                var url = $"v1/{id}/summary";
                var response = await GetAsync<Response<CoreProductSummaryModel>>(url).ConfigureAwait(false);

                return response?.ReturnObject;
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error getting product summary, ids={id}, details: {ex.Message}";
                _logger.LogError(errorMessage);

                throw new Exception(errorMessage, ex);
            }
        }

        public async Task<IDictionary<string, CoreProductSummaryModel>> GetSummaryMultipleAsync(string[] ids)
        {
            try
            {
                var queryParameters = ids.BuildAsQueryString("id");
                var url = $"v1/summary?{queryParameters}";

                var response = await GetAsync<Response<IDictionary<string, CoreProductSummaryModel>>>(url).ConfigureAwait(false);

                return response?.ReturnObject;
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error getting product summary, ids={string.Join(",", ids)}, details: {ex.Message}";
                _logger.LogError(errorMessage);

                throw new Exception(errorMessage, ex);
            }
        }

        //public async Task<FindProduct.FindProductResponse> Find(CriteriaDto query)
        //{
        //    var queryParameters = query.BuildAsQueryString("SearchProduct");
        //    queryParameters += query.ToString();

        //    var url = $"v1/Find?{queryParameters}";

        //    var coreModelResponse = await FindProduct(url).ConfigureAwait(false);

        //    var result = _mapper.Map<IEnumerable<CoreProductModel>, IEnumerable<FindProductDto>>(coreModelResponse.ReturnObject);

        //    //foreach (var searchResult in result)
        //    //{
        //    //    var customer = coreModelResponse.ReturnObject
        //    //        .Where(x => x.ID == searchResult.MaterialNumber && x.SystemId == searchResult.SystemId)
        //    //        .Select(x => x.CustomerMaterial)
        //    //        .FirstOrDefault();

        //    //    // todo: find the way to map this
        //    //    //if (!string.IsNullOrWhiteSpace(query.SoldToCustomerNumber) && customer.ContainsKey(query.SoldToCustomerNumber))
        //    //    //{
        //    //    //    searchResult.CustomerPartNumber = customer[query.SoldToCustomerNumber];
        //    //    //}
        //    //}

        //    return new FindProduct.FindProductResponse(result)
        //    {
        //        PageNumber = query.Page,
        //        PageSize = query.PageSize
        //    };
        //}

        private async Task<PaginatedResponse<IEnumerable<CoreProductModel>>> FindProduct(string url)
        {
            try
            {
                var response = await GetAsync<PaginatedResponse<IEnumerable<CoreProductModel>>>(url).ConfigureAwait(false);

                if (response == null || response.ReturnObject == null)
                    throw new Exception("Product not found in core");

                return response;
            }
            catch (Exception ex)
            {
                var message = $"Error searching products, details: {ex.Message}";
                throw new Exception(message, ex);
            }
        }

        Task<CoreProductSummaryModel> IProductClient.GetSummaryAsync(string id)
        {
            throw new NotImplementedException();
        }

        Task<IDictionary<string, CoreProductSummaryModel>> IProductClient.GetSummaryMultipleAsync(string[] ids)
        {
            throw new NotImplementedException();
        }
    }
}