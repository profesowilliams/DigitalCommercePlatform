//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal;
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
            CreateMap<MarketingDto, DocumentModel>()
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.Url))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Url));
        }
    }
}