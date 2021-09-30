//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.App;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class SearchServiceTests
    {
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly FakeLogger<SearchService> _logger;
        private readonly Mock<IUIContext> _context;
        private readonly SearchService _searchService;
        private readonly Mapper _mapper;

        public SearchServiceTests() {
            _logger = new FakeLogger<SearchService>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("App.Search.Url")).Returns("http://app-Search/v1");
            _context = new Mock<IUIContext>();
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new SearchProfile())));
            _searchService = new SearchService(_middleTierHttpClient.Object, _logger, _appSettingsMock.Object, _context.Object, _mapper);
        }

        [Theory]
        [AutoDomainData]
        public void TypeAheadThrowsExceptionOtherThanRemoteServerHttpException(TypeAhead.Request request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .ThrowsAsync(new Exception("test"));

            //act
            Func<Task> act = async () => await _searchService.GetTypeAhead(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task TypeAheadThrowsWhenNotFoundReturned(TypeAhead.Request request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.NotFound, details: null));

            //act
            var result = await _searchService.GetTypeAhead(request);

            //assert
            result.Should().BeNull();
            _middleTierHttpClient.Verify(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void TypeAheadThrowsOtherThanNotFound(TypeAhead.Request request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.InternalServerError, details: null));

            //act
            Func<Task> act = async () => await _searchService.GetTypeAhead(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task TypeAheadReturnsCorrectResult(TypeAhead.Request request, List<TypeAheadModel> appResponse)
        {
            //Arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .Returns(Task.FromResult(appResponse));

            //Act
            var result = await _searchService.GetTypeAhead(request);

            //Assert
            result.Should().NotBeNull();

            foreach (var item in appResponse)
            {
                result.Find(x => x.Id == item.Id
                    && x.Name == item.Name
                    && x.Type == item.Type
                    && x.CategoryName == item.CategoryName
                    && x.Description == item.Description).Should().NotBeNull();
            }

            _middleTierHttpClient.Verify(x => x.GetAsync<List<TypeAheadModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void GetProductThrowsExceptionOtherThanRemoteServerHttpException(AppSearchRequestModel request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<AppSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>()))
                .ThrowsAsync(new Exception("test"));

            //act
            Func<Task> act = async () => await _searchService.GetFullSearchProductData(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.PostAsync<AppSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductThrowsWhenNotFoundReturned(AppSearchRequestModel request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<AppSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>()))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.NotFound, details: null));

            //act
            var result = await _searchService.GetFullSearchProductData(request);

            //assert
            result.Should().BeNull();
            _middleTierHttpClient.Verify(x => x.PostAsync<AppSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void GetProductThrowsOtherThanNotFound(AppSearchRequestModel request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<AppSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>()))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.InternalServerError, details: null));

            //act
            Func<Task> act = async () => await _searchService.GetFullSearchProductData(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.PostAsync<AppSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductReturnsCorrectResult(AppSearchRequestModel request, AppSearchResponseDto appResponse)
        {
            //Arrange
            _middleTierHttpClient.Setup(x => x.PostAsync<AppSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>()))
                .Returns(Task.FromResult(appResponse));

            //Act
            var result = await _searchService.GetFullSearchProductData(request);

            //Assert
            result.Should().NotBeNull();

            _middleTierHttpClient.Verify(x => x.PostAsync<AppSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<object>()), Times.Once);
        }
    }
}
