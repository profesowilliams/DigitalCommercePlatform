//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Controller
{
    public class ExportControllerFixture
    {
        public readonly Mock<IMediator> MockMediator;
        public readonly Mock<IAppSettings> AppSettingsMock;
        public readonly Mock<ILogger<BaseUIServiceController>> MockLoggerFactory;
        public readonly Mock<IUIContext> MockContext;
        public readonly Mock<ISiteSettings> MockSiteSettings;

        public ExportControllerFixture()
        {
            AppSettingsMock = new Mock<IAppSettings>();
            AppSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            MockMediator = new Mock<IMediator>();
            MockLoggerFactory = new Mock<ILogger<BaseUIServiceController>>();
            MockContext = new Mock<IUIContext>();
            MockContext.SetupGet(x => x.Language).Returns("en-us");
            MockSiteSettings = new Mock<ISiteSettings>();
        }

    }
}
