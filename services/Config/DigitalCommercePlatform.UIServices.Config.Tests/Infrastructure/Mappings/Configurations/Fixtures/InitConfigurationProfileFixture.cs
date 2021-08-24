//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Configurations.Fixtures
{
    public class InitConfigurationProfileFixture
    {
        public MapperConfiguration Config { get; }

        public InitConfigurationProfileFixture()
        {
            Config = new MapperConfiguration(cfg => cfg.AddProfile<ConfigurationProfile>());
        }
    }
}
