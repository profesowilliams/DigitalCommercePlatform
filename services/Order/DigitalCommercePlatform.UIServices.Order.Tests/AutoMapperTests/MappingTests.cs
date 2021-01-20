using AutoMapper;
using DigitalCommercePlatform.UIService.Order.AutoMapper;

namespace DigitalCommercePlatform.UIService.Order.Tests.AutoMapperTests
{
    public class MappingTests
    {
        protected readonly IMapper mapper;

        public MappingTests()
        {
            var mapperCfg = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<OrderProfile>();
            });

            mapper = mapperCfg.CreateMapper();
        }
    }
}