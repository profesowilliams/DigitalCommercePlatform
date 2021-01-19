using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Dto.Find;
using DigitalCommercePlatform.UIService.Product.Dto.Product;
using DigitalCommercePlatform.UIService.Product.Dto.Product.Internal;
using DigitalCommercePlatform.UIService.Product.Models.Find;
using DigitalCommercePlatform.UIService.Product.Models.Product;
using DigitalCommercePlatform.UIService.Product.Models.Product.Internal;

namespace DigitalCommercePlatform.UIService.Product.Automapper
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<FindProductModel, FindModelDto>()
                .ForMember(x => x.Page, opt => opt.Ignore())
                .ForMember(x => x.PageSize, opt => opt.Ignore())
                .ForMember(x => x.Details, opt => opt.Ignore());

            CreateMap<ABCDto, ABCModel>();
            CreateMap<AccountAssignmentGroupDto, AccountAssignmentGroupModel>();
            CreateMap<AttributeDto, AttributeModel>();
            CreateMap<AttributeGroupDto, AttributeGroupModel>();
            CreateMap<BusinessManagerDto, BusinessManagerModel>();
            CreateMap<ClassCodeDto, ClassCodeModel>();
            CreateMap<CTOIndDto, CTOIndModel>();
            CreateMap<CustomerPartDto, CustomerPartModel>();
            CreateMap<DirectorDto, DirectorModel>();
            CreateMap<DivisionManagerDto, DivisionManagerModel>();
            CreateMap<FamilyCodeDto, FamilyCodeModel>();
            CreateMap<HAZMATDto, HAZMATModel>();
            CreateMap<MaterialGroupDto, MaterialGroupModel>();
            CreateMap<MaterialProfileDto, MaterialProfileModel>();
            CreateMap<MaterialStatusDto, MaterialStatusModel>();
            CreateMap<PlantDto, PlantModel>()
                .ForMember(x => x.Stock, opt => opt.Ignore());
            CreateMap<PlantSpecificMaterialStatusDto, PlantSpecificMaterialStatusModel>();
            CreateMap<ProductHierarchyDto, ProductHierarchyModel>();
            CreateMap<IndicatorDto, IndicatorModel>();
            CreateMap<PurchasingGroupDto, PurchasingGroupModel>();

            CreateMap<SalesOrganizationDto, SalesOrganizationModel>();
            CreateMap<SiteDto, SiteModel>();
            CreateMap<SiteIndicatorDto, SiteIndicatorModel>();
            CreateMap<SourceDto, SourceModel>();
            CreateMap<SubclassCodeDto, SubclassCodeModel>();
            CreateMap<VendorDto, VendorModel>();
            CreateMap<WarehouseDto, WarehouseModel>();
            CreateMap<ProductDto, ProductModel>();
        }
    }
}