using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Dto.Stock.Internal;
using DigitalCommercePlatform.UIService.Product.Models.Stock;

namespace DigitalCommercePlatform.UIService.Product.Automapper
{
    public class StockProfile : Profile
    {
        public StockProfile()
        {
            CreateMap<LocationDto, LocationStockModel>();
        }
    }
}