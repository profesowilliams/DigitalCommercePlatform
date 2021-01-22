using DigitalCommercePlatform.UIService.Catalog.Controllers;
using FluentAssertions;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Catalog.Tests.Controllers
{
    public class WeatherForecastControllerTest
    {
        [Fact]
        public void GetTest()
        {
            // Arrange
            var _sut = new WeatherForecastController();
            // Act
            var result = _sut.Get();
            // Assert
            result.Should().NotBeNull();
        }
    }
}
