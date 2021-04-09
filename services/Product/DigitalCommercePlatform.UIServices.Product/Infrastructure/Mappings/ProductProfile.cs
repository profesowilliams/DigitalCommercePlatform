using AutoMapper;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Product.Dto.Find;
using DigitalCommercePlatform.UIServices.Product.Dto.Product;
using DigitalCommercePlatform.UIServices.Product.Dto.Product.Internal;
using DigitalCommercePlatform.UIServices.Product.Models.Find;
using DigitalCommercePlatform.UIServices.Product.Models.Product;
using DigitalCommercePlatform.UIServices.Product.Models.Product.Internal;


namespace DigitalCommercePlatform.UIServices.Product.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<FindProductModel, FindModelDto>()
               .ForMember(x => x.Page, opt => opt.Ignore())
               .ForMember(x => x.PageSize, opt => opt.Ignore())
               .ForMember(x => x.Details, opt => opt.Ignore())
               .ForMember(x => x.SortBy, opt => opt.Ignore())
               .ForMember(x => x.SortAscending, opt => opt.Ignore());

            CreateMap<ABCDto, ABCModel>();
            CreateMap<AccountAssignmentGroupDto, AccountAssignmentGroupModel>();
            CreateMap<AttributeDto, AttributeModel>();
            CreateMap<BusinessManagerDto, BusinessManagerModel>();
            CreateMap<CustomerPartDto, CustomerPartModel>();
            CreateMap<DirectorDto, DirectorModel>();
            CreateMap<DivisionManagerDto, DivisionManagerModel>();
            CreateMap<MaterialGroupDto, MaterialGroupModel>();
            CreateMap<MaterialProfileDto, MaterialProfileModel>();
            CreateMap<MaterialStatusDto, MaterialStatusModel>();
            CreateMap<PlantDto, PlantModel>()
                .ForMember(x => x.Stock, opt => opt.Ignore())
                ;
            CreateMap<PlantSpecificMaterialStatusDto, PlantSpecificMaterialStatusModel>();
            CreateMap<ProductHierarchyDto, ProductHierarchyModel>();
            CreateMap<PurchasingGroupDto, PurchasingGroupModel>();

            CreateMap<SalesOrganizationDto, SalesOrganizationModel>();
            CreateMap<SiteDto, SiteModel>();
            CreateMap<SiteIndicatorDto, SiteIndicatorModel>();
            CreateMap<SourceDto, SourceModel>();
            CreateMap<VendorDto, VendorModel>();
            CreateMap<WarehouseDto, WarehouseModel>();
            CreateMap<ProductDto, ProductModel>();

            CreateMap<RelatedProductDto, RelatedProductModel>()
                .ForMember(x => x.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(x => x.System, opt => opt.MapFrom(src => src.System))
                .ForMember(x => x.Type, opt => opt.MapFrom(src => src.Type))
                ;

            CreateMap<CategoryDto, CategoryModel>();
            CreateMap<ImageDto, ImageModel>();
            CreateMap<LogoDto, LogoModel>();
            CreateMap<MarketingDto, MarketingModel>();
            CreateMap<MainSpecificationDto, MainSpecificationModel>()
                .ForMember(x => x.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(x => x.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(x => x.Value, opt => opt.MapFrom(src => src.Value));

            CreateMap<ExtendedSpecificationDto, ExtendedSpecificationModel>()
                .ForMember(x => x.GroupName, opt => opt.MapFrom(src => src.GroupName))
                .ForMember(x => x.Attributes, opt => opt.MapFrom(src => src.Attributes));

            CreateMap<ExtendedSpecificationDto.AttributeDto, ExtendedSpecificationModel.AttributeModel>()
                .ForMember(x => x.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(x => x.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(x => x.Value, opt => opt.MapFrom(src => src.Value));

            CreateMap<IndicatorDto, IndicatorModel>()
                     .ForMember(x => x.Context, opt => opt.MapFrom(src => src.Context))
                     .ForMember(x => x.Values, opt => opt.MapFrom(src => src.Values))
                     ;

            CreateMap<ContextDto, ContextModel>();
            CreateMap<Dto.Find.ComparisonOperator, Models.Find.ComparisonOperator>();
        }
    }
}