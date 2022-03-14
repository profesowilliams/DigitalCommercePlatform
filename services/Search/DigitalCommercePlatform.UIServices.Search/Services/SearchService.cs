//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Helpers;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
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
            ISiteSettings SiteSettings,
            IMapper Mapper,
            ITranslationService TranslationService,
            ICultureService cultureService);

    public class SearchService : ISearchService
    {
        private const string CNETAttributes = "CNETAttributes";
        private const string General = "General";
        private const string TopRefinements = "TopRefinements";        
        private readonly string _appProductUrl;
        private readonly string _appSearchUrl;
        private readonly IUIContext _context;
        private readonly Dictionary<string, string> _internalRefinementsTranslations = null;
        private readonly Dictionary<string, string> _indicatorsTranslations = null;
        private readonly Dictionary<string, string> _priceLabelTranslations = null;
        private readonly ILogger<SearchService> _logger;
        private readonly IMapper _mapper;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly List<string> _refinementsGroupThatShouldBeLocalized;
        private readonly ISiteSettings _siteSettings;
        private readonly ITranslationService _translationService;
        private readonly ICultureService _cultureService;        
        private readonly string[] Indicators = { FreeShipping, Virtual };

        public SearchService(SearchServiceArgs args)
        {
            _logger = args.Logger;
            _context = args.Context;
            _siteSettings = args.SiteSettings;
            _middleTierHttpClient = args.MiddleTierHttpClient;
            _appSearchUrl = args.AppSettings.GetSetting("Search.App.Url");
            _appProductUrl = args.AppSettings.GetSetting("Product.App.Url");
            _mapper = args.Mapper;

            _translationService = args.TranslationService;
            _cultureService = args.cultureService;            

            _refinementsGroupThatShouldBeLocalized = args.SiteSettings.GetSetting<List<string>>("Search.UI.RefinementsGroupThatShouldBeLocalized");

            _translationService.FetchTranslations("Search.UI.InternalRefinements", ref _internalRefinementsTranslations);
            _translationService.FetchTranslations("Search.UI.Indicators", ref _indicatorsTranslations);
            _translationService.FetchTranslations(TranslationsConst.PriceLabel, ref _priceLabelTranslations);
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

        public async Task<FullSearchResponseModel> GetFullSearchProductData(SearchRequestDto request, bool isAnonymous)
        {
            _cultureService.SetCurrentCultureFor(request.SearchProfileId, request.Culture);

            var appSearchResponse = await GetProductData(request);
            var fullSearchResponse = _mapper.Map<FullSearchResponseModel>(appSearchResponse);

            if (fullSearchResponse != null)
                MapFields(appSearchResponse, ref fullSearchResponse);
            return fullSearchResponse;
        }

        public async Task<List<ProductSearchPreviewModel>> GetProductSearchPreviewData(SearchRequestDto request)
        {
            var results = await GetProductData(request);
            return _mapper.Map<List<ProductSearchPreviewModel>>(results?.Products);
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

        private static void SetVendorShipped(ElasticItemDto appSearchProduct, ElasticItemModel product)
        {
            if (appSearchProduct.Stock == null)
                return;
            if (appSearchProduct.Stock.VendorDesignated == null &&
                appSearchProduct.Indicators?.FirstOrDefault(i => string.Equals(i.Type, DropShip, StringComparison.InvariantCultureIgnoreCase) && string.Equals(i.Value, Y, StringComparison.InvariantCultureIgnoreCase)) != null &&
                appSearchProduct.Indicators.FirstOrDefault(i => string.Equals(i.Type, Warehouse, StringComparison.InvariantCultureIgnoreCase) && string.Equals(i.Value, N, StringComparison.InvariantCultureIgnoreCase)) != null)
            {
                product.Stock.VendorShipped = true;
            }
        }

        private void AddIndicator(ElasticItemDto productDto, ElasticItemModel productModel, string indicatorName)
        {
            var indicator = productDto.Indicators?.Find(x => x.Type == indicatorName);
            if (indicator != null)
            {
                productModel.Indicators.Add(indicatorName, _translationService.Translate(_indicatorsTranslations, $"{indicatorName}.{indicator.Value}", indicator.Value));
            }
            else
            {
                productModel.Indicators.Add(indicatorName, _translationService.Translate(_indicatorsTranslations, $"{indicatorName}.{N}", N));
            }
        }

        private void AddIndicators(ElasticItemDto productDto, ElasticItemModel productModel)
        {
            if (productModel.Indicators == null)
                productModel.Indicators = new();

            foreach(var indicator in Indicators)
            {
                AddIndicator(productDto, productModel, indicator);
            }
        }

        private List<RefinementModel> GetLocalizedRefinements(RefinementGroupResponseDto group)
        {
            var refinements = group.Refinements.Select(x => new RefinementModel
            {
                Id = x.Id,
                Name = _translationService.Translate(_internalRefinementsTranslations, x.Name),
                OriginalGroupName = group.Group,
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
                    Text = _translationService.Translate(_internalRefinementsTranslations, o.Text),
                    Selected = o.Selected
                }).ToList(),
            }).ToList();

            return refinements;
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

        private void MapFields(SearchResponseDto appSearchResponse, ref FullSearchResponseModel fullSearchResponse)
        {
            var notAvailableLabelText = _translationService.Translate(_priceLabelTranslations, TranslationsConst.NALabel);

            foreach (var product in fullSearchResponse.Products)
            {
                var appSearchProduct = appSearchResponse.Products.Find(x => x.Id == product.Id);

                product.Price = MapPrice(appSearchProduct, notAvailableLabelText);

                product.Status = appSearchProduct.Indicators?.Find(x => x.Type == DisplayStatus)?.Value;
                var (orderable, authrequiredprice) = SearchProfile.GetFlags(appSearchProduct);
                SearchProfile.MapAuthorizations(product, appSearchProduct.IsAuthorized, orderable, authrequiredprice);
                AddIndicators(appSearchProduct, product);
                SetVendorShipped(appSearchProduct, product);
            }

            var topRefinementsDto = appSearchResponse.RefinementGroups?.FirstOrDefault(x => x.Group.Equals(TopRefinements, StringComparison.InvariantCultureIgnoreCase))?.Refinements;
            fullSearchResponse.TopRefinements = _mapper.Map<List<RefinementModel>>(topRefinementsDto);

            fullSearchResponse.TopRefinements.ForEach(r =>
            {
                if (!RefinementGroupShouldBeLocalized(r.Name, r.OriginalGroupName))
                    return;

                r.Name = _translationService.Translate(_internalRefinementsTranslations, r.Name);
                r.Options.ForEach(o =>
                {
                    o.Text = _translationService.Translate(_internalRefinementsTranslations, o.Text);
                });
            });
        }

        private static PriceModel MapPrice(ElasticItemDto appSearchProduct, string notAvailableLabelText)
        {
            if (appSearchProduct?.Price == null)
            {
                return new PriceModel { ListPrice = notAvailableLabelText };
            }

            return new PriceModel
            {
                BasePrice = appSearchProduct.Price.BasePrice.IsAvailable() ? appSearchProduct.Price.BasePrice.Value.Format(appSearchProduct.Price.Currency) : null,
                BestPrice = appSearchProduct.Price.BestPrice.IsAvailable() ? appSearchProduct.Price.BestPrice.Value.Format(appSearchProduct.Price.Currency) : null,
                BestPriceExpiration = appSearchProduct.Price.BestPriceExpiration.Format(),
                ListPrice = FormatHelper.ListPriceFormat(appSearchProduct.Price.ListPrice, notAvailableLabelText, appSearchProduct.Price.ListPriceAvailable, appSearchProduct.Price.Currency),
                PromoAmount = FormatHelper.FormatSubtraction(appSearchProduct.Price.BasePrice, appSearchProduct.Price.BestPrice, appSearchProduct.Price.Currency),
                BestPriceIncludesWebDiscount = appSearchProduct.Price.BestPriceIncludesWebDiscount
            };
        }

        private List<RefinementModel> NotTranslatedRefinemntsModel(RefinementGroupResponseDto group)
        {
            var refinements = group.Refinements.Select(x => new RefinementModel
            {
                Id = x.Id,
                Name = x.Name,
                OriginalGroupName = group.Group,
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
            }).ToList();

            return refinements;
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
                var generalGroup = results.Find(e => e.Group.Equals(General, StringComparison.InvariantCultureIgnoreCase));
                if (generalGroup == null)
                    results.Add(
                        new RefinementGroupResponseModel
                        {
                            Group = _translationService.Translate(_internalRefinementsTranslations, General),
                            Refinements = new List<RefinementModel>()
                        }
                    );

                generalGroup = results.First(e => e.Group.Equals(General, StringComparison.InvariantCultureIgnoreCase));

                var shouldTranslate = RefinementGroupShouldBeLocalized(group.Group);
                generalGroup.Refinements.AddRange(shouldTranslate ? GetLocalizedRefinements(group) : NotTranslatedRefinemntsModel(group));
            }
        }

        private bool RefinementGroupShouldBeLocalized(params string[] groups)
        {
            return _refinementsGroupThatShouldBeLocalized.Intersect(groups)?.Any() == true;
        }
    }
}