//2022 (c) Tech Data Corporation - All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.MarketingXML;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Helpers;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails
{
    public static class GetProductDetailsHandler
    {
        public class Handler : IRequestHandler<Request, Response>
        {
            private const string ALLOW = "ALLOW";
            private const string AuthRequiredPrice = "AuthRequiredPrice";
            private const string DisplayStatus = "DisplayStatus";
            private const string DropShip = "DropShip";
            private const string EndUserRequired = "EndUserRequired";
            private const string FreightPolicyException = "FreightPolicyException";
            private const string FreightPolicyExceptionValue = "X";
            private const string Logo = "Logo";
            private const string N = "N";
            private const string New = "New";
            private const string Orderable = "Orderable";
            private const string PhasedOut = "PhasedOut";
            private const string PromoText = "PromoText";
            private const string Refurbished = "Refurbished";
            private const string Returnable = "Returnable";
            private const string SalesOrg0100 = "0100";
            private const string Virtual = "Virtual";
            private const string Warehouse = "Warehouse";
            private const string Y = "Y";
            private const string CnetLanguage = "EN";
            private const string CnetSite = "US";
            private readonly ICultureService _cultureService;
            private readonly string _imageSize;
            private readonly Dictionary<string, string> _indicatorsTranslations = null;
            private readonly IMapper _mapper;
            private readonly string _onOrderArrivalDateFormat;
            private readonly IBrowseService _productRepositoryServices;
            private readonly ITranslationService _translationService;
            private Dictionary<string, string> _translations = null;            

            public Handler(
                IBrowseService productRepositoryServices,
                ISiteSettings siteSettings,
                IMapper mapper,
                ITranslationService translationService,
                ICultureService cultureService)
            {
                _productRepositoryServices = productRepositoryServices;
                _imageSize = siteSettings.GetSetting("Browse.UI.ImageSize");
                _onOrderArrivalDateFormat = siteSettings.GetSetting("Browse.UI.OnOrderArrivalDateFormat");
                _mapper = mapper;
                _translationService = translationService;
                _translationService.FetchTranslations("Browse.UI.Indicators", ref _indicatorsTranslations);
                _cultureService = cultureService;                
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var validateDtoTask = _productRepositoryServices.ValidateProductTask(request.Id);
                var productDetailsTask = _productRepositoryServices.GetProductDetails(request);

                await Task.WhenAll(validateDtoTask, productDetailsTask);

                var validateDto = await validateDtoTask;

                var productDetails = await productDetailsTask;

                _cultureService.Process(request.Culture);
                _translationService.FetchTranslations(TransaltionsConst.BrowseUIName, ref _translations);
                var naLabel = _translationService.Translate(_translations, TransaltionsConst.NALabel);

                var result = productDetails.Select(async x =>
                {
                    var product = new ProductModel();
                    var flags = ExtractFlags(validateDto, x, request.SalesOrg, request.Site);

                    MapBaseInformation(request, x, product, flags);

                    MapImages(x, product);

                    MapPrice(x, product, flags.CanViewPrice, naLabel);

                    MapAuthorizations(product, flags);

                    MapNotes(x, product, request.SalesOrg);

                    MapIndicators(product, flags);

                    MapSpecifications(x, product);

                    MapStock(x, product, flags);

                    await MapMarketing(x, product);

                    MapDocuments(x, product);

                    return product;
                });

                return new Response(await Task.WhenAll(result));
            }

            private static Flags ExtractFlags(IEnumerable<ValidateDto> validateDto, ProductDto productDto, string salesOrg, string site)
            {
                var flags = new Flags();

                flags.IsValid = validateDto.Any(v => v.Source.Id == productDto.Source.Id && v.Source.System == productDto.Source.System && v.Restriction == ALLOW);

                var indicators = ProductMapperHelper.ExtractFinalIndicators(productDto.Indicators, salesOrg, site);

                flags.PhasedOut = indicators.ContainsKey(DisplayStatus) && string.Equals(indicators[DisplayStatus].Value, PhasedOut, System.StringComparison.InvariantCultureIgnoreCase);
                flags.CanViewPrice = flags.IsValid || (indicators.ContainsKey(AuthRequiredPrice) && string.Equals(indicators[AuthRequiredPrice].Value, N, System.StringComparison.InvariantCultureIgnoreCase));
                flags.CanOrder = flags.IsValid && indicators.ContainsKey(Orderable) && string.Equals(indicators[Orderable].Value, Y, System.StringComparison.InvariantCultureIgnoreCase);
                flags.NewProduct = indicators.ContainsKey(New) && string.Equals(indicators[New].Value, Y, System.StringComparison.InvariantCultureIgnoreCase);
                flags.Returnable = indicators.ContainsKey(Returnable) && string.Equals(indicators[Returnable].Value, Y, System.StringComparison.InvariantCultureIgnoreCase);
                flags.EndUserRequired = indicators.ContainsKey(EndUserRequired) && string.Equals(indicators[EndUserRequired].Value, Y, System.StringComparison.InvariantCultureIgnoreCase);
                flags.Refurbished = indicators.ContainsKey(Refurbished) && string.Equals(indicators[Refurbished].Value, Y, System.StringComparison.InvariantCultureIgnoreCase);
                flags.DropShip = indicators.ContainsKey(DropShip) && string.Equals(indicators[DropShip].Value, Y, System.StringComparison.InvariantCultureIgnoreCase);
                flags.Warehouse = indicators.ContainsKey(Warehouse) && string.Equals(indicators[Warehouse].Value, Y, System.StringComparison.InvariantCultureIgnoreCase);
                flags.VirtualProduct = indicators.ContainsKey(Virtual) && string.Equals(indicators[Virtual].Value, Y, System.StringComparison.InvariantCultureIgnoreCase);

                flags.DisplayStatus = indicators.ContainsKey(DisplayStatus) ? indicators[DisplayStatus].Value : null;

                flags.FreeShipping = !(salesOrg == SalesOrg0100 && indicators.ContainsKey(FreightPolicyException) && string.Equals(indicators[FreightPolicyException].Value, FreightPolicyExceptionValue, System.StringComparison.InvariantCultureIgnoreCase));

                return flags;
            }

            private static (string keySellingPointsUrl, string marketingDescriptionUrl, string productFeaturesUrl, string whatsInTheBox) GetMarketingUrls(IEnumerable<MarketingDto> marketings)
            {
                var keySellingPointsUrl = marketings.FirstOrDefault(x => x.Name == MarketingConstHelper.KeySellingPoints)?.Url;
                var marketingDescriptionUrl = marketings.FirstOrDefault(x => x.Name == MarketingConstHelper.MarketingDescription)?.Url;
                var productFeaturesUrl = marketings.FirstOrDefault(x => x.Name == MarketingConstHelper.ProductFeatures)?.Url;
                var whatsInTheBox = marketings.FirstOrDefault(x => x.Name == MarketingConstHelper.WhatsInTheBox)?.Url;

                return (keySellingPointsUrl, marketingDescriptionUrl, productFeaturesUrl, whatsInTheBox);
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0008:Use explicit type", Justification = "<Pending>")]
            private static async Task<XmlDocument> GetXmlDocument(string url)
            {
                if (string.IsNullOrEmpty(url))
                    return null;
                XmlDocument xml = new();
#pragma warning disable SYSLIB0014 // Type or member is obsolete
                var wrq = WebRequest.Create(url) as HttpWebRequest;
#pragma warning restore SYSLIB0014 // Type or member is obsolete
                var response = await wrq.GetResponseAsync().ConfigureAwait(false);
                xml.Load(new XmlTextReader(response.GetResponseStream()));
                return xml;
            }

            private static void MapAuthorizations(ProductModel product, Flags flags)
            {
                product.Authorization = new AuthorizationModel
                {
                    CanOrder = flags.CanOrder,
                    CanViewPrice = flags.CanViewPrice
                };
            }

            private static void MapBaseInformation(Request request, ProductDto x, ProductModel product, Flags flags)
            {
                product.Id = x.Source.Id;
                product.CNETMappedId = x.CNETMappedId;
                product.MaterialType = x.MaterialType;
                product.DisplayName = x.DisplayName;
                product.Description = x.Description;
                product.SubstituteMaterialNumber = x.Plants?.FirstOrDefault()?.SubstituteMaterialNumber;
                product.ManufacturerPartNumber = x.ManufacturerPartNumber;
                product.CNETLanguage = CnetLanguage;
                product.CNETSite = CnetSite;

                var saleorgPlant = x.SalesOrganizations?.FirstOrDefault(s => s.Id == request.SalesOrg)?.DeliveryPlant;
                product.UPC_EAN = !string.IsNullOrWhiteSpace(saleorgPlant) ? x.Plants?.FirstOrDefault(p => p.Id == saleorgPlant)?.UPC : null;

                product.Status = flags.DisplayStatus;
            }

            private static async Task MapMarketing(ProductDto x, ProductModel product)
            {
                if (x.Marketing == null)
                    return;

                var (keySellingPointsUrl, marketingDescriptionUrl, productFeaturesUrl, whatsInTheBox) = GetMarketingUrls(x.Marketing);

                var keySellingPointsTask = GetXmlDocument(keySellingPointsUrl);
                var marketingDescriptionTask = GetXmlDocument(marketingDescriptionUrl);
                var productFeaturesTask = GetXmlDocument(productFeaturesUrl);
                var whatsInTheTask = GetXmlDocument(whatsInTheBox);

                Task.WaitAll(keySellingPointsTask, marketingDescriptionTask, productFeaturesTask, whatsInTheTask);

                var keySellingPointsDoc = await keySellingPointsTask.ConfigureAwait(false);
                var marketingDescriptionDoc = await marketingDescriptionTask.ConfigureAwait(false);
                var productFeaturesDoc = await productFeaturesTask.ConfigureAwait(false);
                var whatsInTheDoc = await whatsInTheTask.ConfigureAwait(false);

                product.KeySellingPoints = SerializeUlList(keySellingPointsDoc)?.Ul?.Li?.Select(x => x.Text).ToArray();
                product.MarketingDescription = marketingDescriptionDoc?.InnerText;
                product.ProductFeatures = SerializeUlList(productFeaturesDoc)?.Ul?.Li?.Select(x => $"{x.Strong}. {x.Text}").ToArray();
                product.WhatsInTheBox = SerializeUlList(whatsInTheDoc)?.Ul?.Li?.Select(x => x.Text).ToArray();
            }

            private static void MapNotes(ProductDto x, ProductModel product, string salesOrg)
            {
                product.Notes = x.SalesOrganizations
                                    ?.FirstOrDefault(s => s.Id == salesOrg)
                                    ?.ProductNotes
                                    ?.Where(n => string.Equals(n.Type, PromoText, System.StringComparison.InvariantCultureIgnoreCase))
                                    .Select(n => new NoteModel
                                    {
                                        Value = n.Note
                                    });
            }

            private static void MapSpecifications(ProductDto x, ProductModel product)
            {
                var specifications = new ProductSpecificationsModel();

                if (x.MainSpecifications != null)
                {
                    specifications.MainSpecifications = x.MainSpecifications.Select(s => new MainSpecificationModel
                    {
                        Name = s.Name,
                        Value = s.Value
                    });
                }

                if (x.ExtendedSpecifications != null)
                {
                    specifications.ExtendedSpecifications = x.ExtendedSpecifications.Select(s => new ExtendedSpecificationModel
                    {
                        Group = s.GroupName,
                        GroupSpecifications = s.Specifications?.Select(sp => new SpecificationModel
                        {
                            Name = sp.Name,
                            Value = sp.Value
                        })
                    });
                }

                product.Specifications = specifications.MainSpecifications != null || specifications.ExtendedSpecifications != null ? specifications : null;
            }

            private static UlListXmlDto SerializeUlList(XmlDocument document)
            {
                if (document == null)
                    return null;
                XmlSerializer serializer = new(typeof(UlListXmlDto));
                using XmlReader reader = new XmlNodeReader(document);
                var response = (UlListXmlDto)serializer.Deserialize(reader);
                return response;
            }

            private void MapDocuments(ProductDto x, ProductModel product)
            {
                if (x.Marketing == null)
                    return;

                var documents = new List<DocumentModel>();
                var quickStartGuide = _mapper.Map<DocumentModel>(x.Marketing.FirstOrDefault(x => x.Name == MarketingConstHelper.QuickStartGuide));
                if (quickStartGuide != null)
                    documents.Add(quickStartGuide);
                var userManual = _mapper.Map<DocumentModel>(x.Marketing.FirstOrDefault(x => x.Name == MarketingConstHelper.UserManual));
                if (userManual != null)
                    documents.Add(userManual);
                var productDataSheet = _mapper.Map<DocumentModel>(x.Marketing.FirstOrDefault(x => x.Name == MarketingConstHelper.ProductDataSheet));
                if (productDataSheet != null)
                    documents.Add(productDataSheet);
                if (documents.Any())
                    product.Documents = documents;
            }

            private void MapImages(ProductDto x, ProductModel product)
            {
                var imagesModel = new List<ImageModel>();

                if (x.Images != null && x.Images.ContainsKey(_imageSize))
                {
                    imagesModel.AddRange(x.Images[_imageSize].Select(i => new ImageModel
                    {
                        Angle = i.Angle,
                        Url = i.Url
                    }));
                }

                if (x.Logos != null && x.Logos.ContainsKey(_imageSize))
                {
                    imagesModel.AddRange(x.Logos[_imageSize].Select(l => new ImageModel
                    {
                        Url = l.Url,
                        Angle = Logo
                    }));
                }

                product.Images = imagesModel.Any() ? imagesModel : null;
            }

            private void MapIndicators(ProductModel product, Flags flags)
            {
                product.IndicatorsFlags = new IndicatorFlags
                {
                    DropShip = flags.DropShip,
                    EndUserRequired = flags.EndUserRequired,
                    New = flags.NewProduct,
                    Refurbished = flags.Refurbished,
                    Returnable = flags.Returnable,
                    Virtual = flags.VirtualProduct,
                    Warehouse = flags.Warehouse,
                    FreeShipping = flags.FreeShipping,
                    FreeShippingLabel = _translationService.Translate(_indicatorsTranslations, $"{nameof(IndicatorFlags.FreeShipping)}.{flags.FreeShipping}".ToUpperInvariant()),
                    VirtualLabel = _translationService.Translate(_indicatorsTranslations, $"{nameof(IndicatorFlags.Virtual)}.{flags.VirtualProduct}".ToUpperInvariant())
                };
            }

            private OnOrderModel MapOnOrder(OnOrderDto onOrder)
            {
                return onOrder == null
                    ? null
                    : new OnOrderModel
                    {
                        Stock = onOrder.Stock.Format(),
                        ArrivalDate = onOrder.ArrivalDate.ToString(_onOrderArrivalDateFormat),
                    };
            }

            private void MapPrice(ProductDto x, ProductModel product, bool canViewPrice, string naLabel)
            {
                if (x.Price == null)
                {
                    product.Price = new PriceModel { ListPrice = naLabel };
                    return;
                }

                string currency = x.Price.Currency;
                product.Price = new PriceModel
                {
                    ListPrice = FormatHelper.ListPriceFormat(x.Price.ListPrice, naLabel, x.Price.ListPriceAvailable, currency),
                    BasePrice = canViewPrice && x.Price.BasePrice.HasValue ? x.Price.BasePrice.Value.Format(currency) : null,
                    BestPrice = canViewPrice && x.Price.BestPrice.HasValue ? x.Price.BestPrice.Value.Format(currency) : null,
                    BestPriceExpiration = canViewPrice ? x.Price.BestPriceExpiration.Format() : null,
                    BestPriceIncludesWebDiscount = canViewPrice ? x.Price.BestPriceIncludesWebDiscount : null,
                    PromoAmount = FormatHelper.FormatSubtraction(x.Price.BasePrice, x.Price.BestPrice, currency),
                    VolumePricing = x.Price.VolumePricing?.Select(v => new VolumePricingModel
                    {
                        Price = v.Price.Format(currency),
                        MinQuantity = v.MinQuantity.Format("0")
                    })
                };
            }

            private void MapStock(ProductDto x, ProductModel product, Flags flags)
            {
                if (x.Stock == null)
                    return;

                product.Stock = new StockModel
                {
                    TotalAvailable = x.Stock.Total.Format(),
                    Corporate = x.Stock.Td.Format(),
                    VendorDirectInventory = x.Stock.VendorDesignated.Format(),
                    VendorShipped = flags.DropShip && !flags.Warehouse && x.Stock.VendorDesignated == 0,
                    Plants = x.Plants?.Select(p => new PlantModel
                    {
                        Name = p.Stock?.LocationName,
                        Quantity = p.Stock?.AvailableToPromise.Format(),
                        OnOrder = MapOnOrder(p.Stock?.OnOrder),
                    })
                };
            }

            private struct Flags
            {
                public bool CanOrder { get; set; }
                public bool CanViewPrice { get; set; }
                public string DisplayStatus { get; set; }
                public bool DropShip { get; set; }
                public bool EndUserRequired { get; set; }
                public bool FreeShipping { get; set; }
                public bool IsValid { get; set; }
                public bool NewProduct { get; set; }
                public bool PhasedOut { get; set; }
                public bool Refurbished { get; set; }
                public bool Returnable { get; set; }
                public bool VirtualProduct { get; set; }
                public bool Warehouse { get; set; }
            }
        }

        public class Request : IRequest<Response>
        {
            public Request(IReadOnlyCollection<string> id, string salesOrg, string site, string culture)
            {
                Id = id;
                SalesOrg = salesOrg;
                Site = site;
                Culture = culture;
            }

            public string Culture { get; set; }
            public IReadOnlyCollection<string> Id { get; set; }
            public string SalesOrg { get; set; }
            public string Site { get; set; }
        }

        public class Response : ResponseBase<IEnumerable<ProductModel>>
        {
            public Response(IEnumerable<ProductModel> products)
            {
                Content = products;
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.Id).NotEmpty().WithMessage("please enter the input id");
                RuleFor(x => x.SalesOrg).NotEmpty();
                RuleFor(x => x.Site).NotEmpty();
            }
        }
    }
}