//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Dto.ProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Models.ProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions.GetProductVariant
{
    public class GetProductVariantTests
    {
        private readonly Mock<IBrowseService> _browseService;
        private readonly Mock<IMapper> _mapper;

        public GetProductVariantTests()
        {
            _browseService = new();
            _mapper = new();
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("  ")]
        public void Validator_ReturnInValid(string id)
        {
            //arrange
            var sut = new GetProductVariantHandler.Validator();

            //act
            var result = sut.TestValidate(new GetProductVariantHandler.Request(id));

            //assert
            result.ShouldHaveAnyValidationError();
        }

        [Theory]
        [AutoDomainData]
        public void Validator_ReturnValid(GetProductVariantHandler.Request request)
        {
            //arrange
            var sut = new GetProductVariantHandler.Validator();

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_ReturnsData(
            GetProductVariantHandler.Request request, 
            ProductVariantDto productVariantDto, 
            ProductVariantModel productVariantModel) 
        {
            //arrange
            var sut = new GetProductVariantHandler.Handler(_browseService.Object, _mapper.Object);
            _browseService.Setup(b => b.GetProductVariant(It.IsAny<GetProductVariantHandler.Request>()))
                .ReturnsAsync(productVariantDto)
                .Verifiable();
            _mapper.Setup(m => m.Map<ProductVariantModel>(It.Is<ProductVariantDto>(p => p == productVariantDto)))
                .Returns(productVariantModel)
                .Verifiable();

            //act
            var result = await sut.Handle(request, new CancellationToken());

            //assert
            _browseService.Verify();
            _mapper.Verify();
            result.Should().BeEquivalentTo(new GetProductVariantHandler.Response(productVariantModel));
        }

    }
}