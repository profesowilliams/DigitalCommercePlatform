using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Net.Http;

namespace DigitalCommercePlatform.UIServices.Customer.Tests.Utils
{
    public class TestBase
    {
        protected Mock<IMiddleTierHttpClient> GetMiddleTierHttpClientMock()
        {
            return new Mock<IMiddleTierHttpClient>();
        }

        protected Mock<ILoggerFactory> GetLoggerFactoryMock()
        {
            return new Mock<ILoggerFactory>();
        }

        protected Mock<IOptions<AppSettings>> GetOptionsAppSettingsMock()
        {
            return new Mock<IOptions<AppSettings>>();
        }

        protected Mock<IHttpClientFactory> GetHttpClientFactoryMock()
        {
            return new Mock<IHttpClientFactory>();
        }
    }
}
