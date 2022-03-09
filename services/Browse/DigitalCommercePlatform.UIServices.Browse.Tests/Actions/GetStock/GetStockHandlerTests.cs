//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetStock;
using DigitalCommercePlatform.UIServices.Browse.Models.Stock;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions.GetStock
{
    public class GetStockHandlerTests
    {
        private readonly Mock<IBrowseService> _browseService;

        public GetStockHandlerTests()
        {
            _browseService = new Mock<IBrowseService>();
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsData(GetStockHandler.Request request, StockModel stockModel)
        {
            // Arrange
            _browseService.Setup(b => b.GetStock(It.Is<GetStockHandler.Request>(r => r == request)))
                .ReturnsAsync(stockModel)
                .Verifiable();
            var sut = new GetStockHandler.Handler(_browseService.Object);

            // Act
            var result = await sut.Handle(request, new CancellationToken());

            // Assert
            _browseService.Verify();
            result.Should().BeEquivalentTo(stockModel);
        }
    }
}