using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Mappings;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests
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
