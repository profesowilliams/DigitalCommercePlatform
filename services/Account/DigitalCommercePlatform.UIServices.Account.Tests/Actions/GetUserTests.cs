using AutoFixture.Xunit2;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Account.Actions.GetUser.GetUser;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Actions
{
    //public class GetUserTests
    //{
    //    [Theory]
    //    [AutoDomainData]
    //    public async Task GetUserQueryHandler_Handle_AuthenticateUser(
    //        [Frozen]Mock<IAccountService> accountService,
    //        GetUserQueryHandler handler,
    //        Request request)
    //    {
    //        var call = accountService.GetCall(c => c.GetUserAsync(It.IsAny<Request>()));
    //        var result = await handler.Handle(request, new CancellationToken());

    //        accountService.Verify(call, Times.Once);
    //        result.Should().NotBeNull();
    //    }
    //}
}