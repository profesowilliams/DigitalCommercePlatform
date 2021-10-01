//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    public class ProductProfile : Profile
    {
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
                .ForMember(dest => dest.IndicatorsFlag, opt => opt.MapFrom(src => src.Indicators))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.SalesOrganizations))
                .ForMember(dest => dest.Status, opt => opt.Ignore()) // Will be filled by ConvertProductsFromDtoToModel
                // to fill
                .ForMember(dest => dest.SubstituteMaterialNumber, opt => opt.Ignore())
                .ForMember(dest => dest.UPC_EAN, opt => opt.Ignore())
                .ForMember(dest => dest.Authorization, opt => opt.Ignore())
                .ForMember(dest => dest.MarketingDescription, opt => opt.Ignore())
                .ForMember(dest => dest.ProductFeatures, opt => opt.Ignore())
                .ForMember(dest => dest.KeySellingPoints, opt => opt.Ignore())
                .ForMember(dest => dest.WhatsInTheBox, opt => opt.Ignore())
                .ForMember(dest => dest.Documents, opt => opt.Ignore())
                
                .ForPath(dest => dest.Specifications.MainSpecifications, opt => opt.MapFrom(src => src.MainSpecifications))
                .ForPath(dest => dest.Specifications.ExtendedSpecifications, opt => opt.MapFrom(src => src.ExtendedSpecifications));

            CreateMap<IEnumerable<IndicatorDto>, IndicatorFlags>().ConvertUsing(new ProductIndicatorsConverter());
            CreateMap<IEnumerable<PlantDto>, IEnumerable<PlantModel>>().ConvertUsing(new ListPlantConverter());
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
            CreateMap<StockDto, StockModel>();
            CreateMap<CategoryDto, CategoryModel>();
            CreateMap<MarketDto, MarketModel>();
            CreateMap<AliasDto, AliasModel>();
            CreateMap<WarehouseDto, WarehouseModel>();
            CreateMap<MarketingDto, MarketingModel>();
        }

        public static IEnumerable<ProductModel> ConvertProductsFromDtoToModel(IEnumerable<ProductDto> dto, IEnumerable<ProductModel> models)
        {
            if (models != null)
            {
                foreach (var product in models)
                {
                    // There is probably a cleaner way to do this directly with Automapper
                    product.Status = product.IndicatorsFlag?.DisplayStatus;
                }
            }
            return models;
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

    public class ListPlantConverter : ITypeConverter<IEnumerable<PlantDto>, IEnumerable<PlantModel>>
    {
        public IEnumerable<PlantModel> Convert(IEnumerable<PlantDto> source, IEnumerable<PlantModel> destination, ResolutionContext context)
        {
            List<PlantModel> result = null;
            if (source != null)
            {
                result = new List<PlantModel>();
                foreach (var sourcePlant in source)
                {
                    var destPlant = new PlantModel()
                    {
                        Name = sourcePlant?.Id,
                        Quantity = sourcePlant?.Stock?.Stock,
                    };
                    result.Add(destPlant);
                }
            }
            return result;
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
