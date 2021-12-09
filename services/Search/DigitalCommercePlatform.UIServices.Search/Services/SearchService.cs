//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using Flurl;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Search.Helpers.IndicatorsConstants;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public record SearchServiceArgs(IMiddleTierHttpClient MiddleTierHttpClient,
            ILogger<SearchService> Logger,
            IAppSettings AppSettings,
            IUIContext Context,
            IStringLocalizer StringLocalizer,
            ISiteSettings SiteSettings,
            IMapper Mapper);

    public class SearchService : ISearchService
    {
        private const string CNETAttributes = "CNETAttributes";
        private const string TopRefinements = "TopRefinements";
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _appSearchUrl;
        private readonly string _appProductUrl;
        private readonly ILogger<SearchService> _logger;
        private readonly IUIContext _context;
        private readonly IStringLocalizer _stringLocalizer;
        private readonly ISiteSettings _siteSettings;
        private readonly IMapper _mapper;
        private readonly List<string> _refinementsGroupThatShouldBeLocalized;
        private Dictionary<string, string> _internalRefinementsTranslations = null;

        public SearchService(SearchServiceArgs args)
        {
            _logger = args.Logger;
            _context = args.Context;
            _stringLocalizer = args.StringLocalizer;
            _siteSettings = args.SiteSettings;
            _middleTierHttpClient = args.MiddleTierHttpClient;
            _appSearchUrl = args.AppSettings.GetSetting("Search.App.Url");
            _appProductUrl = args.AppSettings.GetSetting("Product.App.Url");
            _mapper = args.Mapper;

            _refinementsGroupThatShouldBeLocalized = args.SiteSettings.GetSetting<List<string>>("Search.UI.RefinementsGroupThatShouldBeLocalized");
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

        private void ProcessRefinementGroup(List<RefinementGroupResponseModel> results, RefinementGroupResponseDto group)
        {
            var originalGroupName = group.Group;
            if (originalGroupName.Equals(CNETAttributes, StringComparison.InvariantCultureIgnoreCase))
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
                var shouldTranslate = RefinementGroupShouldBeLocalized(group.Group);
                results.Add(shouldTranslate ? GetLocalizedRefinementGroup(group) : new RefinementGroupResponseModel
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
                        }).ToList(),
                        OriginalGroupName = group.Group
                    }).ToList()
                });
            }
        }

        private RefinementGroupResponseModel GetLocalizedRefinementGroup(RefinementGroupResponseDto group)
        {
            return new RefinementGroupResponseModel
            {
                Group = Translate(group.Group),
                Refinements = group.Refinements.Select(x => new RefinementModel
                {
                    Id = x.Id,
                    Name = Translate(x.Name),
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
                        Text = Translate(o.Text),
                        Selected = o.Selected
                    }).ToList(),
                    OriginalGroupName = group.Group
                }).ToList()
            };
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

            var topRefinementsDto = appSearchResponse.RefinementGroups?.FirstOrDefault(x => x.Group.Equals(TopRefinements, StringComparison.InvariantCultureIgnoreCase))?.Refinements;
            fullSearchResponse.TopRefinements = _mapper.Map<List<RefinementModel>>(topRefinementsDto);

            fullSearchResponse.TopRefinements.ForEach(r =>
            {
                if (!RefinementGroupShouldBeLocalized(r.Name, r.OriginalGroupName))
                    return;

                r.Name = Translate(r.Name);
                r.Options.ForEach(o =>
                {
                    o.Text = Translate(o.Text);
                });
            });
        }

        private bool RefinementGroupShouldBeLocalized(params string[] groups)
        {
            return _refinementsGroupThatShouldBeLocalized.Intersect(groups)?.Any() == true;
        }

        // this method should be removed whenever IStringLocalizer will be fixed for missing translations
        private string Translate(string key, string fallback = null)
        {
            PopulateInternalRefinementsTranslations();

            if (!_internalRefinementsTranslations.TryGetValue(key, out var translation))
                return fallback ?? key;

            return translation;
        }

        private void PopulateInternalRefinementsTranslations()
        {
            try
            {
                if (_internalRefinementsTranslations is null)
                    _internalRefinementsTranslations = JsonConvert.DeserializeObject<Dictionary<string, string>>(_stringLocalizer["Search.UI.InternalRefinements"]);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at PopulateInternalRefinementsTranslations");
                _internalRefinementsTranslations = new Dictionary<string, string>();
            }
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