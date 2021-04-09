using DigitalFoundation.Common.Client;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.Tests.Helpers
{
    public static class MockExtensions
    {
        public static void SetupResponse<T>(this Mock<IMiddleTierHttpClient> client, T response, string url = null) where T : class
        {
            client.Invocations.Clear();
            client.Setup(GetAsync<T>(url)).ReturnsAsync(response);
        }

        public static void VerifyResponse<T>(this Mock<IMiddleTierHttpClient> client, T response, Times times, string url = null) where T : class
        {
            response.Should().NotBeNull();
            client.Verify(GetAsync<T>(url), times);
        }

        private static Expression<Func<IMiddleTierHttpClient, Task<T>>> GetAsync<T>(string url) where T : class
        {
            return x => x.GetAsync<T>(
                             It.Is<string>(c => c == url || url == null),
                             It.IsAny<IEnumerable<object>>(),
                             It.IsAny<IDictionary<string, object>>());
        }
    }
}