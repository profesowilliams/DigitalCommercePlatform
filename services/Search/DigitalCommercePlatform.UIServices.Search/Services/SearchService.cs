//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Search.Helpers.IndicatorsConstants;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public class SearchService : ISearchService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _appSearchUrl;
        private readonly string _appProductUrl;
        private readonly ILogger<SearchService> _logger;
        private readonly IUIContext _context;
        private readonly IMapper _mapper;

        public SearchService(
            IMiddleTierHttpClient middleTierHttpClient,
            ILogger<SearchService> logger,
            IAppSettings appSettings,
            IUIContext context)
        {
            _logger = logger;
            _context = context;
            _middleTierHttpClient = middleTierHttpClient;
            _appSearchUrl = appSettings.GetSetting("Search.App.Url");
            _appProductUrl = appSettings.GetSetting("Product.App.Url");
            var mapperConfig = new MapperConfiguration(x => x.AddProfiles(new Profile[] { new SearchProfile() }));
            _mapper = mapperConfig.CreateMapper();
        }

        public async Task<FullSearchResponseModel> GetFullSearchProductData(SearchRequestDto request, bool isAnonymous)
        {
            var appSearchResponse = await GetProductData(request);
            var fullSearchResponse = _mapper.Map<FullSearchResponseModel>(appSearchResponse);

            if (fullSearchResponse != null)
                MapFields(appSearchResponse, ref fullSearchResponse);
            return fullSearchResponse;
        }

        public async Task<List<RefinementGroupResponseModel>> GetAdvancedRefinements(SearchRequestDto request)
        {
            var appSearchResponse = await GetProductData(request);

            var results = new List<RefinementGroupResponseModel>();

            if (appSearchResponse?.RefinementGroups == null)
                return results;

            foreach (var group in appSearchResponse.RefinementGroups)
            {
                ProcessRefinementGroup(results, group);
            }

            return results;
        }

        public async Task<List<ProductSearchPreviewModel>> GetProductSearchPreviewData(SearchRequestDto request)
        {
            var results = await GetProductData(request);
            return _mapper.Map<List<ProductSearchPreviewModel>>(results?.Products);
        }

        private static void ProcessRefinementGroup(List<RefinementGroupResponseModel> results, RefinementGroupResponseDto group)
        {
            var originalGroupName = group.Group;
            if (originalGroupName.Equals("CNETAttributes", StringComparison.InvariantCultureIgnoreCase))
            {
                foreach (var refinement in group.Refinements)
                {
                    var splittedName = refinement.Name.Split("/");
                    var alreadyAddedGroup = results.FirstOrDefault(x => x.Group.Equals(splittedName[0].Trim()));
                    var refinementModel = new RefinementModel
                    {
                        Id = refinement.Id,
                        OriginalGroupName = originalGroupName,
                        Name = splittedName[1].Trim(),
                        Type = refinement.Type,
                        Range = refinement.Range is null ? null : new RangeModel
                        {
                            Max = refinement.Range.Max,
                            Min = refinement.Range.Min
                        },
                        Options = refinement.Options.Select(o => new RefinementOptionModel
                        {
                            Count = o.Count,
                            Id = o.Id,
                            Text = o.Text,
                            Selected = o.Selected
                        }).ToList()
                    };
                    if (alreadyAddedGroup != null)
                    {
                        alreadyAddedGroup.Refinements.Add(refinementModel);
                    }
                    else
                    {
                        results.Add(new RefinementGroupResponseModel
                        {
                            Group = splittedName[0].Trim(),
                            Refinements = new List<RefinementModel>
                                {
                                    refinementModel
                                }
                        });
                    }
                }
            }
            else
            {
                results.Add(new RefinementGroupResponseModel
                {
                    Group = group.Group,
                    Refinements = group.Refinements.Select(x => new RefinementModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Type = x.Type,
                        Range = x.Range is null ? null : new RangeModel
                        {
                            Max = x.Range.Max,
                            Min = x.Range.Min
                        },
                        Options = x.Options.Select(o => new RefinementOptionModel
                        {
                            Count = o.Count,
                            Id = o.Id,
                            Text = o.Text,
                            Selected = o.Selected
                        }).ToList()
                    }).ToList()
                });
            }
        }

        private void MapFields(SearchResponseDto appSearchResponse, ref FullSearchResponseModel fullSearchResponse)
        {
            foreach (var product in fullSearchResponse.Products)
            {
                var appSearchProduct = appSearchResponse.Products.Find(x => x.Id == product.Id);
                if (product.Price?.BasePrice != null && product.Price?.BestPrice != null)
                {
                    product.Price.PromoAmount = product.Price.BasePrice - product.Price.BestPrice;
                }
                product.Status = appSearchProduct.Indicators?.Find(x => x.Type == DisplayStatus)?.Value;
                var (orderable, authrequiredprice) = SearchProfile.GetFlags(appSearchProduct);
                SearchProfile.MapAuthorizations(product, appSearchProduct.IsAuthorized, orderable, authrequiredprice);
                AddIndicators(appSearchProduct, product);
            }

            var topRefinementsDto = appSearchResponse.RefinementGroups?.FirstOrDefault(x => x.Group.Equals("TopRefinements", StringComparison.InvariantCultureIgnoreCase))?.Refinements;
            fullSearchResponse.TopRefinements = _mapper.Map<List<RefinementModel>>(topRefinementsDto);
        }

        private void AddIndicators(ElasticItemDto productDto, ElasticItemModel productModel)
        {
            if (productModel.Indicators == null)
                productModel.Indicators = new();

            AddFreeShuppingIndicator(productDto, productModel);
        }

        private void AddFreeShuppingIndicator(ElasticItemDto productDto, ElasticItemModel productModel)
        {
            var freeShipping = productDto.Indicators?.Find(x => x.Type == FreeShipping);
            if (freeShipping != null)
            {
                productModel.Indicators.Add(_mapper.Map<IndicatorModel>(freeShipping));
            }
        }

        private async Task<SearchResponseDto> GetProductData(SearchRequestDto request)
        {
            var url = _appSearchUrl
           .AppendPathSegment("Product")
           .ToString();

            try
            {
                return await _middleTierHttpClient.PostAsync<SearchResponseDto>(url, null, request).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                if (ex is RemoteServerHttpException)
                {
                    var remoteEx = ex as RemoteServerHttpException;
                    if (remoteEx.Code == System.Net.HttpStatusCode.NotFound)
                    {
                        return null;
                    }
                }
                _logger.LogError(ex, "Exception at getting GetProductData : " + nameof(SearchService));
                throw;
            }
        }

        public async Task<List<TypeAheadModel>> GetTypeAhead(TypeAhead.Request request)
        {
            var typeAheadUrl = _appSearchUrl.AppendPathSegment("/TypeAhead").BuildQuery(request);
            try
            {
                var getTypeAheadResponse = await _middleTierHttpClient.GetAsync<List<TypeAheadModel>>(typeAheadUrl);
                return getTypeAheadResponse;
            }
            catch (Exception ex)
            {
                if (ex is RemoteServerHttpException)
                {
                    var remoteEx = ex as RemoteServerHttpException;
                    if (remoteEx.Code == System.Net.HttpStatusCode.NotFound)
                    {
                        return null;
                    }
                }
                _logger.LogError(ex, "Exception at getting GetTypeAhead : " + nameof(SearchService));
                throw ex;
            }
        }
    }
}