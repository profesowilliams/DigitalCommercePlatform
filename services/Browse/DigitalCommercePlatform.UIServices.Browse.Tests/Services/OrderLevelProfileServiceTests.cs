//2022 (c) Tech Data Corporation - All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.Profile;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Services.Providers.Profile;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Services
{
    public class OrderLevelProfileServiceTests
    {
        private readonly Mock<IContext> _contextMock;
        private readonly Mock<IProfileProvider> _profileProviderMock;

        public OrderLevelProfileServiceTests()
        {
            _contextMock = new Mock<IContext>();
            _profileProviderMock = new Mock<IProfileProvider>();
        }

        [Fact]
        public void Not_possible_to_create_service_without_context_dependency()
        {
            void act()
            {
                _ = new OrderLevelProfileService(context:null,_profileProviderMock.Object);
            }

            _ = Assert.Throws<ArgumentNullException>(act);
        }

        [Fact]
        public void Not_possible_to_create_service_without_profile_dependency()
        {
            void act()
            {
                _ = new OrderLevelProfileService(_contextMock.Object, profileProvider:null);
            }

            _ = Assert.Throws<ArgumentNullException>(act);
        }

        [Fact]
        public void Not_possible_to_get_profile_without_profile_name()
        {
            var sut = new OrderLevelProfileService(_contextMock.Object, _profileProviderMock.Object);

            void act()
            {
                _ = sut.Get(profileName:null);
            }

            _ = Assert.Throws<ArgumentNullException>(act);
        }

        [Theory]
        [MemberData(nameof(UserContextData))]
        public void Return_null_if_no_user_data(User user)
        {
            _contextMock.SetupGet(x => x.User).Returns(user);
            var sut = new OrderLevelProfileService(_contextMock.Object,_profileProviderMock.Object);

            var result = sut.Get("name");

            _ = result.Should().BeNull();
        }

        [Fact]
        public void Order_level_is_returned()
        {
            _contextMock.SetupGet(x => x.User).Returns(new User { ID = "1", ActiveCustomer = new Customer { CustomerNumber = "123" } });
            _profileProviderMock.Setup(x => x.GetProfile<OrderLevelDto>(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(new OrderLevelDto { DefaultPricingOption = "Medical" });
            var sut = new OrderLevelProfileService(_contextMock.Object, _profileProviderMock.Object);

            var result = sut.Get("name");

            _ = result.DefaultPricingOption.Should().Be("Medical");
        }

        public static IEnumerable<object[]> UserContextData()
        {
            return new List<object[]>
            {
                new object[]
                {
                    null
                },
                new object[]
                {
                    new User { ActiveCustomer = null }
                },
                new object[]
                {
                    new User { ActiveCustomer = new Customer { CustomerNumber = null } }
                },
                new object[]
                {
                    new User { ActiveCustomer = new Customer { CustomerNumber = string.Empty } }
                },
                new object[]
                {
                    new User { ActiveCustomer = new Customer { CustomerNumber = "    " } }
                },
                new object[]
                {
                    new User { ID = null }
                },
                new object[]
                {
                    new User { ID = string.Empty }
                },
                new object[]
                {
                    new User { ID = "   " }
                }

            };
        }
    }
}
