//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Content.Actions.ReplaceCartQuotes;
using DigitalCommercePlatform.UIServices.Content.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Content.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Linq;
using System.Net.Http;
using Xunit;


namespace DigitalCommercePlatform.UIServices.Content.Tests.Services
{
    public class ContentServiceTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<ILogger<ContentService>> _logger;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly Mock<IHttpClientFactory> _httpClientFactory;
        public ContentServiceTests()
        {
            _context = new Mock<IUIContext>();
            _logger = new Mock<ILogger<ContentService>>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettings = new Mock<IAppSettings>();
            _httpClientFactory = new Mock<IHttpClientFactory>();
        }

        private ContentService GetContentService()
        {
            return new ContentService(_middleTierHttpClient.Object,_logger.Object, _appSettings.Object, _context.Object);
                
        }

        private void InitiateContentService(out Type type, out object objType)
        {
            type = typeof(ContentService);
            objType = Activator.CreateInstance(type,
                _middleTierHttpClient.Object,
                _logger.Object,
                _appSettings.Object,
                _context.Object
                );
        }



        [Fact]
        public void GetActiveCartDetails_Test()
        {

            //Act
            var result = GetContentService().GetActiveCartDetails();
            Assert.NotNull(result);
        }
        [Fact]
        public void GetSavedCartDetails_Test()
        {
            //arrange 
            GetSavedCartDetails.Request request = new("123", true);

            //Act
            var result = GetContentService().GetSavedCartDetails(request);
            Assert.NotNull(result);
        }

        [Fact]
        public void CreateCartByQuote_Test()
        {
            //arrange 
            string QuoteId = "123";


            //Act
            var result = GetContentService().CreateCartByQuote(QuoteId);
            Assert.NotNull(result);
        }

        [Fact]
        public void ReplaceCart_Test()
        {
            //arrange 
            ReplaceCart.Request request = new("123", "quote");
            
             //Act
             var result = GetContentService().ReplaceCart(request);
            Assert.NotNull(result);
        }

        [Fact]
        public void ReplaceCartException_Test()
        {
            //arrange
            RemoteServerHttpException exception = new RemoteServerHttpException();

            Type type;
            object objType;
            InitiateContentService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "RenderErrorMessage" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { exception });
            Assert.NotNull(result);

        }
    }
}
