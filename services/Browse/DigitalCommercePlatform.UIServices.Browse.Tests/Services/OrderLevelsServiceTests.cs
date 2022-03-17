//2022 (c) Tech Data Corporation - All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.Profile;
using DigitalCommercePlatform.UIServices.Browse.Models;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Providers.Settings;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Services
{
    public class OrderLevelsServiceTests
    {
        private readonly Mock<ITranslationService> _translationServiceMock;
        private readonly Mock<IProfileService<OrderLevelDto>> _profileServiceMock;
        private readonly Mock<ISiteSettings> _siteSettingsMock;

        public OrderLevelsServiceTests()
        {
            _translationServiceMock = new Mock<ITranslationService>();
            _profileServiceMock = new Mock<IProfileService<OrderLevelDto>>();
            _siteSettingsMock = new Mock<ISiteSettings>();
        }

        [Fact]
        public void Not_possible_to_create_service_without_translation_service_dependency()
        {
            void act()
            {
                _ = new OrderLevelsService(translationService: null, _profileServiceMock.Object,_siteSettingsMock.Object);
            }

            _ = Assert.Throws<ArgumentNullException>(act);
        }

        [Fact]
        public void Not_possible_to_create_service_without_profile_service_dependency()
        {
            void act()
            {
                _ = new OrderLevelsService(_translationServiceMock.Object, profileService: null, _siteSettingsMock.Object);
            }

            _ = Assert.Throws<ArgumentNullException>(act);
        }

        [Fact]
        public void Not_possible_to_create_service_without_settings_service_dependency()
        {
            void act()
            {
                _ = new OrderLevelsService(_translationServiceMock.Object, _profileServiceMock.Object, siteSettings: null);
            }

            _ = Assert.Throws<ArgumentNullException>(act);
        }

        [Fact]
        public void Not_possible_to_create_service_with_empty_site_settings_dependency()
        {
            var orderLevelsSettings = new List<DropdownElementModel<string>>();

            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            void act()
            {
                _ = new OrderLevelsService(_translationServiceMock.Object, _profileServiceMock.Object, _siteSettingsMock.Object);
            }

            var exception = Assert.Throws<ArgumentException>(act);
            Assert.Equal("Browse.UI.OrderLevels site settings collection can not be empty", exception.Message);
        }

        [Theory]
        [MemberData(nameof(SiteSettingsSelectedPropertyData))]
        public void Not_possible_to_create_service_without_site_settings_dependency_with_only_one_element_marked_as_selected(List<DropdownElementModel<string>> orderLevelsSettings)
        {
            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            void act()
            {
                _ = new OrderLevelsService(_translationServiceMock.Object, _profileServiceMock.Object, _siteSettingsMock.Object);
            }

            var exception = Assert.Throws<ArgumentException>(act);
            Assert.Equal("Browse.UI.OrderLevels site settings collection must have one element marked as Selected equals True", exception.Message);
        }

        [Theory]
        [MemberData(nameof(SiteSettingsIdPropertyData))]
        public void Not_possible_to_create_service_without_site_settings_dependency_with_id_values_for_all_elements(List<DropdownElementModel<string>> orderLevelsSettings)
        {
            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            void act()
            {
                _ = new OrderLevelsService(_translationServiceMock.Object, _profileServiceMock.Object, _siteSettingsMock.Object);
            }

            var exception = Assert.Throws<ArgumentException>(act);
            Assert.Equal("Browse.UI.OrderLevels site settings collection must have all elements with specified Id", exception.Message);
        }

        [Fact]
        public void Translated_options_are_returned_with_correct_selected_value_from_preferred_order_level()
        {
            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "EduHigher" },
                new DropdownElementModel<string>{ Selected = false, Id = "GovtFederal" }
            };

            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            _translationServiceMock.SetupSequence(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns("Commercial (Non - Govt)").Returns("Education (K 12)").Returns("Federal ");

            _profileServiceMock.Setup(x => x.Get(It.IsAny<string>())).Returns(new OrderLevelDto { DefaultPricingOption = "GovtFederal" });

            var sut = new OrderLevelsService(_translationServiceMock.Object, _profileServiceMock.Object, _siteSettingsMock.Object);

            var orderLevels = sut.GetOrderLevels(preferredOrderLevel: "Commercial");

            orderLevels.orderLevelsOptions.Should().NotBeEmpty().And.HaveCount(3);
           
            orderLevels.orderLevelsOptions.ElementAt(0).Name.Should().Be("Commercial (Non - Govt)");
            orderLevels.orderLevelsOptions.ElementAt(0).Selected.Should().Be(true);

            orderLevels.orderLevelsOptions.ElementAt(1).Name.Should().Be("Education (K 12)");
            orderLevels.orderLevelsOptions.ElementAt(1).Selected.Should().Be(false);

            orderLevels.selectedOrderLevel.Should().Be("Commercial");
        }

        [Fact]
        public void Non_existing_order_level_is_returned_for_non_existing_preferred_order_level()
        {
            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "EduHigher" },
                new DropdownElementModel<string>{ Selected = false, Id = "GovtFederal" }
            };

            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            _translationServiceMock.SetupSequence(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns("Commercial (Non - Govt)").Returns("Education (K 12)").Returns("Federal ");

            _profileServiceMock.Setup(x => x.Get(It.IsAny<string>())).Returns(new OrderLevelDto { DefaultPricingOption = "GovtFederal" });

            var sut = new OrderLevelsService(_translationServiceMock.Object, _profileServiceMock.Object, _siteSettingsMock.Object);

            var orderLevels = sut.GetOrderLevels(preferredOrderLevel: "Wrong");

            orderLevels.orderLevelsOptions.Should().BeNull();
            orderLevels.selectedOrderLevel.Should().Be("Wrong");
        }


        [Theory]
        [MemberData(nameof(ProfileOrderLevelsData))]
        public void Translated_options_are_returned_with_correct_selected_value_from_site_settings(OrderLevelDto nonExistingOrderLevelDtoFromProfile)
        {
            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "EduHigher" }
            };

            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            _translationServiceMock.SetupSequence(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns("Commercial (Non - Govt)").Returns("Education (K 12)");

            _profileServiceMock.Setup(x => x.Get(It.IsAny<string>())).Returns(nonExistingOrderLevelDtoFromProfile);

            var sut = new OrderLevelsService(_translationServiceMock.Object, _profileServiceMock.Object, _siteSettingsMock.Object);

            var orderLevels = sut.GetOrderLevels(preferredOrderLevel: null);

            orderLevels.orderLevelsOptions.Should().NotBeEmpty().And.HaveCount(2);
            
            orderLevels.orderLevelsOptions.ElementAt(0).Name.Should().Be("Commercial (Non - Govt)");
            orderLevels.orderLevelsOptions.ElementAt(0).Selected.Should().Be(false);

            orderLevels.orderLevelsOptions.ElementAt(1).Name.Should().Be("Education (K 12)");
            orderLevels.orderLevelsOptions.ElementAt(1).Selected.Should().Be(true);

            orderLevels.selectedOrderLevel.Should().Be("EduHigher");
        }

        [Fact]
        public void Translated_options_are_returned_with_correct_selected_value_from_profile()
        {
            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "EduHigher" }
            };

            _siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            _translationServiceMock.SetupSequence(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns("Commercial (Non - Govt)").Returns("Education (K 12)");

            _profileServiceMock.Setup(x => x.Get(It.IsAny<string>())).Returns(new OrderLevelDto { DefaultPricingOption = "Commercial" });

            var sut = new OrderLevelsService(_translationServiceMock.Object, _profileServiceMock.Object, _siteSettingsMock.Object);

            var orderLevels = sut.GetOrderLevels(preferredOrderLevel: null);

            orderLevels.orderLevelsOptions.Should().NotBeEmpty().And.HaveCount(2);
            
            orderLevels.orderLevelsOptions.ElementAt(0).Name.Should().Be("Commercial (Non - Govt)");
            orderLevels.orderLevelsOptions.ElementAt(0).Selected.Should().Be(true);

            orderLevels.orderLevelsOptions.ElementAt(1).Name.Should().Be("Education (K 12)");
            orderLevels.orderLevelsOptions.ElementAt(1).Selected.Should().Be(false);

            orderLevels.selectedOrderLevel.Should().Be("Commercial");
        }



        public static IEnumerable<object[]> SiteSettingsSelectedPropertyData()
        {
            return new List<object[]>
            {
                new object[]
                {
                    new List<DropdownElementModel<string>>
                    {
                        new DropdownElementModel<string>{ Selected=true},
                        new DropdownElementModel<string>{ Selected=true},
                        new DropdownElementModel<string>{ Selected=true}
                    }
                },
                new object[]
                {
                    new List<DropdownElementModel<string>>
                    {
                        new DropdownElementModel<string>{ Selected=false},
                        new DropdownElementModel<string>{ Selected=false},
                        new DropdownElementModel<string>{ Selected=false}
                    }
                }
            };
        }

        public static IEnumerable<object[]> SiteSettingsIdPropertyData()
        {
            return new List<object[]>
            {
                new object[]
                {
                    new List<DropdownElementModel<string>>
                    {
                        new DropdownElementModel<string>{ Id = null},
                        new DropdownElementModel<string>{ Selected = true, Id = "Commercial" },
                        new DropdownElementModel<string>{ Id = "Commercial" }
                    }
                },
                new object[]
                {
                    new List<DropdownElementModel<string>>
                    {
                        new DropdownElementModel<string>{ Id = String.Empty},
                        new DropdownElementModel<string>{ Selected = true, Id = "Commercial" },
                        new DropdownElementModel<string>{ Id = "Commercial" }
                    }
                },
                new object[]
                {
                    new List<DropdownElementModel<string>>
                    {
                        new DropdownElementModel<string>{ Id = "     "},
                        new DropdownElementModel<string>{ Selected = true, Id = "Commercial" },
                        new DropdownElementModel<string>{ Id = "Commercial" }
                    }
                },
                new object[]
                {
                    new List<DropdownElementModel<string>>
                    {
                        new DropdownElementModel<string>{ Id = null },
                        new DropdownElementModel<string>{ Id = String.Empty },
                        new DropdownElementModel<string>{ Selected = true, Id = "    "}
                    }
                }
            };
        }

        public static IEnumerable<object[]> ProfileOrderLevelsData()
        {
            return new List<object[]>
            {
                new object[]
                {
                    null
                },
                new object[]
                {
                    new OrderLevelDto { DefaultPricingOption = null }
                },
                new object[]
                {
                    new OrderLevelDto { DefaultPricingOption = string.Empty }
                },
                new object[]
                {
                    new OrderLevelDto { DefaultPricingOption = "    " }
                }
            };
        }
    }
    
}
