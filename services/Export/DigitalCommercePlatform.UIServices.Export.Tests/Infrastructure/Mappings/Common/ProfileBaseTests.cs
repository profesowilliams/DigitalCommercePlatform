//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Common;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Infrastructure.Mappings.Common
{
    public class ProfileBaseTests : IClassFixture<InitProfileBaseFixture>
    {
        public InitProfileBaseFixture Fixture;

        public ProfileBaseTests(InitProfileBaseFixture fixture)
        {
            Fixture = fixture;
        }

        [Fact]
        public void ProfileBaseConfigurationShouldBeValid()
        {
            Fixture.Config.AssertConfigurationIsValid();
        }
    }

    public class InitProfileBaseFixture
    {
        public MapperConfiguration Config { get; }

        public InitProfileBaseFixture()
        {
            Config = new MapperConfiguration(cfg => cfg.AddProfile<ProfileBase>());
        }
    }
}
