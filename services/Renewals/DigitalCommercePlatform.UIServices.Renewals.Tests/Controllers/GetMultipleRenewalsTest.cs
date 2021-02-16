using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Renewals.Actions.GetRenewals;
using DigitalCommercePlatform.UIServices.Renewals.Actions.GetSummary;
using DigitalCommercePlatform.UIServices.Renewals.Controllers;
using DigitalCommercePlatform.UIServices.Renewals.Models;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Renewals.Tests.Controllers
{
    
    public class GetMultipleRenewalsTest 
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IOptions<AppSettings>> _mockOptions;
        private readonly Mock<ILogger<BaseUIServiceController>> _mockLoggerFactory;
        private readonly Mock<IContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;
        private readonly Mock<IHttpClientFactory> _mockHttpClient;
        public GetMultipleRenewalsTest()
        {
            var appSettingsDict = new Dictionary<string, string>()
            {
                { "localizationlist", "en-US" },
                { "SalesOrg", "WW_ORG" }
            };
            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);
            _mockMediator = new Mock<IMediator>();
            _mockOptions = new Mock<IOptions<AppSettings>>();
            _mockOptions.Setup(s => s.Value).Returns(appSettings);

            _mockLoggerFactory = new Mock<ILogger<BaseUIServiceController>>();
            _mockContext = new Mock<IContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
            _mockHttpClient = new Mock<IHttpClientFactory>();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetRenewals(GetMultipleRenewals.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetMultipleRenewals.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.FindModel
            {
                CustomerId = "00380000",
                UserId = "50546",
                SortBy = "ExpirationDate",
            };
           
            var result = await controller.GetRenewals(criteria).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetSummary(GetRenewalsSummary.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetRenewalsSummary.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.Getsummary("0,30,60,90").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        private RenewalsController GetController()
        {
            return new RenewalsController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _mockOptions.Object, _mockSiteSettings.Object, _mockHttpClient.Object);
        }
    }
}
