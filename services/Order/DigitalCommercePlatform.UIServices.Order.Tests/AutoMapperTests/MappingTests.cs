using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.AutoMapper;

namespace DigitalCommercePlatform.UIServices.Order.Tests.AutoMapperTests
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