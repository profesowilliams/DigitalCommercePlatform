//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class DefaultIndicatorsServiceTests
    {
        private readonly Mock<ISiteSettings> _siteSettingsMock;
        private readonly Mock<IProfileService> _profileServiceMock;

        public DefaultIndicatorsServiceTests()
        {
            _siteSettingsMock = new Mock<ISiteSettings>();

            _profileServiceMock = new Mock<IProfileService>();
        }

        private DefaultIndicatorsService _sut => new DefaultIndicatorsService(_siteSettingsMock.Object, _profileServiceMock.Object);

        [Theory]
        [AutoDomainData(nameof(GetDefaultIndicators_ReturnProperData_Data))]
        public void GetDefaultIndicators_ReturnProperData(string defaultIndicatorsFromSettings, SearchProfileId searchProfileId, SearchProfileModel searchProfileModel, int expectedProfileServiceCalls, List<RefinementGroupRequestDto> expectedResult)
        {
            //arrange
            _siteSettingsMock.Setup(x => x.TryGetSetting("Search.UI.DefaultIndicators")).Returns(defaultIndicatorsFromSettings);
            _profileServiceMock.Setup(x => x.GetSearchProfile(searchProfileId)).Returns(searchProfileModel);

            //act
            var actual = _sut.GetDefaultIndicators(searchProfileId);

            //assert
            _profileServiceMock.Verify(x => x.GetSearchProfile(searchProfileId), Times.Exactly(expectedProfileServiceCalls));

            actual.Should().BeEquivalentTo(expectedResult);
        }

        public static IEnumerable<object> GetDefaultIndicators_ReturnProperData_Data =>
            new[]
            {
                new object[]
                {
                    DefualtIndicatorsFromSettings,
                    null,
                    null,
                    0,
                    DefaultIndicators
                },
                new object[]
                {
                    DefualtIndicatorsFromSettings,
                    new SearchProfileId(null,null),
                    null,
                    0,
                    DefaultIndicators
                },
                new object[]
                {
                    DefualtIndicatorsFromSettings,
                    new SearchProfileId("1","2"),
                    null,
                    1,
                    DefaultIndicators
                },
                new object[]
                {
                    "[{ \"GROUP\":\"AvailabilityType\", \"REFINEMENTS\":[{ \"ID\":\"AvailabilityType\", \"VALUEID\":\"DropShip\" },{ \"ID\": \"AvailabilityType\", \"VALUEID\": \"Warehouse\" }, { \"ID\":\"AvailabilityType\", \"VALUEID\":\"Virtual\" }]},{\"GROUP\":\"InStock\",\"REFINEMENTS\":[{\"ID\":\"InStock\",\"VALUEID\":\"InStockOnly\"}]}]",
                    new SearchProfileId("1","2"),
                    new SearchProfileModel(),
                    1,
                    new List<RefinementGroupRequestDto>() {
                        new RefinementGroupRequestDto()
                            {
                                Group = AvailabilityType,
                                                Refinements = new List<RefinementRequestDto>()
                                                {
                                                    new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "DropShip" },
                                                    new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "Warehouse" },
                                                    new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "Virtual" }
                                                }
                                            },
                                             new RefinementGroupRequestDto()
                            {
                                Group = InStock,
                                                Refinements = new List<RefinementRequestDto>()
                                                {
                                                    new RefinementRequestDto(){ Id = InStock, ValueId = "InStockOnly" }
                                                }
                                            }
                        }
                },
                new object[]
                {
                    "[{ \"GROUP\":\"AvailabilityType\", \"REFINEMENTS\":[{ \"ID\":\"AvailabilityType\", \"VALUEID\":\"DropShip\" },{ \"ID\": \"AvailabilityType\", \"VALUEID\": \"Warehouse\" }, { \"ID\":\"AvailabilityType\", \"VALUEID\":\"Virtual\" }]},{\"GROUP\":\"InStock\",\"REFINEMENTS\":[{\"ID\":\"InStock\",\"VALUEID\":\"InStockOnly\"}]}]",
                    new SearchProfileId("1","2"),
                    new SearchProfileModel{ ActiveStatusCode=true, AllocatedStatusCode=true, PhasedOutStatusCode=true},
                    1,
                    DefaultIndicators
                },
                new object[]
                {
                    DefualtIndicatorsFromSettings,
                    new SearchProfileId("1","2"),
                    new SearchProfileModel(),
                    1,
                    new List<RefinementGroupRequestDto>() {
                        new RefinementGroupRequestDto()
                            {
                                Group = AvailabilityType,
                                                Refinements = new List<RefinementRequestDto>()
                                                {
                                                    new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "DropShip" },
                                                    new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "Warehouse" },
                                                    new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "Virtual" }
                                                }
                                            },
                                             new RefinementGroupRequestDto()
                            {
                                Group = InStock,
                                                Refinements = new List<RefinementRequestDto>()
                                                {
                                                    new RefinementRequestDto(){ Id = InStock, ValueId = "InStockOnly" }
                                                }
                                            }
                        }
                }
            };

        private const string ProductStatus = "ProductStatus";
        private const string DisplayStatus = "DisplayStatus";
        private const string Allocated = "Allocated";
        private const string PhasedOut = "PhasedOut";
        private const string Active = "Active";
        private const string AvailabilityType = "AvailabilityType";
        private const string InStock = "InStock";

        private static string DefualtIndicatorsFromSettings => "[{ \"GROUP\":\"AvailabilityType\", \"REFINEMENTS\":[{ \"ID\":\"AvailabilityType\", \"VALUEID\":\"DropShip\" },{ \"ID\": \"AvailabilityType\", \"VALUEID\": \"Warehouse\" }, { \"ID\":\"AvailabilityType\", \"VALUEID\":\"Virtual\" }]},{ \"GROUP\":\"ProductStatus\", \"REFINEMENTS\":[{\"ID\":\"DisplayStatus\",\"VALUEID\":\"Allocated\"},{\"ID\":\"DisplayStatus\",\"VALUEID\":\"PhasedOut\"},{\"ID\":\"DisplayStatus\",\"VALUEID\":\"Active\"}]},{\"GROUP\":\"InStock\",\"REFINEMENTS\":[{\"ID\":\"InStock\",\"VALUEID\":\"InStockOnly\"}]}]";

        private static List<RefinementGroupRequestDto> DefaultIndicators =>
            new List<RefinementGroupRequestDto>() {
                        new RefinementGroupRequestDto()
        {
            Group = AvailabilityType,
                            Refinements = new List<RefinementRequestDto>()
                            {
                                new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "DropShip" },
                                new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "Warehouse" },
                                new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "Virtual" }
                            }
                        },
                         new RefinementGroupRequestDto()
        {
            Group = ProductStatus,
                            Refinements = new List<RefinementRequestDto>()
                            {
                                new RefinementRequestDto(){ Id = DisplayStatus, ValueId = Allocated },
                                new RefinementRequestDto(){ Id = DisplayStatus, ValueId = PhasedOut },
                                new RefinementRequestDto(){ Id = DisplayStatus, ValueId = Active }
                            }
                        },
                         new RefinementGroupRequestDto()
        {
            Group = InStock,
                            Refinements = new List<RefinementRequestDto>()
                            {
                                new RefinementRequestDto(){ Id = InStock, ValueId = "InStockOnly" }
                            }
                        }
    };
    }
}