//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Order.Authorization;
using DigitalFoundation.Common.Features.Contexts.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.Tests.AuthorizationPolicy
{
    [ExcludeFromCodeCoverage]
    public class CanViewOrdersTests
    {
        [Fact]
        public async Task CanViewOrderPolicyHandler_Should_Succeed_When_User_Has_Both_Roles()
        {
            //Arrange    
            var requirements = new[] { new CanViewOrderRequirement() };
            var user = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim("Role", JsonConvert.SerializeObject(GetRole("CanViewOrders", "0038048612"))),
                        new Claim("Role", JsonConvert.SerializeObject(GetRole("CanViewInvoices", "0038048612"))),
                        new Claim("ActiveCustomer", JsonConvert.SerializeObject(GetActiveCustomer("0038048612")))
                    },
                    "Basic")
            );
            var context = new AuthorizationHandlerContext(requirements, user, null);
            var subject = new CanViewOrderPolicyHandler();

            //Act
            await subject.HandleAsync(context);

            //Assert
            context.HasSucceeded.Should().BeTrue(); 

        }

        [Theory]
        [InlineData("CanViewOrders")]
        [InlineData("CanViewInvoices")]
        public async Task CanViewOrderPolicyHandler_Should_Succeed_When_User_Has_CanViewOrder(string entitlementName)
        {
            //Arrange    
            var requirements = new[] { new CanViewOrderRequirement() };
            var user = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim("Role", JsonConvert.SerializeObject(GetRole(entitlementName, "0038048612"))),
                        new Claim("ActiveCustomer", JsonConvert.SerializeObject(GetActiveCustomer("0038048612")))
                    },
                    "Basic")
            );
            var context = new AuthorizationHandlerContext(requirements, user, null);
            var subject = new CanViewOrderPolicyHandler();

            //Act
            await subject.HandleAsync(context);

            //Assert
            context.HasSucceeded.Should().BeTrue(); //FluentAssertions

        }

        [Fact]
        public async Task CanViewOrderPolicyHandler_Should_Fail_When_No_ActiveCustomer()
        {
            //Arrange    
            var requirements = new[] { new CanViewOrderRequirement() };
            var user = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim("Role", JsonConvert.SerializeObject(GetRole("CanViewOrders", "0038048613"))),
                        new Claim("Role", JsonConvert.SerializeObject(GetRole("CanViewInvoices", "0038048613"))),
                    },
                    "Basic")
            );
            var context = new AuthorizationHandlerContext(requirements, user, null);
            var subject = new CanViewOrderPolicyHandler();

            //Act
            await subject.HandleAsync(context);

            //Assert
            context.HasSucceeded.Should().BeFalse(); //FluentAssertions

        }

        [Fact]
        public async Task CanViewOrderPolicyHandler_Should_Fail_When_No_Roles()
        {
            //Arrange    
            var requirements = new[] { new CanViewOrderRequirement() };
            var user = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim("ActiveCustomer", JsonConvert.SerializeObject(GetActiveCustomer("0038048612")))
                    },
                    "Basic")
            );
            var context = new AuthorizationHandlerContext(requirements, user, null);
            var subject = new CanViewOrderPolicyHandler();

            //Act
            await subject.HandleAsync(context);

            //Assert
            context.HasSucceeded.Should().BeFalse();

        }

        [Fact]
        public async Task CanViewOrderPolicyHandler_Should_Fail_When_No_Roles_For_ActiveAccount()
        {
            //Arrange    
            var requirements = new[] { new CanViewOrderRequirement() };
            var user = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim("Role", JsonConvert.SerializeObject(GetRole("CanViewOrders", "11111"))),
                        new Claim("Role", JsonConvert.SerializeObject(GetRole("CanViewInvoices", "11111"))),
                        new Claim("ActiveCustomer", JsonConvert.SerializeObject(GetActiveCustomer("0038048612")))
                    },
                    "Basic")
            );
            var context = new AuthorizationHandlerContext(requirements, user, null);
            var subject = new CanViewOrderPolicyHandler();

            //Act
            await subject.HandleAsync(context);

            //Assert
            context.HasSucceeded.Should().BeFalse();

        }

        private static Customer GetActiveCustomer(string customerId)
        {
            return new Customer()
            {
                CustomerName = "Test",
                CustomerNumber = customerId
            };
        }

        private static Role GetRole(string entitlementName, string accountId)
        {
            return new Role()
            {
                Entitlement = entitlementName,
                AccountId = accountId
            };
        }
    }

    
}
