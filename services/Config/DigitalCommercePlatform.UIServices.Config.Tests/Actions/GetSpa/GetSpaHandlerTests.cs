//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.Spa;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetSpa
{
    public class GetSpaHandlerTests
    {
        private readonly Mock<ILoggerFactory> _loggerFactory;
        private readonly Mock<IConfigService> _iConfigService;
        private readonly Mock<IHttpClientFactory> _iHttpClientFactory;
        private readonly Mock<IMapper> _imapper;
        private readonly SpaDetails.Handler _handler;


        public GetSpaHandlerTests()
        {
            _loggerFactory = new Mock<ILoggerFactory>();
            _iConfigService = new Mock<IConfigService>();
            _iHttpClientFactory = new Mock<IHttpClientFactory>();
            _imapper = new Mock<IMapper>();
            _handler = new SpaDetails.Handler(_imapper.Object, _loggerFactory.Object, _iConfigService.Object, _iHttpClientFactory.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_MustBeOk(SpaDetails.Response expected)
        {
            _iConfigService.Setup(x => x.GetSpaDetails(
                    It.IsAny<SpaDetails.Request>()
                    ))
                .ReturnsAsync(expected);

            var request = new SpaDetails.Request
            {
               Details=true,
               ProductIds="OKJ908,SDTYB=78Hy",
               Id="249865"
            };

            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleResultMustBeOfTypeWithoutAnyErrors(SpaDetails.Response expected)
        {
            _iConfigService.Setup(x => x.GetSpaDetails(
                    It.IsAny<SpaDetails.Request>()
                    ))
                .ReturnsAsync(expected);

            var request = new SpaDetails.Request
            {
                Details = true,
                ProductIds = "OKJ908,SDTYB=78Hy",
                Id = "249865"
            };

            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
            result.Should().BeOfType<ResponseBase<SpaDetails.Response>>();
            result.Content.Should().NotBeNull();
            result.Content.Should().Be(expected);
            result.Error.Should().NotBeNull();
            result.Error.IsError.Should().BeFalse();
            result.Error.Code.Should().Be(0);
            result.Error.Messages.Should().NotBeNull();
            result.Error.Messages.Count.Should().Be(0);
        }
    }
}
