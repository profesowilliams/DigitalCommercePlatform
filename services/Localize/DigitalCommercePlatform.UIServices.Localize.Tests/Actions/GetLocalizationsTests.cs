//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Localization;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Localize.Actions.GetLocalizations;

namespace DigitalCommercePlatform.UIServices.Localize.Tests.Actions
{
    public class GetLocalizationsTests
    {
        private readonly Mock<IStringLocalizer> _localizerMock;
        private readonly FakeLogger<Handler> _logger;
        private readonly Handler _sut;

        public GetLocalizationsTests()
        {
            _localizerMock = new Mock<IStringLocalizer>();
            _logger = new FakeLogger<Handler>();

            _sut = new Handler(_localizerMock.Object, _logger);
        }

        [Theory]
        [AutoDomainData(nameof(Handle_ProperlyMappedResults_Data))]
        public async Task Handle_ProperlyMappedResults((string key, string response)[] localizerSetup, Dictionary<string, Dictionary<string, string>> expectedResults)
        {
            //arrange
            var request = new Request(localizerSetup.Select(x => x.key).ToArray());

            foreach (var setup in localizerSetup)
            {
                _localizerMock.Setup(x => x[setup.key]).Returns(new LocalizedString(setup.key, setup.response))
                    .Verifiable();
            }

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            actual.Should().BeEquivalentTo(expectedResults);
            _localizerMock.VerifyAll();
        }

        public static IEnumerable<object> Handle_ProperlyMappedResults_Data()
        {
            return new[]
            {
                new object[]
                {
                    new (string key, string response)[]{("Search.UI.InternalRefinements","{\"AvailabilityType\": \"Availability Type\",\"Warehouse\": \"In Warehouse\"}")},
                    new Dictionary<string, Dictionary<string, string>>
                    {
                        {"Search.UI.InternalRefinements", new Dictionary<string, string>{ { "AvailabilityType","Availability Type" },{ "Warehouse", "In Warehouse" } } }
                    }
                },
                new object[]
                {
                    new (string key, string response)[]{("AvailabilityType", "Availability Type") },
                    new Dictionary<string, Dictionary<string, string>>
                    {
                        {"AvailabilityType", new Dictionary<string, string>{ { "AvailabilityType", "Availability Type" } } }
                    }
                },
                new object[]
                {
                    new (string key, string response)[]{("Search.UI.InternalRefinements-AvailabilityType", "Availability Type") },
                    new Dictionary<string, Dictionary<string, string>>
                    {
                        {"Search.UI.InternalRefinements", new Dictionary<string, string>{ { "AvailabilityType", "Availability Type" } } }
                    }
                },
                new object[]
                {
                    new (string key, string response)[]{("Search.UI.InternalRefinements-AvailabilityType", "Availability Type"),("Search.UI.InternalRefinements","{\"AvailabilityType\": \"Availability Type\",\"Warehouse\": \"In Warehouse\"}") },
                    new Dictionary<string, Dictionary<string, string>>
                    {
                        {"Search.UI.InternalRefinements", new Dictionary<string, string>{ { "AvailabilityType", "Availability Type" }, { "Warehouse", "In Warehouse" } } }
                    }
                }
            };
        }

        [Fact]
        public async Task Handle_WillLogExceptionAndReturnNotTranslatedResponse()
        {
            //arrange
            _localizerMock.Setup(x => x[It.IsAny<string>()]).Throws(new TestException()).Verifiable();
            var request = new Request(new string[] { "test" });
            var expected = new Dictionary<string, Dictionary<string, string>> { { "test", new Dictionary<string, string> { { "test", "test" } } } };

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            _localizerMock.VerifyAll();
            actual.Should().BeEquivalentTo(expected);
            _logger.GetMessages(Microsoft.Extensions.Logging.LogLevel.Error).Should().NotBeEmpty();
            _logger.GetMessages(Microsoft.Extensions.Logging.LogLevel.Error).Should().ContainMatch("*Exception at GetByNamespace.Handler.GetLocalizations with id: test*");
        }

        public class TestException : Exception
        { }
    }
}