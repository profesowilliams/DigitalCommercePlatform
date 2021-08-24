//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Deals.Fixtures
{
    public class InitDealProfileFixture
    {
        public MapperConfiguration Config { get; }

        public InitDealProfileFixture()
        {
            Config = new MapperConfiguration(cfg => cfg.AddProfile<DealProfile>());
        }
    }
}
