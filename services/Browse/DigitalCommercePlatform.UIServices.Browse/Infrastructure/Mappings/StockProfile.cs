//2022 (c) Tech Data Corporation - All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.Stock;
using DigitalCommercePlatform.UIServices.Browse.Models.Stock;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    public class StockProfile : Profile
    {
        public StockProfile()
        {
            CreateMap<StockDto, StockModel>();

            CreateMap<LocationDto, LocationModel>();
        }
    }
}