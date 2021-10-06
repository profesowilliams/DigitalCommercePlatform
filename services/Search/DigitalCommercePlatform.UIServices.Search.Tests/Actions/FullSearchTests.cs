//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.Product;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Settings;
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
    public class FullSearchTests
    {
        private readonly Mock<ISearchService> _searchServiceMock;
        private readonly FakeLogger<FullSearch.Handler> _logger;
        private readonly Mapper _mapper;

        public FullSearchTests()
        {
            _logger = new FakeLogger<FullSearch.Handler>();
            _searchServiceMock = new Mock<ISearchService>();
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new SearchProfile())));
        }

        [Theory]
        [AutoDomainData]
        public void HandleThrowsExceptionOtherThanRemoteServerHttpException(FullSearch.Request request)
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
        public void HandleReturnsError(FullSearch.Request request)
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
        public async Task HandleReturnsNullWhenNotFoundReturned(FullSearch.Request request)
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
        public async Task HandleReturnsForAuthorizedUser(FullSearch.Request request, FullSearchResponseModel appSearchResponse)
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
        public void ValidatorReturnValidWhenValidRequest(FullSearch.Request request)
        {
            //arrange
            var sut = new FullSearch.Validator();

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Fact]
        public void ValidationThrowsErrorForMissingSearchStringInvalidRequest()
        {
            //arrange
            var sut = new FullSearch.Validator();
            var request = new FullSearch.Request(false, new Models.FullSearch.FullSearchRequestModel());

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldHaveValidationErrorFor(r => r.FullSearchRequestModel.SearchString);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsCorrectResult(FullSearch.Request request, FullSearchResponseModel appResponse)
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

        private FullSearch.Handler GetHandler() => new(_searchServiceMock.Object, _logger, _mapper);
    }
}
