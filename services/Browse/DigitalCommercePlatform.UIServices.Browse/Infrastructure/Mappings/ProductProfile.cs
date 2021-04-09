using AutoMapper;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using System.Collections.Generic;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindProductHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindSummaryHandler;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<IEnumerable<ProductModel>, GetProductResponse>()
                .ForMember(dest => dest.ReturnObject, opt => opt.MapFrom(src => src));
            CreateMap<IEnumerable<SummaryModel>, FindSummaryResponse>()
                .ForMember(dest => dest.SummaryModels, opt => opt.MapFrom(src => src));

        }
    }
}
