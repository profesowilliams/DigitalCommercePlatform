//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Export.Fixtures
{
    public class InitExportProfileFixture
    {
        public MapperConfiguration Config { get; }

        public InitExportProfileFixture()
        {
            Config = new MapperConfiguration(cfg => cfg.AddProfile<ExportProfile>());
        }
    }
}
