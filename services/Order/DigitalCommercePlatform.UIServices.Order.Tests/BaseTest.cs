using AutoMapper;
using DigitalCommercePlatform.UIService.Order.AutoMapper;

namespace DigitalCommercePlatform.UIService.Order.Tests
{
    public class BaseTest
    {
        protected IMapper GetMapper()
        {
            var mapperCfg = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<OrderProfile>();
            });

            return mapperCfg.CreateMapper();
        }
    }
}