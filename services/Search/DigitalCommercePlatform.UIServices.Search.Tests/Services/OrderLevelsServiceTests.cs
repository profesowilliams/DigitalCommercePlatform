//2022 (c) Tech Data Corporation - All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Providers.Settings;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class OrderLevelsServiceTests
    {
        [Fact]
        public void Not_possible_to_create_service_without_translation_service_dependency()
        {
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            void act()
            {
                _ = new OrderLevelsService(translationService: null, profileServiceMock.Object, siteSettingsMock.Object);
            }

            Assert.Throws<ArgumentNullException>(act);
        }

        [Fact]
        public void Not_possible_to_create_service_without_profile_service_dependency()
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            void act()
            {
                _ = new OrderLevelsService(translationServiceMock.Object, profileService: null, siteSettingsMock.Object);
            }

            Assert.Throws<ArgumentNullException>(act);
        }

        [Fact]
        public void Not_possible_to_create_service_without_settings_service_dependency()
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            

            void act()
            {
                _ = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettings: null);
            }

            Assert.Throws<ArgumentNullException>(act);
        }

        [Fact]
        public void Not_possible_to_create_service_with_empty_site_settings_dependency()
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            var orderLevelsSettings = new List<DropdownElementModel<string>>();

            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            void act()
            {
                _ = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettingsMock.Object);
            }

            var exception = Assert.Throws<ArgumentException>(act);
            Assert.Equal("Search.UI.OrderLevels site settings collection can not be empty", exception.Message);
        }

        [Theory]
        [MemberData(nameof(SiteSettingsSelectedPropertyData))]
        public void Not_possible_to_create_service_without_site_settings_dependency_with_only_one_element_marked_as_selected(List<DropdownElementModel<string>>  orderLevelsSettings)
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            void act()
            {
                _ = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettingsMock.Object);
            }

            var exception = Assert.Throws<ArgumentException>(act);
            Assert.Equal("Search.UI.OrderLevels site settings collection must have one element marked as Selected equals True", exception.Message);
        }

        [Theory]
        [MemberData(nameof(SiteSettingsIdPropertyData))]
        public void Not_possible_to_create_service_without_site_settings_dependency_with_id_values_for_all_elements(List<DropdownElementModel<string>> orderLevelsSettings)
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            void act()
            {
                _ = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettingsMock.Object);
            }

            var exception = Assert.Throws<ArgumentException>(act);
            Assert.Equal("Search.UI.OrderLevels site settings collection must have all elements with specified Id", exception.Message);
        }

        [Theory]
        [MemberData(nameof(ProfileUserData))]
        public void Order_level_from_site_settings_is_returned_if_no_user_profile(SearchProfileId profileId)
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "Medical" },
                new DropdownElementModel<string>{ Selected = false, Id = "EduK12" }
            };

            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            var sut = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettingsMock.Object);

            var orderLevel = sut.GetOrderLevel(profileId);

            orderLevel.Should().NotBeNullOrWhiteSpace();
            orderLevel.Should().Be("Medical");
        }

        [Theory]
        [MemberData(nameof(ProfileOrderLevelsData))]
        public void Order_level_from_site_settings_is_returned_if_no_default_profile_order_level_data(SearchProfileModel searchProfileModel)
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "Medical" },
                new DropdownElementModel<string>{ Selected = false, Id = "EduK12" }
            };

            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);
            profileServiceMock.Setup(x => x.GetSearchProfile(It.IsAny<SearchProfileId>())).Returns(searchProfileModel);


            var sut = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettingsMock.Object);

            var orderLevel = sut.GetOrderLevel(new SearchProfileId("123","456"));

            orderLevel.Should().NotBeNullOrWhiteSpace();
            orderLevel.Should().Be("Medical");
        }

        [Fact]
        public void Order_level_from_profile_is_returned()
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "Medical" }
            };

            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            profileServiceMock.Setup(x => x.GetSearchProfile(It.IsAny<SearchProfileId>())).Returns(new SearchProfileModel { DefaultPricingOption = "EduK12" });

            var sut = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettingsMock.Object);

            var orderLevel = sut.GetOrderLevel(new SearchProfileId("123", "456"));

            orderLevel.Should().NotBeNullOrWhiteSpace();
            orderLevel.Should().Be("EduK12");
        }


        [Theory]
        [MemberData(nameof(ProfileUserData))]
        public void Translated_options_are_returned_with_correct_selected_value_from_site_settings_for_non_existing_user_profile(SearchProfileId searchProfileId)
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "EduHigher" }
            };
            
            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            translationServiceMock.SetupSequence(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns("Commercial (Non - Govt)").Returns("Education (K 12)");

            var sut = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettingsMock.Object);

            var orderLevelOptions = sut.GetOrderLevelOptions(profileId: searchProfileId, selectedLevelId: null);

            orderLevelOptions.Should().NotBeEmpty().And.HaveCount(2);
            orderLevelOptions.ElementAt(0).Name.Should().Be("Commercial (Non - Govt)");
            
            orderLevelOptions.ElementAt(1).Name.Should().Be("Education (K 12)");
            orderLevelOptions.ElementAt(1).Selected.Should().Be(true);
        }

        [Fact]
        public void Translated_options_are_returned_with_correct_selected_value_from_selected_level()
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "EduHigher" }
            };

            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            translationServiceMock.SetupSequence(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns("Commercial (Non - Govt)").Returns("Education (K 12)");

            var sut = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettingsMock.Object);

            var orderLevelOptions = sut.GetOrderLevelOptions(profileId: null, selectedLevelId: "Commercial");

            orderLevelOptions.Should().NotBeEmpty().And.HaveCount(2);
            orderLevelOptions.ElementAt(0).Name.Should().Be("Commercial (Non - Govt)");
            orderLevelOptions.ElementAt(0).Selected.Should().Be(true);

            orderLevelOptions.ElementAt(1).Name.Should().Be("Education (K 12)");
            orderLevelOptions.ElementAt(1).Selected.Should().Be(false);
        }


        [Theory]
        [MemberData(nameof(ProfileOrderLevelsData))]
        public void Translated_options_are_returned_with_correct_selected_value_from_site_settings_for_non_existing_order_level_from_profile(SearchProfileModel searchProfileModel)
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "EduHigher" }
            };

            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            translationServiceMock.SetupSequence(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns("Commercial (Non - Govt)").Returns("Education (K 12)");

            profileServiceMock.Setup(x => x.GetSearchProfile(It.IsAny<SearchProfileId>())).Returns(searchProfileModel);

            var sut = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettingsMock.Object);

            var orderLevelOptions = sut.GetOrderLevelOptions(new SearchProfileId("123","456"), selectedLevelId: null);

            orderLevelOptions.Should().NotBeEmpty().And.HaveCount(2);
            orderLevelOptions.ElementAt(0).Name.Should().Be("Commercial (Non - Govt)");
            orderLevelOptions.ElementAt(0).Selected.Should().Be(false);

            orderLevelOptions.ElementAt(1).Name.Should().Be("Education (K 12)");
            orderLevelOptions.ElementAt(1).Selected.Should().Be(true);
        }

        [Fact]
        public void Translated_options_are_returned_with_correct_selected_value_from_profile()
        {
            var translationServiceMock = new Mock<ITranslationService>();
            var profileServiceMock = new Mock<IProfileService>();
            var siteSettingsMock = new Mock<ISiteSettings>();

            var orderLevelsSettings = new List<DropdownElementModel<string>>
            {
                new DropdownElementModel<string>{ Selected = false, Id = "Commercial"},
                new DropdownElementModel<string>{ Selected = true, Id = "EduHigher" }
            };

            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<string>>>(OrderLevelsService.OrderLevelsName)).Returns(orderLevelsSettings);

            translationServiceMock.SetupSequence(x => x.Translate(It.IsAny<Dictionary<string, string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns("Commercial (Non - Govt)").Returns("Education (K 12)");

            profileServiceMock.Setup(x => x.GetSearchProfile(It.IsAny<SearchProfileId>())).Returns(new SearchProfileModel { DefaultPricingOption = "Commercial" });

            var sut = new OrderLevelsService(translationServiceMock.Object, profileServiceMock.Object, siteSettingsMock.Object);

            var orderLevelOptions = sut.GetOrderLevelOptions(new SearchProfileId("123", "456"), selectedLevelId: null);

            orderLevelOptions.Should().NotBeEmpty().And.HaveCount(2);
            orderLevelOptions.ElementAt(0).Name.Should().Be("Commercial (Non - Govt)");
            orderLevelOptions.ElementAt(0).Selected.Should().Be(true);

            orderLevelOptions.ElementAt(1).Name.Should().Be("Education (K 12)");
            orderLevelOptions.ElementAt(1).Selected.Should().Be(false);
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

        public static IEnumerable<object[]> ProfileUserData()
        {
            return new List<object[]>
            {
                new object[]
                {
                    null
                },
                new object[]
                {
                    new SearchProfileId(null,null)
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
                    new SearchProfileModel { DefaultPricingOption = null }
                },
                new object[]
                {
                    new SearchProfileModel { DefaultPricingOption = String.Empty }
                },
                new object[]
                {
                    new SearchProfileModel { DefaultPricingOption = "    " }
                }
            };
        }
    }
}
