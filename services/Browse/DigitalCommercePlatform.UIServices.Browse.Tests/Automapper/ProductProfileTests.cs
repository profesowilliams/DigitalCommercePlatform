//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Automapper
{
    public class ProductProfileTests
    {
        [Fact]
        public void ProductProfileTestIsValid()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<ProductProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}