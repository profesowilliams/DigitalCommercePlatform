//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
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
    public class TypeAheadTests
    {
        private readonly Mock<ISearchService> _searchServiceMock;
        private readonly Mock<ISiteSettings> _siteSettingsMock;
        private readonly FakeLogger<TypeAhead.Handler> _logger;

        public TypeAheadTests()
        {
            _logger = new FakeLogger<TypeAhead.Handler>();
            _searchServiceMock = new Mock<ISearchService>();
            _siteSettingsMock = new Mock<ISiteSettings>();
            _siteSettingsMock.Setup(s => s.TryGetSetting("Content.SearchUI.TypeAhead")).Returns("{ \"Type\" : \"Product\", \"MaximumResults\": 10 }");
        }

        [Theory]
        [AutoDomainData]
        public void HandleThrowsExceptionOtherThanRemoteServerHttpException(TypeAhead.Request request)
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
        public void HandleReturnsError(TypeAhead.Request request)
        {
            //arrange
            _searchServiceMock.Setup(x => x.GetTypeAhead(It.IsAny<TypeAhead.Request>())).ThrowsAsync(new Exception("test"));

            var sut = GetHandler();

            //act
            Func<Task> act = async () => await sut.Handle(request, default);
            //assert
            _ = act.Should().ThrowAsync<Exception>();
            _searchServiceMock.Verify(x => x.GetTypeAhead(It.IsAny<TypeAhead.Request>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsNullWhenNotFoundReturned(TypeAhead.Request request)
        {
            //arrange
            _searchServiceMock.Setup(x => x.GetTypeAhead(It.IsAny<TypeAhead.Request>())).Returns(Task.FromResult(new List<TypeAheadModel>()));

            var sut = GetHandler();
            
            //act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //assert
            result.Should().NotBeNull();
            result.Results.Should().NotBeNull();
            _searchServiceMock.Verify(x => x.GetTypeAhead(It.IsAny<TypeAhead.Request>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void ValidatorReturnValidWhenValidRequest(TypeAhead.Request request)
        {
            //arrange
            var sut = new TypeAhead.Validator();

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Fact]
        public void ValidationThrowsErrorForInvalidRequest()
        {
            //arrange
            var sut = new TypeAhead.Validator();
            var request = new TypeAhead.Request(null);

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldHaveValidationErrorFor(r => r.SearchTerm);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsCorrectResult(TypeAhead.Request request, List<TypeAheadModel> appResponse)
        {
            //Arrange
            _searchServiceMock.Setup(x => x.GetTypeAhead(It.IsAny<TypeAhead.Request>())).Returns(Task.FromResult(appResponse));
            var sut = GetHandler();

            //Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //Assert
            result.Results.Should().NotBeNull();

            foreach (var item in appResponse)
            {
                result.Results.ResultGroups.FirstOrDefault().Results.Find(x => x.Id == item.Id
                    && x.Name == item.Name
                    && x.Type == item.Type
                    && x.CategoryName == item.CategoryName
                    && x.Description == item.Description).Should().NotBeNull();
            }

            _searchServiceMock.Verify(x => x.GetTypeAhead(It.IsAny<TypeAhead.Request>()), Times.Once);
        }

        private TypeAhead.Handler GetHandler() => new(_searchServiceMock.Object, _logger, _siteSettingsMock.Object);
    }
}
