using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Automapper
{
    public class CatalogProfileTests
    {
        
        [Fact]
        public void AutoMapper_Customer()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<CatalogProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}

        