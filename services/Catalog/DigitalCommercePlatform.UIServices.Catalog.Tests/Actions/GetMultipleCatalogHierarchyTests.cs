using AutoFixture.Xunit2;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIService.Catalog.Actions.GetMultipleCatalogHierarchy;

namespace DigitalCommercePlatform.UIServices.Catalog.Tests.Actions
{
    public class GetMultipleCatalogHierarchyTests
    {
        [Theory]
        [AutoDomainData]
        public async Task Handler_ProperSetup_CallsAPI(
            [Frozen] Mock<IMiddleTierHttpClient> client,
            Request request,
            Handler handler)
        {
            //arrange
            var call = client.GetCall(c => c.GetAsync<Response>(It.IsAny<string>(), null, null));
            client.Setup(call).ReturnsAsync(new Response());
            //act
            var result = await handler.Handle(request, new System.Threading.CancellationToken());
            //assert
            result.Should().NotBeNull();
            client.Verify(call, Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void Handler_BrokenCall_LogsError(
           [Frozen] Mock<IMiddleTierHttpClient> client,
           [Frozen(Matching.ImplementedInterfaces)] FakeLogger<Handler> logger,
           Request request,
           Handler handler)
        {
            //arrange
            const string exceptionMessage = "exception message:test";
            var call = client.GetCall(c => c.GetAsync<Response>(It.IsAny<string>(), null, null));
            client.Setup(call).ThrowsAsync(new InvalidOperationException(exceptionMessage));
            //act
            Func<Task> act = () => handler.Handle(request, new System.Threading.CancellationToken());
            //assert
            act.Should().Throw<InvalidOperationException>();
            logger.GetMessages(LogLevel.Error).Should().HaveCount(1);
        }

        [Fact]
        public void Validator_MissingId_HasError()
        {
            var request = new Request() { Id = null };
            var result = new Validator().TestValidate(request);
            result.ShouldHaveValidationErrorFor(d => d.Id);
        }

        [Fact]
        public void Validator_EmptyId_HasError()
        {
            var request = new Request() { Id = Enumerable.Empty<string>() };
            var result = new Validator().TestValidate(request);
            result.ShouldHaveValidationErrorFor(d => d.Id);
        }

        [Fact]
        public void Validator_OneId_HasNotError()
        {
            var request = new Request() { Id = new[] { "id" } };
            var result = new Validator().TestValidate(request);
            result.ShouldNotHaveAnyValidationErrors();
        }
    }
}