//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Export.Fixtures;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Infrastructure.Mappings.Export
{
    public class ExportProfileTests : IClassFixture<InitExportProfileFixture>
    {
        public InitExportProfileFixture Fixture;
        public IMapper Mapper;

        public ExportProfileTests(InitExportProfileFixture fixture)
        {
            Fixture = fixture;
            Mapper = Fixture.Config.CreateMapper();
        }

        [Fact]
        public void ExportProfileConfigurationShouldBeValid()
        {
            Fixture.Config.AssertConfigurationIsValid();
        }
    }
}
