//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Providers.Settings;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class ItemsPerPageServiceTests
    {
        private ItemsPerPageService _sut;

        public ItemsPerPageServiceTests()
        {
            var siteSettingsMock = new Mock<ISiteSettings>();

            siteSettingsMock.Setup(x => x.GetSetting<List<DropdownElementModel<int>>>("Search.UI.ItemsPerPageOptions"))
                .Returns(new List<DropdownElementModel<int>>
                {
                     new DropdownElementModel<int>{Id=25, Selected=true, Name="25"},
                     new DropdownElementModel<int>{Id=50, Selected=false, Name="50"},
                     new DropdownElementModel<int>{Id=100, Selected=false, Name="100"}
                });

            _sut = new ItemsPerPageService(siteSettingsMock.Object);
        }

        [Fact]
        public void GetDefualtItemsPerPage()
        {
            //arrange

            //act
            var actual = _sut.GetDefaultItemsPerPage();

            //assert
            actual.Should().Be(25);
        }

        [Fact]
        public void GetDefualtItemsPerPageOptions()
        {
            //arrange

            //act
            var actual = _sut.GetDefaultItemsPerPageOptions();

            //assert
            actual.Should().BeEquivalentTo(new List<DropdownElementModel<int>>
                {
                     new DropdownElementModel<int>{Id=25, Selected=true, Name="25"},
                     new DropdownElementModel<int>{Id=50, Selected=false, Name="50"},
                     new DropdownElementModel<int>{Id=100, Selected=false, Name="100"}
                });
        }

        [Fact]
        public void GetItemsPerPageOptionsBasedOnRequest()
        {
            //arrange

            //act
            var actual = _sut.GetItemsPerPageOptionsBasedOnRequest(100);

            //assert
            actual.Should().BeEquivalentTo(new List<DropdownElementModel<int>>
                {
                     new DropdownElementModel<int>{Id=25, Selected=false, Name="25"},
                     new DropdownElementModel<int>{Id=50, Selected=false, Name="50"},
                     new DropdownElementModel<int>{Id=100, Selected=true, Name="100"}
                });
        }
    }
}