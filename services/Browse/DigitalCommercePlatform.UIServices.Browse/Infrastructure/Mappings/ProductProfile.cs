//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<ProductData, FindProductHandler.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));
            CreateMap<SummaryDetails, FindSummaryHandler.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));
        }
    }
}