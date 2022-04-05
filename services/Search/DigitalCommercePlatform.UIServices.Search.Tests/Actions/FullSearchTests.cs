//2022 (c) Tech Data Corporation - All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.Product;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Actions
{
    public class FullSearchTests
    {
        private readonly Mock<ISearchService> _searchServiceMock;
        private readonly FakeLogger<FullSearch.Handler> _logger;
        private readonly Mapper _mapper;
        private readonly Mock<ISortService> _sortServiceMock;
        private readonly Mock<IItemsPerPageService> _itemsPerPageServiceMock;
        private readonly Mock<IOrderLevelsService> _orderLevelServiceMock;
        private readonly Mock<ITranslationService> _translationServiceMock;

        public FullSearchTests()
        {
            _logger = new FakeLogger<FullSearch.Handler>();
            _searchServiceMock = new Mock<ISearchService>();
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new SearchProfile())));
            _sortServiceMock = new Mock<ISortService>();
            _itemsPerPageServiceMock = new Mock<IItemsPerPageService>();
            _orderLevelServiceMock = new Mock<IOrderLevelsService>();
            _translationServiceMock = new Mock<ITranslationService>();
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
            result.Results.Products.Should().BeNull();
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
            result.Results.Products.FirstOrDefault().DisplayName.Should().NotBeNull();
            _searchServiceMock.Verify(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>()), Times.Once);
        }

        [Theory]
        [AutoDomainData((nameof(GetRequests)))]
        public void ValidatorReturnValidWhenValidRequest(FullSearch.Request request)
        {
            //arrange
            _sortServiceMock.Setup(x => x.GetSortingOptionsBasedOnRequest(It.IsAny<SortRequestModel>(), It.IsAny<SearchProfileId>())).Returns(GetDefaultSortOptions);
            var sut = new FullSearch.Validator(_sortServiceMock.Object);

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Theory]
        [AutoDomainData((nameof(GetWrongRequests)))]
        public void ValidationThrowsErrorForMissingSearchStringOrCategoryRefinementGroup(FullSearch.Request request)
        {
            //arrange
            _sortServiceMock.Setup(x => x.GetSortingOptionsBasedOnRequest(It.IsAny<SortRequestModel>(), It.IsAny<SearchProfileId>())).Returns(GetDefaultSortOptions);
            var sut = new FullSearch.Validator(_sortServiceMock.Object);

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldHaveValidationErrorFor(r => r.FullSearchRequestModel.SearchString);
        }

        [Theory]
        [AutoDomainData((nameof(GetWrongSortRequests)))]
        public void ValidationThrowsErrorForInvalidSortingOptions(FullSearch.Request request)
        {
            //arrange
            _sortServiceMock.Setup(x => x.GetSortingOptionsBasedOnRequest(It.IsAny<SortRequestModel>(), It.IsAny<SearchProfileId>())).Returns(GetDefaultSortOptions);
            var sut = new FullSearch.Validator(_sortServiceMock.Object);

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldHaveValidationErrorFor(r => r.FullSearchRequestModel.Sort.Type);
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

        [Theory]
        [AutoDomainData]
        public async Task DoNotShowOrderLevelsForAnonymousUser(FullSearch.Request request, FullSearchResponseModel appResponse)
        {
            //Arrange
            request.IsAnonymous = true;
            appResponse.OrderLevels = null;

            _searchServiceMock.Setup(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>())).Returns(Task.FromResult(appResponse));
            
            var sut = GetHandler();

            //Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //Assert
            result.Results.Should().NotBeNull();
            result.Results.OrderLevels.Should().BeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task ShowOrderLevelsForLoggedInUser(FullSearch.Request request, FullSearchResponseModel appResponse)
        {
            //Arrange
            request.IsAnonymous = false;
            request.FullSearchRequestModel.OrderLevel = null;

            var orderLevels = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string> { Id = "Commercial", Name = "Commercial (Non-Govt)", Selected = true },
                new DropdownElementModel<string> { Id = "EduHigher", Name = "Education (Higher)", Selected = false },
                new DropdownElementModel<string> { Id = "EduK12", Name = "Education (K-12)", Selected = false }
            };

            _searchServiceMock.Setup(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>())).Returns(Task.FromResult(appResponse));
            _orderLevelServiceMock.Setup(x => x.GetOrderLevelOptions(It.IsAny<SearchProfileId>(), It.IsAny<string>())).Returns(orderLevels);

            var sut = GetHandler();

            //Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //Assert
            result.Results.Should().NotBeNull();
            result.Results.OrderLevels.Should().NotBeNull();
            result.Results.OrderLevels.Single(i => i.Selected).Id.Should().Be("Commercial");
        }


        [Theory]
        [AutoDomainData]
        public async Task Handle_CallServiceWithoutRefinements_WhenGetRefinementsIsFalse(FullSearch.Request request, FullSearchResponseModel appSearchResponse)
        {
            //arrange
            request.IsAnonymous = false;
            request.FullSearchRequestModel.GetRefinements = false;
            _searchServiceMock.Setup(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>())).Returns(Task.FromResult(appSearchResponse));

            var sut = GetHandler();

            //act
            _ = await sut.Handle(request, default).ConfigureAwait(false);

            //assert

            _searchServiceMock.Verify(x => x.GetFullSearchProductData(It.Is<SearchRequestDto>(r => r.GetDetails.ContainsKey(Enums.Details.SearchWithoutRefinements) && r.GetDetails[Enums.Details.SearchWithoutRefinements]), It.IsAny<bool>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_CallServiceWithoutTopRefinements_WhenGetRefinementsIsTrue(FullSearch.Request request, FullSearchResponseModel appSearchResponse)
        {
            //arrange
            request.IsAnonymous = false;
            request.FullSearchRequestModel.GetRefinements = true;
            _searchServiceMock.Setup(x => x.GetFullSearchProductData(It.IsAny<SearchRequestDto>(), It.IsAny<bool>())).Returns(Task.FromResult(appSearchResponse));

            var sut = GetHandler();

            //act
            _ = await sut.Handle(request, default).ConfigureAwait(false);

            //assert

            _searchServiceMock.Verify(x => x.GetFullSearchProductData(It.Is<SearchRequestDto>(r => r.GetDetails.ContainsKey(Enums.Details.TopRefinementsAndResult) && r.GetDetails[Enums.Details.TopRefinementsAndResult]), It.IsAny<bool>()), Times.Once);
        }

        public static List<object[]> GetRequests =>
            new()
            {
                new object[] { new FullSearch.Request(false, new FullSearchRequestModel { SearchString = "test" }, null, "en-US") },
                new object[] { new FullSearch.Request(false, new FullSearchRequestModel { RefinementGroups = new List<RefinementGroupRequestModel>() { new RefinementGroupRequestModel() { Group = "Categories" } } }, null, "en-US") },
                new object[] { new FullSearch.Request(false, new FullSearchRequestModel { SearchString = "test", RefinementGroups = new List<RefinementGroupRequestModel>() { new RefinementGroupRequestModel() { Group = "Categories" } } }, null, "en-US") },
                new object[] { new FullSearch.Request(false, new FullSearchRequestModel { SearchString = "test", Sort = new SortRequestModel { Type = "Relevance" } }, null, "en-US") },
            };

        public static List<object[]> GetWrongRequests =>
            new()
            {
                new object[] { new FullSearch.Request(false, new FullSearchRequestModel(), null, "en-US") },
                new object[] { new FullSearch.Request(false, new FullSearchRequestModel { Page = 1, PageSize = 2 }, null, "en-US") },
                new object[] { new FullSearch.Request(false, new FullSearchRequestModel { SearchString = null }, null, "en-US") },
                new object[] { new FullSearch.Request(false, new FullSearchRequestModel { SearchString = "" }, null, "en-US") },
                new object[] { new FullSearch.Request(false, new FullSearchRequestModel { RefinementGroups = new List<RefinementGroupRequestModel>() { new RefinementGroupRequestModel() { Group = "Test" } } }, null, "en-US") },
                new object[] { new FullSearch.Request(true, new FullSearchRequestModel { RefinementGroups = new List<RefinementGroupRequestModel>() { new RefinementGroupRequestModel() { Group = "Countries" } } }, null, "en-US") },
            };

        public static List<object[]> GetWrongSortRequests =>
            new()
            {
                new object[] { new FullSearch.Request(false, new FullSearchRequestModel { SearchString = "test", Sort = new SortRequestModel { Type = "NotValidSortingOption" } }, null, "en-US") },
            };

        private static IEnumerable<DropdownElementModel<string>> GetDefaultSortOptions =>
            new List<DropdownElementModel<string>>
            {
                        new DropdownElementModel<string>{ Id="Relevance", Selected=false},
                        new DropdownElementModel<string>{ Id="Stock", Selected=false},
                        new DropdownElementModel<string>{ Id="Price.True", Selected=true},
                        new DropdownElementModel<string>{ Id="Price.False", Selected=false}
            };

        private FullSearch.Handler GetHandler() => new(_searchServiceMock.Object, _logger, _mapper, _sortServiceMock.Object, _itemsPerPageServiceMock.Object,_orderLevelServiceMock.Object, _translationServiceMock.Object);
    }
}