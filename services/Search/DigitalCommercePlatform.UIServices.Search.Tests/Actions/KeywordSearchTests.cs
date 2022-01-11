//2022 (c) Tech Data Corporation - All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.Product;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Actions
{
    public class KeywordSearchTests
    {
        private readonly Mock<ISearchService> _searchServiceMock;
        private readonly FakeLogger<KeywordSearch.Handler> _logger;
        private readonly Mapper _mapper;
        private Mock<ISiteSettings> _siteSettingsMock;
        private readonly Mock<ISortService> _sortServiceMock;
        private readonly Mock<IItemsPerPageService> _itemsPerPageServiceMock;
        private readonly Mock<IMarketService> _marketServiceMock;
        private readonly Mock<IDefaultIndicatorsService> _defaultIndicatorsServiceMock;

        public KeywordSearchTests()
        {
            _logger = new FakeLogger<KeywordSearch.Handler>();
            _searchServiceMock = new Mock<ISearchService>();
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new SearchProfile())));
            _siteSettingsMock = new Mock<ISiteSettings>();
            _siteSettingsMock.Setup(s => s.TryGetSetting("Catalog.All.DefaultCatalog")).Returns("FCS");
            _siteSettingsMock.Setup(s => s.TryGetSetting("Search.UI.DefaultIndicators")).Returns("[{ \"Group\":\"AvailabilityType\", \"Refinements\":[{ \"Id\":\"DropShip\", \"ValueId\":\"Y\" },{ \"Id\": \"Warehouse\", \"ValueId\": \"Y\" }, { \"Id\":\"Virtual\", \"ValueId\":\"Y\" }]},{ \"Group\":\"ProductStatus\", \"Refinements\":[{\"Id\":\"DisplayStatus\",\"ValueId\":\"Allocated\"},{\"Id\":\"DisplayStatus\",\"ValueId\":\"PhasedOut\"},{\"Id\":\"DisplayStatus\",\"ValueId\":\"Active\"}]},{\"Group\":\"InStock\",\"Refinements\":[{\"Id\":\"InStock\",\"ValueId\":\"Y\"}]}]");
            _sortServiceMock = new Mock<ISortService>();
            _itemsPerPageServiceMock = new Mock<IItemsPerPageService>();

            _marketServiceMock = new Mock<IMarketService>();

            _defaultIndicatorsServiceMock = new Mock<IDefaultIndicatorsService>();
        }

        [Theory]
        [AutoDomainData]
        public void HandleThrowsExceptionOtherThanRemoteServerHttpException(KeywordSearch.Request request)
        {
            //arrange

            var sut = GetHandler();

            //act
            Func<Task> act = async () => await sut.Handle(request, default);

            //assert
            act.Should().ThrowAsync<Exception>();
        }

        [Theory]
        [AutoDomainData]
        public void HandleReturnsError(KeywordSearch.Request request)
        {
            //arrange
            _searchServiceMock.Setup(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>())).ThrowsAsync(new Exception("test"));

            var sut = GetHandler();

            //act
            Func<Task> act = async () => await sut.Handle(request, default);
            //assert
            _ = act.Should().ThrowAsync<Exception>();
            _searchServiceMock.Verify(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsNullWhenNotFoundReturned(KeywordSearch.Request request)
        {
            //arrange
            _searchServiceMock.Setup(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>())).Returns(Task.FromResult(new FullSearchResponseModel()));

            var sut = GetHandler();

            //act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //assert
            result.Should().NotBeNull();
            result.Results.Should().NotBeNull();
            _searchServiceMock.Verify(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsForAuthorizedUser(KeywordSearch.Request request, FullSearchResponseModel appSearchResponse)
        {
            //arrange
            request.IsAnonymous = false;
            _searchServiceMock.Setup(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>())).Returns(Task.FromResult(appSearchResponse));

            var sut = GetHandler();

            //act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //assert
            result.Should().NotBeNull();
            result.Results.Should().NotBeNull();
            _searchServiceMock.Verify(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsCorrectResult(KeywordSearch.Request request, FullSearchResponseModel appResponse)
        {
            //Arrange
            _searchServiceMock.Setup(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>())).Returns(Task.FromResult(appResponse));
            var sut = GetHandler();

            //Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //Assert
            result.Results.Should().NotBeNull();

            _searchServiceMock.Verify(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsCorrectResultWhenExactMatch(KeywordSearch.Request request, FullSearchResponseModel appResponse)
        {
            //Arrange
            var exactMatch = appResponse.Products.FirstOrDefault();
            appResponse.Products.Clear();
            appResponse.Products.Add(exactMatch);
            request.IsAnonymous = false;
            _searchServiceMock.Setup(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>())).Returns(Task.FromResult(appResponse));
            var sut = GetHandler();

            //Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //Assert
            result.Results.Should().NotBeNull();
            result.Results.Products.FirstOrDefault().IsExactMatch.Should().BeTrue();
            _searchServiceMock.Verify(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsCorrectResultWhenSiteSettingIsNull(KeywordSearch.Request request, FullSearchResponseModel appResponse)
        {
            //Arrange
            _searchServiceMock.Setup(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>())).Returns(Task.FromResult(appResponse));
            _siteSettingsMock = new Mock<ISiteSettings>();
            var sut = GetHandler();

            //Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //Assert
            result.Results.Should().NotBeNull();
            _searchServiceMock.Verify(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>()), Times.Once);
        }

        private KeywordSearch.Handler GetHandler() => new(new(_searchServiceMock.Object, _logger, _mapper, _siteSettingsMock.Object, _sortServiceMock.Object, _itemsPerPageServiceMock.Object, _defaultIndicatorsServiceMock.Object, _marketServiceMock.Object));
    }
}