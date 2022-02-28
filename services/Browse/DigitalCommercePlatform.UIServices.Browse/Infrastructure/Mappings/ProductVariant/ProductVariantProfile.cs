//2022 (c) Tech Data Corporation - All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.ProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Models.ProductVariant;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings.ProductVariant
{
    public class ProductVariantProfile : Profile
    {
        public ProductVariantProfile()
        {
            CreateMap<ProductVariantDto, ProductVariantModel>()
                .ForMember(p => p.Name, opt => opt.MapFrom(s => s.Id))
                .ForMember(p => p.ProductLookup, opt => opt.MapFrom(new ProductLookupResolver()));
            CreateMap<AttributeGroupDto, AttributeGroupModel>();
            CreateMap<AttributeDto, AttributeModel>();
            CreateMap<AttributeValueDto, AttributeValueModel>();
        }
    }
}
