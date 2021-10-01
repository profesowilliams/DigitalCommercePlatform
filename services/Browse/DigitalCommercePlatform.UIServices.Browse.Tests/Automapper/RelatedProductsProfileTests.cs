//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Automapper
{
    public class RelatedProductsProfileTests
    {
        [Fact]
        public void RelatedProductsProfileTestIsValid()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<RelatedProductsProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
