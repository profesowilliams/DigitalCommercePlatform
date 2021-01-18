//using AutoMapper;
//using DigitalCommercePlatform.UIService.Product.Actions.Product;
//using DigitalCommercePlatform.UIService.Product.Automapper;
//using DigitalCommercePlatform.UIService.Product.Dto.Summary;
//using DigitalCommercePlatform.UIService.Product.Tests.Helpers;
//using DigitalFoundation.Common.Client;
//using DigitalFoundation.Common.Settings;
//using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
//using DigitalFoundation.Common.TestUtilities;
//using FluentAssertions;
//using FluentValidation.TestHelper;
//using Microsoft.Extensions.Options;
//using Moq;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Xunit;
//using static DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductSummaryMultiple;

//namespace DigitalCommercePlatform.UIService.Product.Tests.Actions
//{
//    public class GetProductSummaryMultipleTests
//    {
//        private readonly FakeLogger<GetProductSummaryMultiple> _logger;
//        private readonly Mapper _mapper;
//        private readonly Mock<IMiddleTierHttpClient> _httpClient;
//        private readonly Mock<IOptions<AppSettings>> _options;

//        public GetProductSummaryMultipleTests()
//        {
//            _logger = new FakeLogger<GetProductSummaryMultiple>();
//            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new ProductProfile())));
//            _httpClient = new Mock<IMiddleTierHttpClient>();
//            _options = new Mock<IOptions<AppSettings>>();
//            var settings = new AppSettings();
//            settings.Configure(new Dictionary<string, string> { { "Core.Product.Url", "http://core" }, { "Core.Stock.Url", "http://stock" } });
//            _options.Setup(x => x.Value).Returns(settings);
//        }

//        [Fact]
//        public void GetProductSummaryMultiple_Request_ValidResponse()
//        {
//            // arrange
//            var ids = new string[] { "1", "2" };

//            var request = new Request() { Id = ids.ToList() };

//            var logger = new FakeLogger<GetProductSummaryMultiple>();

//            var response = new List<SummaryDto>
//            {
//                 new SummaryDto { Source = new Dto.Summary.Internal.SourceDto{Id="1" } },
//                 new SummaryDto { Source = new Dto.Summary.Internal.SourceDto{Id="2" } }
//            };

//            var mapper = new Mapper(new MapperConfiguration(m => m.AddProfile(new ProductSummaryProfile())));

//            var client = new Mock<IMiddleTierHttpClient>();
//            client.SetupResponse<IEnumerable<SummaryDto>>(response, It.IsAny<string>());
//            client.SetupResponse(new List<string>() { "1" }, It.IsAny<string>());

//            var options = new Mock<IOptions<AppSettings>>();
//            options.Setup(x => x.Value).Returns(new TestAppSettings().Value);

//            // act
//            var handler = new Handler(mapper, client.Object, logger, options.Object);
//            var result = handler.Handle(request, new System.Threading.CancellationToken()).Result;

//            // assert
//            client.Verify(x => x.GetAsync<IEnumerable<SummaryDto>>(It.Is<string>(x => x.Contains("?Id=1&Id=2&details=False", StringComparison.InvariantCultureIgnoreCase)),
//                                                            It.IsAny<IEnumerable<object>>(),
//                                                            It.IsAny<IDictionary<string, object>>()), Times.Once);
//            result.Should().NotBeNull();
//            response.First().Source.Id.Should().Be(result.ReturnObject.First().Source.Id);
//        }

//        [Fact]
//        public async Task GetProducSummaryMultiple_ReturnsNull_WhenNotFoundReturnedFromCore()
//        {
//            //arrange
//            var request = new Request { Id = new List<string> { } };

//            _httpClient.Setup(x => x.GetAsync<IEnumerable<SummaryDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ThrowsAsync(RemoteServerHttpException.WithMessageDetailsAndStatusCode("test", System.Net.HttpStatusCode.NotFound, null));

//            var sut = new Handler(_mapper, _httpClient.Object, _logger, _options.Object);

//            //act
//            var result = await sut.Handle(request, default);

//            //act and assert
//            result.Should().BeNull();
//        }

//        [Theory]
//        [AutoDomainData(nameof(GetExceptions))]
//        public void GetProductDetailMultiple_ThrowException_WhenExceptionOtherThanNotFoundReturnedFromCore(Exception exception, Request request)
//        {
//            //arrange
//            _httpClient.Setup(x => x.GetAsync<IEnumerable<SummaryDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ThrowsAsync(exception);

//            var sut = new Handler(_mapper, _httpClient.Object, _logger, _options.Object);

//            //act
//            Func<Task> act = async () => { await sut.Handle(request, default); };

//            //act and assert
//            act.Should().Throw<Exception>();
//            _logger.GetMessages().Any(x => x.Contains("Error getting product data in")).Should().BeTrue();
//        }

//        [Fact]
//        public void GetProductSummaryMultipleValidator_EmptyId_InvalidRequest()
//        {
//            var request = new Request() { Id = new List<string>() };
//            var result = new Validator().TestValidate(request);
//            result.ShouldHaveValidationErrorFor(r => r.Id);
//        }

//        [Fact]
//        public void GetProductSummaryMultipleValidator_ValidId_ValidRequest()
//        {
//            var request = new Request() { Id = new List<string>() { "1" } };
//            var result = new Validator().TestValidate(request);
//            result.ShouldNotHaveAnyValidationErrors();
//        }

//        public static List<object[]> GetExceptions =>
//            new List<object[]>
//            {
//                new object[]{RemoteServerHttpException.WithMessageDetailsAndStatusCode("test",System.Net.HttpStatusCode.BadGateway, null)},
//                new object[]{new Exception("test")},
//            };
//    }
//}