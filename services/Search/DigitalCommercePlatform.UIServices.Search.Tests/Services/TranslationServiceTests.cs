//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Enums;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Localization;
using Moq;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class TranslationServiceTests
    {
        private readonly FakeLogger<TranslationService> _logger;
        private readonly Mock<IStringLocalizer> _stringLocalizerMock;
        private readonly TranslationService _sut;

        public TranslationServiceTests()
        {
            _logger = new FakeLogger<TranslationService>();
            _stringLocalizerMock = new Mock<IStringLocalizer>();

            _sut = new TranslationService(_logger, _stringLocalizerMock.Object);
        }

        [Theory]
        [AutoDomainData]
        public void FetchTransaltions_DoNothing_WhenDictNotNull(Dictionary<string, string> dict)
        {
            //arrange
            var translationName = "testTranslation";
            var originalDict = new Dictionary<string, string>(dict);
            //act
            _sut.FetchTranslations(translationName, ref dict);

            //assert
            dict.Should().BeEquivalentTo(originalDict);
            _stringLocalizerMock.Verify(x => x[It.IsAny<string>()], Times.Never);
        }

        [Fact]
        public void FetchTransaltions_PopulateDictionary_WhenProperTranslationExists()
        {
            //arrange
            var translationName = "testTranslation";
            Dictionary<string, string> dict = null;
            _stringLocalizerMock.Setup(x => x[translationName]).Returns(new LocalizedString(translationName, "{'key1':'translated key1','key2':'translated key2'}")).Verifiable();

            var expectedDict = new Dictionary<string, string>
            {
                {"key1","translated key1" },
                {"key2","translated key2" },
            };
            //act
            _sut.FetchTranslations(translationName, ref dict);

            //assert
            _stringLocalizerMock.VerifyAll();
            dict.Should().BeEquivalentTo(expectedDict);
        }

        [Fact]
        public void FetchTransaltions_ReturnEmptyDict_WhenExcpetionwhileParsing()
        {
            //arrange
            var translationName = "testTranslation";
            Dictionary<string, string> dict = null;
            _stringLocalizerMock.Setup(x => x[translationName]).Returns((LocalizedString)null).Verifiable();

            //act
            _sut.FetchTranslations(translationName, ref dict);

            //assert
            _stringLocalizerMock.VerifyAll();
            dict.Should().NotBeNull();
            dict.Should().BeEmpty();
            _logger.GetMessages(Microsoft.Extensions.Logging.LogLevel.Error).Should().ContainMatch("*Exception at FetchTranslations*");
        }

        [Theory]
        [AutoDomainData(nameof(Translate_ReturnExpectedValue_Data))]
        public void Translate_ReturnExpectedValue(Dictionary<string, string> dict, string key, string fallback, string expectedValue)
        {
            //act
            var actual = _sut.Translate(dict, key, fallback);

            //assert
            actual.Should().Be(expectedValue);
        }

        [Theory]
        [AutoDomainData]
        public void TranslateRefinementCountriesTestNull(FullSearchResponseModel input)
        {
            //act
            var actual = _sut.TranslateRefinementCountries(input);

            //assert
            actual.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public void TranslateRefinementCountriesTest(FullSearchResponseModel input)
        {
            //arrange
            var translationName = "Search.UI.InternalRefinements";
            _stringLocalizerMock.Setup(x => x[translationName]).Returns(new LocalizedString(translationName, "{'US':'United States','PR':'Puerto Rico'}")).Verifiable();
            var refinementModel = new RefinementModel
            {
                Id = "Countries",
                Name = "Countries",
                OriginalGroupName = "Countries",
                Type = RefinementType.MultiSelect,
                Options = new List<RefinementOptionModel>()
                {
                    new RefinementOptionModel
                    {
                        Id = "US",
                        Text = "Untranslated",
                    }
                }
            };
            input.TopRefinements = new List<RefinementModel> { refinementModel };
            //act
            var actual = _sut.TranslateRefinementCountries(input);

            //assert
            actual.Should().NotBeNull();
            var option = actual.TopRefinements.First().Options.First();
            option.Text.Should().NotBeEquivalentTo("US");
        }

        public static IEnumerable<object> Translate_ReturnExpectedValue_Data()
        {
            return new[]
            {
                new object[]
                {
                    null,
                    null,
                    null,
                    null
                },
                new object[]
                {
                    new Dictionary<string,string>{ { "key","translation" } },
                    null,
                    null,
                    null
                },
                new object[]
                {
                    new Dictionary<string,string>{ { "key","translation" } },
                    "anotherKey",
                    null,
                    "anotherKey"
                },
                new object[]
                {
                    new Dictionary<string,string>{ { "key","translation" } },
                    "anotherKey",
                    "fallback",
                    "fallback",
                },
                new object[]
                {
                    new Dictionary<string,string>{ { "key","translation" } },
                    "key",
                    "fallback",
                    "translation",
                }
            };
        }
    }
}