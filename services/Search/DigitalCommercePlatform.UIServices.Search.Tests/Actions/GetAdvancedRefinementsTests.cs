//2021 (c) Tech Data Corporation -. All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.Product;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Enums;
using DigitalCommercePlatform.UIServices.Search.Helpers;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Actions
{
    public class GetAdvancedRefinementsTests
    {
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ISearchService> _searchServiceMock;
        private readonly GetAdvancedRefinements.Handler _sut;

        public GetAdvancedRefinementsTests()
        {
            _mapperMock = new Mock<IMapper>();
            _searchServiceMock = new Mock<ISearchService>();
            _sut = new GetAdvancedRefinements.Handler(_searchServiceMock.Object, new FakeLogger<GetAdvancedRefinements.Handler>(), _mapperMock.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handler_CallSearchServiceMockWithProperDictionary(GetAdvancedRefinements.Request request, List<Models.FullSearch.Internal.RefinementGroupResponseModel> response, SearchRequestDto searchRequestDto)
        {
            //arrange
            Dto.FullSearch.SearchRequestDto actualRequest = null;
            _searchServiceMock.Setup(x => x.GetAdvancedRefinements(It.IsAny<Dto.FullSearch.SearchRequestDto>()))
                .ReturnsAsync(response)
                .Callback<Dto.FullSearch.SearchRequestDto>(req => actualRequest = req)
                .Verifiable();

            _mapperMock.Setup(x => x.Map<SearchRequestDto>(request.FullSearchRequestModel)).Returns(searchRequestDto);

            var expectedDict = new Dictionary<Details, bool>() { { Details.Refinements, true } };

            //act
            var result = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            actualRequest.GetDetails.Should().BeEquivalentTo(expectedDict);
            result.Results.Should().BeEquivalentTo(response);
            _searchServiceMock.VerifyAll();
        }

        [Theory]
        [AutoDomainData]
        public void Validate_ReturnValid(GetAdvancedRefinements.Request request)
        {
            //arrange
            var sut = new GetAdvancedRefinements.Validator();

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Fact]
        public void Validate_ReturnInValid_WhenNullFullSearchRequestModel()
        {
            //arrange
            var sut = new GetAdvancedRefinements.Validator();

            //act
            var result = sut.TestValidate(new GetAdvancedRefinements.Request(false, null));

            //assert
            result.ShouldHaveValidationErrorFor(x => x.FullSearchRequestModel);
        }

        [Fact]
        public void Validate_ReturnInValid_WhenEmptySearchString()
        {
            //arrange
            var sut = new GetAdvancedRefinements.Validator();

            //act
            var result = sut.TestValidate(new GetAdvancedRefinements.Request(false, new Models.FullSearch.FullSearchRequestModel()));

            //assert
            result.ShouldHaveValidationErrorFor(x => x.FullSearchRequestModel.SearchString);
        }

        [Fact]
        public void PostProcessResponseBasedOnIsAnonymousTest()
        {
            //arrange
            MethodInfo privateMethod = typeof(GetAdvancedRefinements.Handler).GetMethod("PostProcessResponseBasedOnIsAnonymous", BindingFlags.NonPublic | BindingFlags.Static);
            var isAnonymous = true;
            var request = new GetAdvancedRefinements.Request(isAnonymous, null);
            var response = new List<RefinementGroupResponseModel>
            {
                new RefinementGroupResponseModel
                {
                    Group = RefinementConstants.GeneralGroupName,
                    Refinements = new List<RefinementModel>
                    {
                        new RefinementModel
                        {
                            Id = RefinementConstants.Countries
                        }
                    }
                }
            };
            //act
            var result = (List<RefinementGroupResponseModel>)privateMethod.Invoke(_sut, new object[] { request, response });
            //assert
            result.Should().NotBeNull();
            bool hasRefinementsCountries = result.First(x => x.Group == RefinementConstants.GeneralGroupName).Refinements.Any(x => x.Id == RefinementConstants.Countries);
            hasRefinementsCountries.Should().BeFalse();
        }
    }
}