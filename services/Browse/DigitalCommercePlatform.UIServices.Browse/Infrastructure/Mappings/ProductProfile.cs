//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    public class ProductProfile : Profile
    {
        private const string ALLOW = "ALLOW";
        private const string DropShip = "DropShip";
        private const string N = "N";
        private const string Orderable = "Orderable";
        private const string AuthRequiredPrice = "AuthRequiredPrice";
        private const string Y = "Y";

        public ProductProfile()
        {
            CreateMap<IEnumerable<ProductModel>, GetProductDetailsHandler.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

            CreateMap<ProductData, FindProductHandler.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));
            CreateMap<SummaryDetails, FindSummaryHandler.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

            CreateMap<SummaryModel, GetProductSummaryHandler.Response>()
                .ForPath(dest => dest.Items, opt => opt.MapFrom(src => src));

            CreateMap<IEnumerable<ProductDto>, GetProductDetailsHandler.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

            CreateMap<ProductDto, ProductModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.Id))
                .ForPath(dest => dest.Specifications.MainSpecifications, opt => opt.MapFrom(src => src.MainSpecifications))
                .ForPath(dest => dest.Specifications.ExtendedSpecifications, opt => opt.MapFrom(src => src.ExtendedSpecifications))
                .ForMember(dest => dest.IndicatorsFlags, opt => opt.MapFrom(src => src.Indicators))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.SalesOrganizations))
                // Filled with custom function (not with Automapper)
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.SubstituteMaterialNumber, opt => opt.Ignore())
                .ForMember(dest => dest.UPC_EAN, opt => opt.Ignore())
                .ForMember(dest => dest.Authorization, opt => opt.Ignore())
                .ForMember(dest => dest.Stock, opt => opt.Ignore())
                // Loaded from CNET XML documents
                .ForMember(dest => dest.MarketingDescription, opt => opt.Ignore())
                .ForMember(dest => dest.ProductFeatures, opt => opt.Ignore())
                .ForMember(dest => dest.KeySellingPoints, opt => opt.Ignore())
                .ForMember(dest => dest.WhatsInTheBox, opt => opt.Ignore())
                .ForMember(dest => dest.Documents, opt => opt.Ignore());

            CreateMap<IEnumerable<IndicatorDto>, IndicatorFlags>().ConvertUsing(new ProductIndicatorsConverter());
            CreateMap<IEnumerable<SalesOrganizationDto>, IEnumerable<NoteModel>>().ConvertUsing(new ProductNotesConverter());
            CreateMap<PriceDto, PriceModel>()
                .ForMember(dest => dest.PromoAmount, opt => opt.MapFrom(src => (src.BasePrice - src.BestPrice)));

            CreateMap<SourceDto, SourceModel>();
            CreateMap<ImageDto, ImageModel>();
            CreateMap<SpecificationDto, SpecificationModel>();
            CreateMap<MainSpecificationDto, MainSpecificationModel>();
            CreateMap<ExtendedSpecificationDto, ExtendedSpecificationModel>();
            CreateMap<VolumePricingDto, VolumePricingModel>();
            CreateMap<MaterialGroupDto, MaterialGroupModel>();
            CreateMap<IndicatorValueDto, IndicatorValueModel>();
            CreateMap<CategoryDto, CategoryModel>();
            CreateMap<MarketDto, MarketModel>();
            CreateMap<AliasDto, AliasModel>();
            CreateMap<WarehouseDto, WarehouseModel>();
            CreateMap<MarketingDto, MarketingModel>();
        }

        public static IEnumerable<ProductModel> ConvertProductsFromDtoToModel(IEnumerable<ProductDto> dto, IEnumerable<ProductModel> models, GetProductDetailsHandler.Request request, IEnumerable<ValidateDto> validateDto)
        {
            if (models != null)
            {
                foreach (var productModel in models)
                {
                    var productDto = dto.SingleOrDefault(x => x.Source.Id == productModel.Id);
                    // There is probably a cleaner way to do this directly with Automapper
                    productModel.Status = productModel.IndicatorsFlags?.DisplayStatus;
                    productModel.SubstituteMaterialNumber = productDto?.Plants?.Select(x => x.SubstituteMaterialNumber).FirstOrDefault();
                    productModel.UPC_EAN = productDto?.Plants?.Select(x => x.UPC).FirstOrDefault();

                    // Map Authorization object
                    var isValid = validateDto.Any(v => v.Source.Id == productDto.Source.Id && v.Source.System == productDto.Source.System && v.Restriction == ALLOW);
                    var (vendorShipped, orderable, authrequiredprice) = GetFlags(request, productDto);
                    MapAuthorizations(productModel, isValid, orderable, authrequiredprice);
                    MapStock(productDto, productModel, vendorShipped);
                    MapPlants(productDto, productModel);
                }
            }
            return models;
        }

        public static (bool vendorShipped, bool orderable, bool authrequiredprice) GetFlags(GetProductDetailsHandler.Request request, ProductDto x)
        {
            var vendorShipped = false;
            var orderable = false;
            var authrequiredprice = false;
            var indicatorsForSalesOrg = x.Indicators?.FirstOrDefault(x => x.Context != null && string.Equals(x.Context.SalesOrganization, request.SalesOrg, StringComparison.InvariantCultureIgnoreCase) && x.Context.Consumer == null && x.Context.Location == null && x.Context.Site == null);
            var indicatorsDefault = x.Indicators?.FirstOrDefault(x => x.Context?.SalesOrganization == null && x.Context?.Consumer == null && x.Context?.Location == null && x.Context?.Site == null);

            vendorShipped = x.Stock?.VendorDesignated != null && indicatorsForSalesOrg?.Values?.FirstOrDefault(i => string.Equals(i.Key, DropShip, StringComparison.InvariantCultureIgnoreCase) && string.Equals(i.Value?.Value, N, StringComparison.InvariantCultureIgnoreCase)).Key == null;

            orderable = indicatorsForSalesOrg?.Values?.FirstOrDefault(i => string.Equals(i.Key, Orderable, StringComparison.InvariantCultureIgnoreCase) && string.Equals(i.Value?.Value, N, StringComparison.InvariantCultureIgnoreCase)).Key == null
                                                              && indicatorsDefault?.Values?.FirstOrDefault(i => string.Equals(i.Key, Orderable, StringComparison.InvariantCultureIgnoreCase) && string.Equals(i.Value?.Value, Y, StringComparison.InvariantCultureIgnoreCase)).Key != null;

            authrequiredprice = indicatorsForSalesOrg?.Values?.FirstOrDefault(i => string.Equals(i.Key, AuthRequiredPrice, StringComparison.InvariantCultureIgnoreCase) && string.Equals(i.Value?.Value, Y, StringComparison.InvariantCultureIgnoreCase)).Key != null;

            return (vendorShipped, orderable, authrequiredprice);
        }

        public static void MapAuthorizations(ProductModel product, bool isValid, bool orderable, bool authrequiredprice)
        {
            product.Authorization = new AuthorizationModel();
            product.Authorization.CanOrder = isValid && orderable;
            product.Authorization.CanViewPrice = isValid || !authrequiredprice;
        }

        public static void MapStock(ProductDto x, ProductModel product, bool vendorShipped)
        {
            product.Stock = new StockModel
            {
                TotalAvailable = x.Stock?.Total,
                VendorDirectInventory = x.Stock?.VendorDesignated,
                VendorShipped = vendorShipped
            };
        }
        public static void MapPlants(ProductDto x, ProductModel product)
        {
            if (x.Plants != null)
            {
                product.Stock.Plants = x.Plants.Select(p => new PlantModel { Name = p.Id, Quantity = p.Stock?.AvailableToPromise ?? 0 });
            }
        }
    }

    public class ProductIndicatorsConverter : ITypeConverter<IEnumerable<IndicatorDto>, IndicatorFlags>
    {
        public IndicatorFlags Convert(IEnumerable<IndicatorDto> source, IndicatorFlags destination, ResolutionContext context)
        {
            if (source != null)
            {
                destination = new IndicatorFlags();
                foreach (var indicator in source)
                {
                    if (indicator?.Context?.SalesOrganization == "0100") // to fill
                    {
                        foreach (var indicatorParam in indicator.Values)
                        {
                            if (indicatorParam.Key == "New" && indicatorParam.Value?.Value == "Y") { destination.NewFlag = true; }
                            if (indicatorParam.Key == "Returnable" && indicatorParam.Value?.Value == "Y") { destination.ReturnableFlag = true; }
                            if (indicatorParam.Key == "EndUserRequired" && indicatorParam.Value?.Value == "Y") { destination.EndUserRequiredFlag = true; }
                            if (indicatorParam.Key == "Refurbished" && indicatorParam.Value?.Value == "Y") { destination.RefurbishedFlag = true; }
                            if (indicatorParam.Key == "DropShip" && indicatorParam.Value?.Value == "Y") { destination.DropShipFlag = true; }
                            if (indicatorParam.Key == "Warehouse" && indicatorParam.Value?.Value == "Y") { destination.WarehouseFlag = true; }
                            if (indicatorParam.Key == "Virtual" && indicatorParam.Value?.Value == "Y") { destination.VirtualFlag = true; }
                            if (indicatorParam.Key == "DisplayStatus")
                            {
                                destination.DisplayStatus = indicatorParam.Value?.Value;
                            }
                        }
                    }
                }
            }
            return destination;
        }
    }

    public class ProductNotesConverter : ITypeConverter<IEnumerable<SalesOrganizationDto>, IEnumerable<NoteModel>>
    {
        public IEnumerable<NoteModel> Convert(IEnumerable<SalesOrganizationDto> source, IEnumerable<NoteModel> destination, ResolutionContext context)
        {
            List<NoteModel> result = null;
            if (source != null)
            {
                result = new List<NoteModel>();
                foreach (var sourceItem in source)
                {
                    var destPlant = new NoteModel();
                    if (sourceItem.ProductNotes != null)
                    {
                        foreach (var productNote in sourceItem.ProductNotes)
                        {
                            var note = new NoteModel()
                            {
                                Value = productNote?.Note,
                            };
                            result.Add(note);
                        }
                    }
                }
            }
            return result;
        }
    }
}
