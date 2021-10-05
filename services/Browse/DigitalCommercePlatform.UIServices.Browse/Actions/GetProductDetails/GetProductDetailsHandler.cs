//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Helpers;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails
{
    public static class GetProductDetailsHandler
    {
        public class Request : IRequest<Response>
        {
            public IReadOnlyCollection<string> Id { get; set; }
            public string SalesOrg { get; set; }
            public string Site { get; set; }

            public Request(IReadOnlyCollection<string> id, string salesOrg, string site)
            {
                Id = id;
                SalesOrg = salesOrg;
                Site = site;
            }
        }

        public class Response : ResponseBase<IEnumerable<ProductModel>>
        {
            public Response(IEnumerable<ProductModel> products)
            {
                Content = products;
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE1006:Naming Styles", Justification = "<Pending>")]
        public class Handler : IRequestHandler<Request, Response>
        {
            private const string ALLOW = "ALLOW";
            private const string DisplayStatus = "DisplayStatus";
            private const string PhasedOut = "PhasedOut";
            private const string AuthRequiredPrice = "AuthRequiredPrice";
            private const string N = "N";
            private const string Orderable = "Orderable";
            private const string Y = "Y";
            private const string New = "New";
            private const string Returnable = "Returnable";
            private const string EndUserRequired = "EndUserRequired";
            private const string Refurbished = "Refurbished";
            private const string DropShip = "DropShip";
            private const string Warehouse = "Warehouse";
            private const string Virtual = "Virtual";
            private const string Logo = "Logo";
            private const string PromoText = "PromoText";
            private readonly IBrowseService _productRepositoryServices;
            private readonly string _imageSize;

            public Handler(IBrowseService productRepositoryServices, ISiteSettings siteSettings)
            {
                _productRepositoryServices = productRepositoryServices;
                _imageSize = siteSettings.GetSetting("ImagesSize");
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var validateDtoTask = _productRepositoryServices.ValidateProductTask(request.Id);
                var productDetailsTask = _productRepositoryServices.GetProductDetails(request);

                await Task.WhenAll(validateDtoTask, productDetailsTask);

                var validateDto = validateDtoTask.Result;

                var productDetails = productDetailsTask.Result;

                var result = productDetails.Select(x =>
                {
                    var product = new ProductModel();
                    var flags = ExtractFlags(validateDto, x, request.SalesOrg, request.Site);

                    MapBaseInformation(request, x, product, flags);

                    MapImages(x, product);

                    MapPrice(x, product, flags.CanViewPrice);

                    MapAuthorizations(product, flags);

                    MapNotes(x, product, request.SalesOrg);

                    MapIndicators(product, flags);

                    MapSpecifications(x, product);

                    MapStock(x, product, flags.DropShip);

                    return product;
                });

                return new Response(result);
            }

            private void MapStock(ProductDto x, ProductModel product, bool dropShip)
            {
                if (x.Stock == null)
                    return;

                product.Stock = new StockModel
                {
                    TotalAvailable = x.Stock.Total,
                    VendorDirectInventory = x.Stock.VendorDesignated,
                    VendorShipped = dropShip && !x.Stock.VendorDesignated.HasValue,
                    Plants = x.Plants?.Select(p => new PlantModel
                    {
                        Name = p.Id,
                        Quantity = p.Stock?.AvailableToPromise
                    })
                };
            }

            private void MapSpecifications(ProductDto x, ProductModel product)
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
                    Warehouse = flags.Warehouse
                };
            }

            private void MapNotes(ProductDto x, ProductModel product, string salesOrg)
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

            private void MapAuthorizations(ProductModel product, Flags flags)
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
                product.MaterialType = x.MaterialType;
                product.DisplayName = x.DisplayName;
                product.Description = x.Description;
                product.SubstituteMaterialNumber = x.Plants?.FirstOrDefault()?.SubstituteMaterialNumber;
                product.ManufacturerPartNumber = x.ManufacturerPartNumber;

                var saleorgPlant = x.SalesOrganizations?.FirstOrDefault(s => s.Id == request.SalesOrg)?.DeliveryPlant;
                product.UPC_EAN = !string.IsNullOrWhiteSpace(saleorgPlant) ? x.Plants?.FirstOrDefault(p => p.Id == saleorgPlant)?.UPC : null;

                product.Status = flags.DisplayStatus;
            }

            private void MapPrice(ProductDto x, ProductModel product, bool canViewPrice)
            {
                if (x.Price == null)
                    return;

                product.Price = new PriceModel
                {
                    ListPrice = x.Price.ListPrice,
                    BasePrice = canViewPrice ? x.Price.BasePrice : null,
                    BestPrice = canViewPrice ? x.Price.BestPrice : null,
                    BestPriceExpiration = canViewPrice ? x.Price.BestPriceExpiration : null,
                    VolumePricing = x.Price.VolumePricing?.Select(v => new VolumePricingModel
                    {
                        Price = v.Price,
                        MinQuantity = v.MinQuantity ?? 0
                    })
                };
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

            private Flags ExtractFlags(IEnumerable<ValidateDto> validateDto, ProductDto productDto, string salesOrg, string site)
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

                return flags;
            }

            private struct Flags
            {
                public bool IsValid { get; set; }
                public bool PhasedOut { get; set; }
                public bool CanViewPrice { get; set; }
                public bool CanOrder { get; set; }
                public bool NewProduct { get; set; }
                public bool Returnable { get; set; }
                public bool EndUserRequired { get; set; }
                public bool Refurbished { get; set; }
                public bool DropShip { get; set; }
                public bool Warehouse { get; set; }
                public bool VirtualProduct { get; set; }
                public string DisplayStatus { get; set; }
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