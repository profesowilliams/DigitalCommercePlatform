using AutoMapper;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Product.Dto.Stock.Internal;
using DigitalCommercePlatform.UIServices.Product.Models.Stock;

namespace DigitalCommercePlatform.UIServices.Product.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class StockProfile : Profile
    {
        public StockProfile()
        {
            CreateMap<LocationDto, LocationStockModel>();
        }
    }
}