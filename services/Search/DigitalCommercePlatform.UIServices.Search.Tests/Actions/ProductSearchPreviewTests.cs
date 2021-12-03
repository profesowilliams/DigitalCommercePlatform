//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.Product;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Actions
{
    public class ProductSearchPreviewTests
    {
        private readonly Mock<ISearchService> _searchServiceMock;
        private readonly FakeLogger<ProductSearchPreview.Handler> _logger;
        private readonly Mapper _mapper;
        private readonly Mock<ISiteSettings> _siteSettingsMock;

        public ProductSearchPreviewTests()
        {
            _logger = new FakeLogger<ProductSearchPreview.Handler>();
            _searchServiceMock = new Mock<ISearchService>();
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new SearchProfile())));
            _siteSettingsMock = new Mock<ISiteSettings>();
            _siteSettingsMock.Setup(s => s.TryGetSetting("Catalog.All.DefaultCatalog")).Returns("FCS");
        }

        [Theory]
        [AutoDomainData]
        public void HandleThrowsExceptionOtherThanRemoteServerHttpException(ProductSearchPreview.Request request)
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
        public void HandleReturnsError(ProductSearchPreview.Request request)
        {
            //arrange
            _searchServiceMock.Setup(x => x.GetProductSearchPreviewData(It.IsAny<SearchRequestDto>())).ThrowsAsync(new Exception("test"));

            var sut = GetHandler();

            //act
            Func<Task> act = async () => await sut.Handle(request, default);
            //assert
            _ = act.Should().ThrowAsync<Exception>();
            _searchServiceMock.Verify(x => x.GetProductSearchPreviewData(It.IsAny<SearchRequestDto>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsNullWhenNotFoundReturned(ProductSearchPreview.Request request)
        {
            //arrange
            _searchServiceMock.Setup(x => x.GetProductSearchPreviewData(It.IsAny<SearchRequestDto>())).Returns(Task.FromResult(new List<ProductSearchPreviewModel>()));

            var sut = GetHandler();
            
            //act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //assert
            result.Should().NotBeNull();
            result.Results.Should().NotBeNull();
            _searchServiceMock.Verify(x => x.GetProductSearchPreviewData(It.IsAny<SearchRequestDto>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsCorrectResult(ProductSearchPreview.Request request, List<ProductSearchPreviewModel> appSearchResponse)
        {
            //Arrange
            _searchServiceMock.Setup(x => x.GetProductSearchPreviewData(It.IsAny<SearchRequestDto>())).Returns(Task.FromResult(appSearchResponse));
            var sut = GetHandler();

            //Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //Assert
            result.Should().NotBeNull();
            result.Results.Should().NotBeNull();
            _searchServiceMock.Verify(x => x.GetProductSearchPreviewData(It.IsAny<SearchRequestDto>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsCorrectResultWhenSiteSettingIsNull(ProductSearchPreview.Request request, List<ProductSearchPreviewModel> appSearchResponse)
        {
            //Arrange
            _searchServiceMock.Setup(x => x.GetProductSearchPreviewData(It.IsAny<SearchRequestDto>())).Returns(Task.FromResult(appSearchResponse));
            var _siteSettingsMockEmpty = new Mock<ISiteSettings>();
            var sut = new ProductSearchPreview.Handler(_searchServiceMock.Object, _logger, _mapper, _siteSettingsMockEmpty.Object);

            //Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //Assert
            result.Results.Should().NotBeNull();
            _searchServiceMock.Verify(x => x.GetProductSearchPreviewData(It.IsAny<SearchRequestDto>()), Times.Once);
        }


        private ProductSearchPreview.Handler GetHandler() => new(_searchServiceMock.Object, _logger, _mapper, _siteSettingsMock.Object);
    }
}
