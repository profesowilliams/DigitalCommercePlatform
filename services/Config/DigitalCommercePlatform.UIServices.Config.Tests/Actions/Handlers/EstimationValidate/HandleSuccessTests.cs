using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using EV = DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.Handlers.EstimationValidate
{
    [ExcludeFromCodeCoverage]
    public class HandleSuccessTests
    {
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ILogger<EV.EstimationValidate.Handler>> _mockLogger;
        private readonly Mock<IConfigService> _mockConfigService;

        public HandleSuccessTests()
        {
            _mockMapper = new();
            _mockLogger = new();
            _mockConfigService = new ();
        }

        [Theory]
        [InlineData(false)]
        [InlineData(true)]
        public async Task Should_return_valid_response_with_expected_value(bool expected)
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
            return new EV.EstimationValidate.Handler(_mockMapper.Object,
                                                     _mockLogger.Object,
                                                     _mockConfigService.Object);
        }
    }
}
