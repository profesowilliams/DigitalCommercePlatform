//using AutoMapper;
//using DigitalCommercePlatform.UIService.Product.Actions.Product;
//using DigitalCommercePlatform.UIService.Product.Automapper;
//using DigitalCommercePlatform.UIService.Product.Dto.Summary;
//using DigitalCommercePlatform.UIService.Product.Models.Find;
//using DigitalCommercePlatform.UIService.Product.Models.Summary;
//using DigitalFoundation.Common.Client;
//using DigitalFoundation.Common.Settings;
//using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
//using DigitalFoundation.Common.TestUtilities;
//using FluentAssertions;
//using FluentValidation.TestHelper;
//using Microsoft.Extensions.Logging;
//using Microsoft.Extensions.Options;
//using Moq;
//using System;
//using System.Collections.Generic;
//using System.Threading;
//using System.Threading.Tasks;
//using Xunit;

//namespace DigitalCommercePlatform.UIService.Product.Tests.Actions
//{
//    public class FindSummaryTests
//    {
//        private readonly Mock<ILogger<FindSummary.Handler>> _logger;
//        private readonly IMapper _mapper;
//        private readonly Mock<IMiddleTierHttpClient> _httpClient;
//        private readonly Mock<IOptions<AppSettings>> _options;

//        public FindSummaryTests()
//        {
//            _logger = new Mock<ILogger<FindSummary.Handler>>();
//            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfiles(new Profile[] { new ProductSummaryProfile(), new ProductProfile() })));
//            _httpClient = new Mock<IMiddleTierHttpClient>();
//            _options = new Mock<IOptions<AppSettings>>();
//            var settings = new AppSettings();
//            settings.Configure(new Dictionary<string, string> { { "Core.Product.Url", "http://core" } });
//            _options.Setup(x => x.Value).Returns(settings);
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task FindFindSummary_RequestWithPagination_CallCoreForDataAndCount(IEnumerable<SummaryDto> summariesDto)
//        {
//            //arrange
//            var request = new FindSummary.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = true };

//            _httpClient.Setup(x => x.GetAsync<IEnumerable<SummaryDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ReturnsAsync(summariesDto);
//            _httpClient.Setup(x => x.GetAsync<long>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ReturnsAsync(1);

//            var expected = _mapper.Map<IEnumerable<SummaryModel>>(summariesDto);

//            var sut = GetHandler();
//            //act
//            var result = await sut.Handle(request, new CancellationToken()).ConfigureAwait(false);

//            //assert
//            _httpClient.Verify(x => x.GetAsync<IEnumerable<SummaryDto>>(It.Is<string>(x => x.Contains("MaterialNumber=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("page=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("pagesize=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("details=false", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.StartsWith("http://core/find?", StringComparison.InvariantCultureIgnoreCase)),
//                                                                        It.IsAny<IEnumerable<object>>(),
//                                                                        It.IsAny<IDictionary<string, object>>()), Times.Once);

//            _httpClient.Verify(x => x.GetAsync<long>(It.Is<string>(x => x.Contains("MaterialNumber=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("page=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("pagesize=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.StartsWith("http://core/count?", StringComparison.InvariantCultureIgnoreCase)),
//                                                                        It.IsAny<IEnumerable<object>>(),
//                                                                        It.IsAny<IDictionary<string, object>>()), Times.Once);

//            result.TotalRecords.Should().Be(1);
//            result.ReturnObject.Should().BeEquivalentTo(expected);
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task FindSummary_RequestWithoutPagination_CallCoreOnlyForData(IEnumerable<SummaryDto> productDtos)
//        {
//            //arrange
//            var request = new FindSummary.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = false };

//            _httpClient.Setup(x => x.GetAsync<IEnumerable<SummaryDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ReturnsAsync(productDtos);

//            var expected = _mapper.Map<IEnumerable<SummaryModel>>(productDtos);

//            var sut = GetHandler();
//            //act
//            var result = await sut.Handle(request, new CancellationToken()).ConfigureAwait(false);

//            //assert
//            _httpClient.Verify(x => x.GetAsync<IEnumerable<SummaryDto>>(It.Is<string>(x => x.Contains("MaterialNumber=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("page=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("pagesize=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("details=false", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.StartsWith("http://core/find?", StringComparison.InvariantCultureIgnoreCase)),
//                                                                        It.IsAny<IEnumerable<object>>(),
//                                                                        It.IsAny<IDictionary<string, object>>()), Times.Once);

//            _httpClient.Verify(x => x.GetAsync<long>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Never);

//            result.TotalRecords.Should().BeNull();
//            result.ReturnObject.Should().BeEquivalentTo(expected);
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task FindSummary_ReturnNull_WhenNotFoundThrownByCore(FindSummary.Request request)
//        {
//            //arrange
//            _httpClient.Setup(x => x.GetAsync<IEnumerable<SummaryDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                .Throws(RemoteServerHttpException.WithMessageDetailsAndStatusCode("test", System.Net.HttpStatusCode.NotFound, null));

//            var sut = GetHandler();

//            //act
//            var result = await sut.Handle(request, new CancellationToken()).ConfigureAwait(false);

//            //assert
//            result.Should().BeNull();
//        }

//        [Theory]
//        [AutoDomainData(nameof(GetExceptions))]
//        public void FindSummary_ThrowErrorAndLog_WhenExceptionOtherThanNotFound(Exception exception, FindSummary.Request request)
//        {
//            //arrange
//            _httpClient.Setup(x => x.GetAsync<IEnumerable<SummaryDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                .Throws(exception);

//            var sut = GetHandler();

//            //act
//            Func<Task> act = async () => { await sut.Handle(request, new CancellationToken()).ConfigureAwait(false); };

//            //assert
//            act.Should().Throw<Exception>();

//            _logger.Verify(x => x.Log(LogLevel.Error,
//                                            It.IsAny<EventId>(),
//                                            It.Is<It.IsAnyType>((v, t) => true),
//                                            It.Is<Exception>(e => e.Message == exception.Message),
//                                            It.Is<Func<It.IsAnyType, Exception, string>>((v, t) => true)), Times.Once);
//        }

//        [Fact]
//        public void Validator_ValidatFalse_WhenNotValidRequest()
//        {
//            //arrange
//            var sut = new FindSummary.Validator();

//            //act
//            var result = sut.TestValidate(new FindSummary.Request { Page = -1, PageSize = -1, Query = null });

//            //assert
//            result.ShouldHaveValidationErrorFor(x => x.Page);
//            result.ShouldHaveValidationErrorFor(x => x.PageSize);
//            result.ShouldHaveValidationErrorFor(x => x.Query);
//        }

//        [Fact]
//        public void Validator_ValidatTrue_WhenValidRequest()
//        {
//            //arrange
//            var sut = new FindSummary.Validator();

//            //act
//            var result = sut.TestValidate(new FindSummary.Request { Page = 1, PageSize = 1, Query = new FindProductModel() });

//            //assert
//            result.ShouldNotHaveValidationErrorFor(x => x.Page);
//            result.ShouldNotHaveValidationErrorFor(x => x.PageSize);
//            result.ShouldNotHaveValidationErrorFor(x => x.Query);
//        }

//        private FindSummary.Handler GetHandler() => new FindSummary.Handler(_mapper, _httpClient.Object, _logger.Object, _options.Object);

//        public static List<object[]> GetExceptions =>
//            new List<object[]>
//            {
//                new object[]{RemoteServerHttpException.WithMessageDetailsAndStatusCode("test",System.Net.HttpStatusCode.BadGateway, null)},
//                new object[]{new Exception("test")},
//            };
//    }
//}