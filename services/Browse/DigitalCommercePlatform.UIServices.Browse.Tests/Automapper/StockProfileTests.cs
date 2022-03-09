//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Automapper
{
    public class StockProfileTests
    {
        [Fact]
        public void AutoMapper_StockProfile()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<StockProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}