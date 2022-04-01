//2022 (c) TD Synnex - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Dto.Price;
using DigitalCommercePlatform.UIServices.Browse.Dto.Price.Internal;
using DigitalCommercePlatform.UIServices.Browse.Models.Spa;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetSpa.GetSpaHandler;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions.GetSpa
{
    public class GetSpaHandlerTests
    {
        private readonly Mock<IMiddleTierHttpClient> _httpClientMock;
        private readonly FakeLogger<Handler> _logger;
        private readonly Mock<ICultureService> _cultureServiceMock;
        private readonly Handler _sut;

        public GetSpaHandlerTests()
        {
            _httpClientMock = new Mock<IMiddleTierHttpClient>();
            _logger = new FakeLogger<Handler>();
            _cultureServiceMock = new Mock<ICultureService>();
            var appsettingsMock = new Mock<IAppSettings>();
            appsettingsMock.Setup(x => x.GetSetting("App.Price.Url")).Returns("http://app-price");

            _sut = new Handler(_httpClientMock.Object, appsettingsMock.Object, _logger, _cultureServiceMock.Object);

            Thread.CurrentThread.CurrentCulture = new CultureInfo("en-US");
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_CallAppPriceWithCorrectRequest(Request request, PriceResponseDto priceResponseDto)
        {
            //arrange
            PriceRequestDto actualRequestBody = null;
            _httpClientMock.Setup(x => x.PostAsync<IEnumerable<PriceResponseDto>>("http://app-price", null, It.IsAny<object>(), null, null))
                .Callback<string, IEnumerable<object>, object, IDictionary<string, object>, IDictionary<string, string>>((_, _, body, _, _) => actualRequestBody = (PriceRequestDto)body)
                .ReturnsAsync(new PriceResponseDto[] { priceResponseDto })
                .Verifiable()
                ;

            priceResponseDto.Currency = "USD";

            priceResponseDto.EndUserPromos.First().Value = null;

            PriceRequestDto expectedRequestBody = new PriceRequestDto(request.Id);
            var expectedResult = priceResponseDto.EndUserPromos.Select(x => new SpaResponseModel
            {
                EndUserName = x.EndCustomer,
                ExpirationDate = x.Expiration.Value.ToString(Thread.CurrentThread.CurrentCulture),
                MinimumQuantity = x.MinQuantity.Value.ToString(Thread.CurrentThread.CurrentCulture),
                RemainingQuantity = x.RemainingQuantity.Value.ToString(Thread.CurrentThread.CurrentCulture),
                VendorBidNumber = x.VendorBidNumber,
                Price = x.Value.HasValue ? string.Format(Thread.CurrentThread.CurrentCulture, "{0:C}", x.Value.Value) : null
            });

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            actual.Should().BeEquivalentTo(expectedResult);
            actualRequestBody.Should().BeEquivalentTo(expectedRequestBody);
            _httpClientMock.VerifyAll();
            _cultureServiceMock.Verify(x => x.Process(request.Culture), Times.Once);
        }

        [Theory]
        [AutoDomainData(nameof(Handle_ReturnEmpty_WhenNoResult_Data))]
        public async Task Handle_ReturnEmpty_WhenNoResult(PriceResponseDto priceResponseDto, Request request)
        {
            //arrange
            _httpClientMock.Setup(x => x.PostAsync<IEnumerable<PriceResponseDto>>("http://app-price", null, It.IsAny<object>(), null, null))
                .ReturnsAsync(new PriceResponseDto[] { priceResponseDto })
                ;

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            actual.Should().BeEmpty();
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_ReturnEmpty_WhenException(IEnumerable<PriceResponseDto> priceResponseDto, Request request)
        {
            //arrange
            _httpClientMock.Setup(x => x.PostAsync<IEnumerable<PriceResponseDto>>("http://app-price", null, It.IsAny<object>(), null, null))
                .ReturnsAsync(priceResponseDto)
                ;

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            actual.Should().BeEmpty();
            _logger.GetMessages(Microsoft.Extensions.Logging.LogLevel.Error).Should().ContainMatch($"*Exception at GetSpaHandler with ProductId: {request.Id}*");
        }

        public static IEnumerable<object> Handle_ReturnEmpty_WhenNoResult_Data()
        {
            return new[]
            {
                new object[]
                {
                    null
                },
                new object[]
                {
                    new PriceResponseDto()
                },
                new object[]
                {
                    new PriceResponseDto
                    {
                        EndUserPromos=Array.Empty<EndUserPromosDto>()
                    }
                }
            };
        }
    }
}