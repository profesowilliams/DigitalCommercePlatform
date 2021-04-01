using AutoMapper;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
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
                .ForPath(dest => dest.Items, opt => opt.MapFrom(src => src) );

        }
    }
}
