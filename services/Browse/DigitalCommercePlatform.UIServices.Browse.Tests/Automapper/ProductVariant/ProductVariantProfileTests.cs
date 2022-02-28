//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings.ProductVariant;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Automapper.ProductVariant
{
    public class ProductVariantProfileTests
    {

        [Fact]
        public void AutoMapper_ProductVariant()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<ProductVariantProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}


