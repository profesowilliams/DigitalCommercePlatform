using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Moq.Protected;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Tests.AppServices
{
    public class GetTokenQueryHandlerTests
    {
        private readonly Mock<IHttpClientFactory> _clientFactoryMock;
        private readonly Mock<IDistributedCache> _cacheMock;
        //private readonly Mock<IUserService> _userServiceMock;

        public GetTokenQueryHandlerTests()
        {
            _clientFactoryMock = new Mock<IHttpClientFactory>();
            _cacheMock = new Mock<IDistributedCache>();
           // _userServiceMock = new Mock<IUserService>();
        }

        //[Fact]
        //public void InvokeHandleConstructor_PassNullForCache_ExpectedException()
        //{
        //    Assert.Throws<ArgumentNullException>(() => new GetTokenQueryHandler(null, _clientFactoryMock.Object, _userServiceMock.Object));
        //}

        //[Fact]
        //public void InvokeHandleConstructor_PassNullForclientFactory_ExpectedException()
        //{
        //    Assert.Throws<ArgumentNullException>(() => new GetTokenQueryHandler(_cacheMock.Object, null, _userServiceMock.Object));
        //}

        //[Fact]
        //public async Task InvokeHandle_CorrectInput_ReturnSuccess()
        //{
        //    var data = GetLoginCommandData();

        //    SetupClientFactoryForToken();
        //    SetupClientFactoryForCoreSeciurity();
        //    SetupUserService();

        //    var getTokenQueryHandler = new GetTokenQueryHandler(_cacheMock.Object, _clientFactoryMock.Object, _userServiceMock.Object);

        //    var result = await getTokenQueryHandler.Handle(data, new CancellationToken()).ConfigureAwait(false);

        //    _clientFactoryMock.Verify(x => x.CreateClient(It.IsAny<string>()),
        //       Times.Exactly(2));

        //    result.Equals(new GetTokenResponse { access_token = "123" });
        //}

        //private void SetupUserService()
        //{
        //    _userServiceMock.Setup(x => x.GetUserAsync(It.IsAny<string>(), It.IsAny<string>()))
        //        .Returns(Task.FromResult(new CoreUserDto()
        //        {
        //            StatusCode = 200,
        //            User = new User()
        //            {
        //                Name = "testUser"
        //            }
        //        }));
        //}

        private void SetupClientFactoryForToken()
        {
            var response = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(@"{ ""access_token"": 123 }"),
            };

            var httpMessageHandlerMock = SetupHttpMessageHandler(response);

            var client = new HttpClient(httpMessageHandlerMock.Object);

            _clientFactoryMock.Setup(x => x.CreateClient(It.Is<string>(x => x == "GetTokenClient")))
                .Returns(client);
        }

        private void SetupClientFactoryForCoreSeciurity()
        {
            var response = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(@"{ ""StatusCode"": 1 }"),
            };

            var httpMessageHandlerMock = SetupHttpMessageHandler(response);

            var client = new HttpClient(httpMessageHandlerMock.Object);

            _clientFactoryMock.Setup(x => x.CreateClient(It.Is<string>(x => x == "CoreSecurityClient")))
            .Returns(client);
        }

        private Mock<HttpMessageHandler> SetupHttpMessageHandler(HttpResponseMessage response)
        {
            var httpMessageHandlerMock = new Mock<HttpMessageHandler>();

            httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .Returns(Task.FromResult(response));

            return httpMessageHandlerMock;
        }

        //private LoginCommand GetLoginCommandData()
        //{
        //    return new LoginCommand("TestCode", "http://SomeReturnUrl");
        //}
    }
}