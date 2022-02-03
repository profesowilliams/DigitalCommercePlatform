//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalog;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions.GetCatalogDetails
{
    public class GetProductCatalogHandlerTests
    {
        private readonly Mock<IBrowseService> _browseService;

        public GetProductCatalogHandlerTests()
        {
            _browseService = new();
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_ReturnResultFromCache(GetProductCatalogHandler.Request request, List<CatalogResponse> response)
        {
            //arrange           
            _browseService.Setup(e => e.GetProductCatalogDetails(request)).ReturnsAsync(response);

            //act
            var result = await Sut().Handle(request, new CancellationToken());

            //assert
            result.Should().NotBeNull();
            result.Content.Should().NotBeNull();
            result.Content.Items.Should().BeEquivalentTo(response);         
        }

        [Fact]
        public void Validator_ReturnInValid()
        {
            //arrange
            var sut = new GetProductCatalogHandler.Validator();

            //act
            var result = sut.TestValidate(new GetProductCatalogHandler.Request(new()));

            //assert
            result.ShouldHaveAnyValidationError();
        }

        [Theory]
        [AutoDomainData()]
        public void Validator_ReturnValid(GetProductCatalogHandler.Request request)
        {
            //arrange
            var sut = new GetProductCatalogHandler.Validator();

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldNotHaveAnyValidationErrors();
        }

        private GetProductCatalogHandler.Handler Sut() => new GetProductCatalogHandler.Handler(_browseService.Object);
    }
}
