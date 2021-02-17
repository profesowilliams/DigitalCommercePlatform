using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Actions.Product;
using DigitalCommercePlatform.UIService.Product.Dto.Summary;
using DigitalCommercePlatform.UIService.Product.Infrastructure.Mappings;
using DigitalCommercePlatform.UIService.Product.Models.Find;
using DigitalCommercePlatform.UIService.Product.Models.Summary;
using DigitalCommercePlatform.UIService.Product.Models.Summary.Internal;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIService.Product.Tests.Actions
{
    public class FindSummaryTests
    {
        private readonly Mock<ILogger<FindSummary.Handler>> _logger;
        private readonly IMapper _mapper;
        private readonly Mock<IMiddleTierHttpClient> _httpClient;
        private readonly Mock<IOptions<AppSettings>> _options;

        public FindSummaryTests()
        {
            _logger = new Mock<ILogger<FindSummary.Handler>>();
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfiles(new Profile[] { new ProductSummaryProfile(), new ProductProfile() })));
            _httpClient = new Mock<IMiddleTierHttpClient>();
            _options = new Mock<IOptions<AppSettings>>();
            var settings = new AppSettings();
            settings.Configure(new Dictionary<string, string> { { "Core.Product.Url", "http://core" } });
            _options.Setup(x => x.Value).Returns(settings);
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        [AutoDomainData]
        public async Task FindFindSummary_RequestWithPagination_CallCoreForDataAndCount(bool withPaginationInfo)
        {
            // Arrange
            var request = new FindSummary.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = withPaginationInfo };

            _httpClient.Setup(x => x.GetAsync<FindSummary.Response>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                        .ReturnsAsync(new FindSummary.Response());

            var sut = GetHandler();

            // Act
            _ = await sut.Handle(request, new CancellationToken()).ConfigureAwait(false);

            // Assert
            _httpClient.Verify(x => x.GetAsync<FindSummary.Response>(It.Is<string>(x => x.Contains("MaterialNumber=1", StringComparison.InvariantCultureIgnoreCase)
                                                                                         && x.Contains("page=1", StringComparison.InvariantCultureIgnoreCase)
                                                                                         && x.Contains("pagesize=1", StringComparison.InvariantCultureIgnoreCase)
                                                                                         && x.Contains($"withPaginationInfo={withPaginationInfo}", StringComparison.InvariantCultureIgnoreCase)),
                                                                        It.IsAny<IEnumerable<object>>(),
                                                                        It.IsAny<IDictionary<string, object>>()), Times.Once);
        }

        [Fact]
        public async Task FindSummary_RequestWithoutPagination_CallCoreOnlyForData()
        {
            // Arrange
            var data = new FindSummary.Response(new List<SummaryModel>() {
                new SummaryModel() {
                    Source = new SourceModel() {
                       Id = "1",
                       System = "1"
                    },
                    Plants = new List<PlantModel>()
                    {
                        new PlantModel()
                        {
                            Id = "1"
                        }
                    }
                }
            });

            var request = new FindSummary.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = false };

            _httpClient.Setup(x => x.GetAsync<FindSummary.Response>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                        .ReturnsAsync(data);

            var sut = GetHandler();

            // Act
            var result = await sut.Handle(request, new CancellationToken()).ConfigureAwait(false);

            // Assert
            result.ReturnObject.Count().Should().Be(1);
            result.ReturnObject.Any(x => x.Plants.Any(p => p.Id == "1")).Should().BeTrue();
            result.ReturnObject.Any(x => x.Source.Id == "1").Should().BeTrue();
        }

        [Theory]
        [AutoDomainData(nameof(GetExceptions))]
        public async Task FindSummary_ThrowErrorAndLog_WhenExceptionOtherThanNotFoundAsync(Exception exception, FindSummary.Request request)
        {
            // Arrange
            _httpClient.Setup(x => x.GetAsync<IEnumerable<SummaryDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .Throws(exception);

            var sut = GetHandler();

            // Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            // Assert
            result.Should().BeNull();
        }

        private FindSummary.Handler GetHandler() => new FindSummary.Handler(_mapper, _httpClient.Object, _logger.Object, _options.Object);

        public static List<object[]> GetExceptions =>
            new List<object[]>
            {
                new object[]{RemoteServerHttpException.WithMessageDetailsAndStatusCode("test",System.Net.HttpStatusCode.BadGateway, null)},
                new object[]{new Exception("test")},
            };
    }
}