using AutoMapper;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIService.Product.Dto.Stock.Internal;
using DigitalCommercePlatform.UIService.Product.Models.Stock;

namespace DigitalCommercePlatform.UIService.Product.Infrastructure.Mappings
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