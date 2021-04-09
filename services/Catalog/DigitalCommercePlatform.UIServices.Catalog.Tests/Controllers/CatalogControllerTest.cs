using AutoFixture.Xunit2;
using DigitalCommercePlatform.UIService.Catalog.Controllers;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Reflection;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Catalog.Tests.Controllers
{
    public class CatalogControllerTest
    {
        [Fact]
        public void CatalogController_HasAuthorizeAttribute()
        {
            //Arrange
            var controllerInfo = typeof(CatalogController).GetTypeInfo();

            //Act
            var authorizeAttribute = controllerInfo.GetCustomAttribute<AuthorizeAttribute>();
            var anonymousAttribute = controllerInfo.GetCustomAttribute<AllowAnonymousAttribute>();

            //Assert
            authorizeAttribute.Should().NotBeNull();
            authorizeAttribute.AuthenticationSchemes.Should().Be("SessionIdHeaderScheme");
            anonymousAttribute.Should().BeNull();
        }

        [Fact]
        public void AllMethodsAuthCheck()
        {
            //Arrange
            var methods = typeof(CatalogController).GetTypeInfo().GetMethods();

            foreach (var m in methods)
            {
                //Act
                var anonymousAttribute = m.GetCustomAttribute<AllowAnonymousAttribute>();
                //Assert
                anonymousAttribute.Should().BeNull();
            }
        }
    }
}