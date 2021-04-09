using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.AutoMapper;

namespace DigitalCommercePlatform.UIServices.Order.Tests
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