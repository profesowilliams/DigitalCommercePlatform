using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Actions.Product;
using DigitalCommercePlatform.UIService.Product.Infrastructure.Mappings;
using DigitalCommercePlatform.UIService.Product.Models.Summary;
using DigitalCommercePlatform.UIService.Product.Tests.Helpers;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductSummaryMultiple;

namespace DigitalCommercePlatform.UIService.Product.Tests.Actions
{
    public class GetProductSummaryMultipleTests
    {
        private readonly FakeLogger<GetProductSummaryMultiple> _logger;
        private readonly Mapper _mapper;
        private readonly Mock<IMiddleTierHttpClient> _httpClient;
        private readonly Mock<IOptions<AppSettings>> _options;

        public GetProductSummaryMultipleTests()
        {
            _logger = new FakeLogger<GetProductSummaryMultiple>();
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new ProductProfile())));
            _httpClient = new Mock<IMiddleTierHttpClient>();
            _options = new Mock<IOptions<AppSettings>>();
            var settings = new AppSettings();
            settings.Configure(new Dictionary<string, string> { { "Core.Product.Url", "http://core" }, { "Core.Stock.Url", "http://stock" } });
            _options.Setup(x => x.Value).Returns(settings);
        }

        [Fact]
        public void GetProductSummaryMultiple_Request_ValidResponse()
        {
            // Arrange
            var ids = new string[] { "1", "2" };

            var request = new Request() { Id = ids.ToList() };

            var logger = new FakeLogger<GetProductSummaryMultiple>();

            var response = new GetProductSummaryMultipleResponse(
                new List<SummaryModel>
                {
                     new SummaryModel { Source = new Models.Summary.Internal.SourceModel { Id="1" } },
                     new SummaryModel { Source = new Models.Summary.Internal.SourceModel { Id="2" } }
                }
            );

            var mapper = new Mapper(new MapperConfiguration(m => m.AddProfile(new ProductSummaryProfile())));

            var client = new Mock<IMiddleTierHttpClient>();
            client.SetupResponse<GetProductSummaryMultipleResponse>(response, It.IsAny<string>());
            client.SetupResponse(new List<string>() { "1" }, It.IsAny<string>());

            var options = new Mock<IOptions<AppSettings>>();
            options.Setup(x => x.Value).Returns(new TestAppSettings().Value);

            // Act
            var handler = new Handler(mapper, client.Object, logger, options.Object);
            var result = handler.Handle(request, new System.Threading.CancellationToken()).Result;

            // Assert
            client.Verify(x => x.GetAsync<GetProductSummaryMultipleResponse>(It.Is<string>(x => x.Contains("?Id=1&Id=2&details=False", StringComparison.InvariantCultureIgnoreCase)),
                                                            It.IsAny<IEnumerable<object>>(),
                                                            It.IsAny<IDictionary<string, object>>()), Times.Once);
            result.Should().NotBeNull();
            response.ReturnObject.First().Source.Id.Should().Be(result.ReturnObject.First().Source.Id);
        }

        [Theory]
        [AutoDomainData(nameof(GetExceptions))]
        public void GetProductDetailMultiple_ThrowException_WhenExceptionOtherThanNotFoundReturnedFromCore(Exception exception, Request request)
        {
            // Arrange
            _httpClient.Setup(x => x.GetAsync<GetProductSummaryMultipleResponse>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                        .ThrowsAsync(exception);

            var sut = new Handler(_mapper, _httpClient.Object, _logger, _options.Object);

            // Act
            Func<Task> act = async () => { await sut.Handle(request, default); };

            // Assert
            act.Should().Throw<Exception>();
            _logger.GetMessages().Any(x => x.Contains("Error getting product data in")).Should().BeTrue();
        }

        public static List<object[]> GetExceptions =>
            new List<object[]>
            {
                new object[]{RemoteServerHttpException.WithMessageDetailsAndStatusCode("test",System.Net.HttpStatusCode.BadGateway, null)},
                new object[]{new Exception("test")},
            };
    }
}