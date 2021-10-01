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
            CreateMap<RelatedProductResponseDto, RelatedProductResponseModel>();

            CreateMap<TypeDto, TypeModel>();
            CreateMap<CategoryDto, CategoryModel>();
            CreateMap<ProductDto, ProductModel>();
            CreateMap<SourceDto, SourceModel>();
            CreateMap<PriceDto, PriceModel>();
        }
    }
}
