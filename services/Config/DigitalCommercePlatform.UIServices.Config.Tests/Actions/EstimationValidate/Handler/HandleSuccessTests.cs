using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using EV = DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.EstimationValidate.Handler
{
    [ExcludeFromCodeCoverage]
    public class HandleSuccessTests
    {
        private readonly Mock<IMapper> _mockMapper;
        private readonly NullLoggerFactory _loggerFactory;
        private readonly Mock<IConfigService> _mockConfigService;
        private readonly Mock<IHttpClientFactory> _mockHttpClientFactory;

        public HandleSuccessTests()
        {
            _loggerFactory = new NullLoggerFactory();
            _mockMapper = new();
            _mockConfigService = new();
            _mockHttpClientFactory = new();
        }

        [Theory]
        [InlineData(false)]
        [InlineData(true)]
        public async Task ShouldReturnValidResponseWithExpectedValue(bool expected)
        {
            _mockConfigService.Setup(x => x.EstimationValidate(
                       It.IsAny<EV.EstimationValidate.Request>()
                       //It.IsAny<CancellationToken>()
                       ))
                   .ReturnsAsync(expected);

            var handler = GetHandler();
            var result = await handler.Handle(null, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
            result.Content.IsValid.Should().Be(expected);
        }

        private EV.EstimationValidate.Handler GetHandler()
        {
            return new EV.EstimationValidate.Handler(
                _loggerFactory,
                _mockConfigService.Object,
                _mockHttpClientFactory.Object);
        }
    }
}