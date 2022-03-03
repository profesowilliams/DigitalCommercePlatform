//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Helpers;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.ProductCompare.Internal;
using DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare;
using DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using FluentValidation;
using Flurl;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions
{
    public class GetProductsCompare
    {
        public class Handler : IRequestHandler<Request, CompareModel>
        {
            private const string ALLOW = "ALLOW";
            private const string AuthRequiredPrice = "AuthRequiredPrice";
            private const string DropShip = "DropShip";
            private const string Orderable = "Orderable";
            private const string ProductShot = "Product shot";
            private const string Thumbnail = "75x75";
            private const string Warehouse = "Warehouse";
            private const string Y = "Y";
            private readonly ICultureService _cultureService;
            private readonly IMiddleTierHttpClient _httpClient;
            private readonly string _onOrderArrivalDateFormat;
            private readonly string _productAppUrl;
            private readonly ITranslationService _translationService;
            private Dictionary<string, string> _translations = null;
            private readonly IPriceService _priceService;

            public Handler(
                IMiddleTierHttpClient httpClient,
                IAppSettings appSettings,
                ISiteSettings siteSettings,
                ICultureService cultureService,
                ITranslationService translationService,
                IPriceService priceService)
            {
                _httpClient = httpClient;
                _productAppUrl = appSettings.GetSetting("Product.App.Url");
                _onOrderArrivalDateFormat = siteSettings.GetSetting("Browse.UI.OnOrderArrivalDateFormat");
                _cultureService = cultureService;
                _translationService = translationService;
                _priceService = priceService;
            }

            public async Task<CompareModel> Handle(Request request, CancellationToken cancellationToken)
            {
                Task<IEnumerable<ProductDto>> productsDtoTask = ProductsDtoTask(request);
                Task<IEnumerable<ValidateDto>> validateDtoTask = ValidateProductTask(request);

                var productsDto = await productsDtoTask.ConfigureAwait(false);

                Dictionary<string, HashSet<string>> specMatrix = CreateSpecificationGroupMatrix(productsDto);
                List<SpecificationGroupModel> specGroups = PopulateSpecificationModel(productsDto, specMatrix);

                var validateDto = await validateDtoTask.ConfigureAwait(false);

                _cultureService.Process(request.Culture);
                _translationService.FetchTranslations(TransaltionsConst.BrowseUIName, ref _translations);

                IEnumerable<ProductModel> productsModel = MapProducts(request, productsDto, validateDto);

                return new CompareModel
                {
                    Products = productsModel,
                    SpecificationGroups = specGroups
                };
            }

            private static Dictionary<string, HashSet<string>> CreateSpecificationGroupMatrix(IEnumerable<ProductDto> productsDto)
            {
                var specMatrix = new Dictionary<string, HashSet<string>>();

                foreach (var extendedSpec in productsDto.Where(x => x.ExtendedSpecifications != null).SelectMany(x => x.ExtendedSpecifications))
                {
                    if (!specMatrix.ContainsKey(extendedSpec.GroupName))
                    {
                        specMatrix.Add(extendedSpec.GroupName, new HashSet<string>());
                    }

                    foreach (var spec in extendedSpec.Specifications)
                    {
                        specMatrix[extendedSpec.GroupName].Add(spec.Name);
                    }
                }

                return specMatrix;
            }

            private static (bool vendorShipped, bool orderable, bool authrequiredprice) GetFlags(Request request, ProductDto x)
            {
                var indicators = ProductMapperHelper.ExtractFinalIndicators(x.Indicators, request.SalesOrg, request.Site);

                var warehouse = indicators.ContainsKey(Warehouse) && string.Equals(indicators[Warehouse].Value, Y, StringComparison.InvariantCultureIgnoreCase);
                var dropShip = indicators.ContainsKey(DropShip) && string.Equals(indicators[DropShip].Value, Y, StringComparison.InvariantCultureIgnoreCase);
                var vendorShipped = x.Stock?.VendorDesignated == 0 && dropShip && !warehouse;

                var orderable = indicators.ContainsKey(Orderable) && string.Equals(indicators[Orderable].Value, Y, StringComparison.InvariantCultureIgnoreCase);

                var authrequiredprice = indicators.ContainsKey(AuthRequiredPrice) && string.Equals(indicators[AuthRequiredPrice].Value, Y, StringComparison.InvariantCultureIgnoreCase);

                return (vendorShipped, orderable, authrequiredprice);
            }

            private static void MapAuthorizations(ProductModel product, bool isValid, bool orderable, bool authrequiredprice)
            {
                product.Authorization = new AuthorizationModel();
                product.Authorization.CanOrder = isValid && orderable;
                product.Authorization.CanViewPrice = isValid || !authrequiredprice;
            }

            private static ProductModel MapBasedInformation(ProductDto x)
            {
                var product = new ProductModel();
                product.Id = x.Source.Id;
                product.ManufacturerPartNumber = x.ManufacturerPartNumber;
                product.Description = x.Description;
                product.DisplayName = string.IsNullOrWhiteSpace(x.ShortDescription) ? x.Name : x.ShortDescription;
                product.ThumbnailImage = x.Images?.FirstOrDefault(i => string.Equals(i.Key, Thumbnail, StringComparison.InvariantCultureIgnoreCase)).Value?.FirstOrDefault(x => string.Equals(x.Type, ProductShot, StringComparison.InvariantCultureIgnoreCase))?.Url;
                return product;
            }

            private static void MapStock(ProductDto x, ProductModel product, bool vendorShipped)
            {
                product.Stock = new StockModel
                {
                    TotalAvailable = x.Stock?.Total.Format(),
                    Corporate = x.Stock?.Td.Format(),
                    VendorDirectInventory = x.Stock?.VendorDesignated.Format(),
                    VendorShipped = vendorShipped
                };
            }

            private static List<SpecificationGroupModel> PopulateSpecificationModel(IEnumerable<ProductDto> productsDto, Dictionary<string, HashSet<string>> specMatrix)
            {
                var specGroups = new List<SpecificationGroupModel>();

                foreach (var specGroup in specMatrix.Keys)
                {
                    ProcessSpecificationGroup(productsDto, specMatrix, specGroups, specGroup);
                }

                return specGroups;
            }

            private static void ProcessSpecification(IEnumerable<ProductDto> productsDto, string specGroup, SpecificationGroupModel existingSpecGroup, string specName)
            {
                var existingSpec = existingSpecGroup.Specifications.FirstOrDefault(x => x.Name == specName);
                if (existingSpec == null)
                {
                    existingSpec = new SpecificationModel { Name = specName, Values = new List<string>() };
                    existingSpecGroup.Specifications = existingSpecGroup.Specifications.Append(existingSpec);
                }

                foreach (var product in productsDto)
                {
                    var productSpecValue = product.ExtendedSpecifications?.FirstOrDefault(x => x.GroupName == specGroup)
                                                    ?.Specifications.FirstOrDefault(x => x.Name == specName);

                    existingSpec.Values = existingSpec.Values.Append(productSpecValue?.Value ?? "");
                }
            }

            private static void ProcessSpecificationGroup(IEnumerable<ProductDto> productsDto, Dictionary<string, HashSet<string>> specMatrix, List<SpecificationGroupModel> specGroups, string specGroup)
            {
                var existingSpecGroup = specGroups.FirstOrDefault(x => x.Group == specGroup);
                if (existingSpecGroup == null)
                {
                    existingSpecGroup = new SpecificationGroupModel { Group = specGroup, Specifications = new List<SpecificationModel>() };
                    specGroups.Add(existingSpecGroup);
                }

                foreach (var specName in specMatrix[specGroup])
                {
                    ProcessSpecification(productsDto, specGroup, existingSpecGroup, specName);
                }
            }

            private OnOrderModel MapOnOrder(Dto.Product.Internal.OnOrderDto onOrder)
            {
                return onOrder == null
                    ? null
                    : new OnOrderModel
                    {
                        Stock = onOrder.Stock,
                        ArrivalDate = onOrder.ArrivalDate.ToString(_onOrderArrivalDateFormat),
                    };
            }

            private void MapPlants(ProductDto x, ProductModel product)
            {
                if (x.Plants != null)
                {
                    product.Stock.Plants = x.Plants.Select(p =>
                    new PlantModel
                    {
                        Name = p.Stock?.LocationName,
                        Quantity = p.Stock?.AvailableToPromise.Format("0"),
                        OnOrder = MapOnOrder(p.Stock?.OnOrder)
                    });
                }
            }

            private void MapPrice(ProductDto x, ProductModel product, string naLabel)
            {
                product.Price = new PriceModel
                {
                    BasePrice = x.Price?.BasePrice.Format(),
                    BestPrice = x.Price?.BestPrice.Format(),
                    BestPriceExpiration = product.Authorization.CanViewPrice ? x.Price?.BestPriceExpiration.Format() : null,
                    ListPrice = _priceService.GetListPrice(x.Price.ListPrice, naLabel, x.Price.ListPriceAvailable),
                    PromoAmount = FormatHelper.FormatSubtraction(x.Price?.BasePrice, x.Price?.BestPrice),
                    BestPriceIncludesWebDiscount = product.Authorization.CanViewPrice ? x.Price?.BestPriceIncludesWebDiscount : null,
                    VolumePricing = x.Price?.VolumePricing?.Select(p => new VolumePricingModel
                    {
                        MinQuantity = p.MinQuantity.Format(),
                        Price = p.Price.Format()
                    })
                };
            }            

            private IEnumerable<ProductModel> MapProducts(Request request, IEnumerable<ProductDto> productsDto, IEnumerable<ValidateDto> validateDto)
            {
                var naLabel = _translationService.Translate(_translations, TransaltionsConst.NALabel);
                return productsDto.Select(x =>
                {
                    ProductModel product = MapBasedInformation(x);

                    var isValid = validateDto.Any(v => v.Source.Id == x.Source.Id && v.Source.System == x.Source.System && v.Restriction == ALLOW);

                    var (vendorShipped, orderable, authrequiredprice) = GetFlags(request, x);

                    MapStock(x, product, vendorShipped);

                    MapPlants(x, product);

                    MapAuthorizations(product, isValid, orderable, authrequiredprice);

                    MapPrice(x, product, naLabel);

                    return product;
                }).ToList();
            }

            private Task<IEnumerable<ProductDto>> ProductsDtoTask(Request request)
            {
                var productDataUrl = _productAppUrl
                                            .SetQueryParam("id", request.Ids)
                                            .SetQueryParam("details", true);
                return _httpClient.GetAsync<IEnumerable<ProductDto>>(productDataUrl);
            }

            private Task<IEnumerable<ValidateDto>> ValidateProductTask(Request request)
            {
                var validateProductUrl = _productAppUrl.AppendPathSegment("Validate").SetQueryParam("id", request.Ids);
                return _httpClient.GetAsync<IEnumerable<ValidateDto>>(validateProductUrl);
            }
        }

        public class Request : IRequest<CompareModel>
        {
            public string Culture { get; set; }
            public IEnumerable<string> Ids { get; set; }
            public string SalesOrg { get; set; }
            public string Site { get; set; }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Ids).NotEmpty();
                When(x => x.Ids != null, () =>
                {
                    RuleFor(x => x.Ids).Must(x => x.Count() > 1).WithMessage("At least two product ids are required");
                });
                RuleFor(x => x.SalesOrg).NotEmpty();
                RuleFor(x => x.Site).NotEmpty();
            }
        }
    }
}