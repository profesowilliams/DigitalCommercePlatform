//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Product.Actions;
using DigitalCommercePlatform.UIServices.Product.Models.Product.Product;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Product.Infrastructure.Mappings
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<IEnumerable<ProductModel>, ProductDetails.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));
        }
    }
}
