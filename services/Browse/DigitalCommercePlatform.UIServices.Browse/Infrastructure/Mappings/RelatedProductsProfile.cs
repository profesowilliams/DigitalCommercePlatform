//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct.Internal;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    public class RelatedProductsProfile : Profile
    {
        public RelatedProductsProfile()
        {
            CreateMap<RelatedProductResponseDto, RelatedProductResponseModel>()
                .ForMember(dest => dest.ProductTypes, opt => opt.MapFrom(src => src.Product));

            CreateMap<TypeDto, TypeModel>()
                .ForMember(dest => dest.Value, opt => opt.MapFrom(src => src.Categories));

            CreateMap<ProductDto, ProductModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Source.Id))
                .ForMember(dest => dest.Authorization, opt => opt.MapFrom(src => new AuthorizationModel() { CanOrder = true }));

            CreateMap<CategoryDto, CategoryModel>();
            CreateMap<SourceDto, SourceModel>();
            CreateMap<PriceDto, PriceModel>();
        }
    }
}