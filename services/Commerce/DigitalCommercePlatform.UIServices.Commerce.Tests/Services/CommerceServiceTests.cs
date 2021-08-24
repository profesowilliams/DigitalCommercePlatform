//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalCommercePlatform.UIServices.Common.Cart.Contracts;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{

    public class CommerceServiceTest
    {
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<ILogger<CommerceService>> _logger;
        private readonly Mock<IHelperService> _helperService;
        private readonly Mock<ICartService> _cartService;
        private readonly Mock<IUIContext> _uiContext;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IAppSettings> _appSettings;
        public CommerceServiceTest()
        {
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _logger = new Mock<ILogger<CommerceService>>();
            _appSettings = new Mock<IAppSettings>();
            _cartService = new Mock<ICartService>();
            _uiContext = new Mock<IUIContext>();
            _helperService = new Mock<IHelperService>();
            _mapper = new Mock<IMapper>();
        }


        [Fact]
        public void TestPrivateCreateQuoteRequest()
        {

            // Arrange
            CreateModelFrom request = new CreateModelFrom
            {
                TargetSystem = "R13",
                CreateFromId = "96722368",
                CreateFromType = Models.Enums.QuoteCreationSourceType.SavedCart,
                PricingCondition = "2"
            };

            
            Type type = typeof(CommerceService);
            var objType = Activator.CreateInstance(type,
                _middleTierHttpClient.Object,
                _logger.Object,
                _appSettings.Object,
                _cartService.Object,
                _uiContext.Object,
                _mapper.Object,
                 _helperService.Object
                );

            var requestToQuote = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .Where(x => x.Name == "CreateQuoteRequest" && x.IsPrivate)
                .First();
            //Act
            requestToQuote.Invoke(objType, new object[] { request });
            Assert.Equal("R3", request.TargetSystem);

        }


        [Fact]
        public void CreateResponseUsingEstimateId()
        {

            // Arrange
            GetQuotePreviewDetails.Request request = new GetQuotePreviewDetails.Request("CON-SNT-CTSIX520", true,"cisco");


            Type type = typeof(CommerceService);
            var objType = Activator.CreateInstance(type,
                _middleTierHttpClient.Object,
                _logger.Object,
                _appSettings.Object,
                _cartService.Object,
                _uiContext.Object,
                _mapper.Object,
                 _helperService.Object
                );

            var requestToQuote = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .Where(x => x.Name == "CreateResponseUsingEstimateId" && x.IsPrivate)
                .First();
            //Act
            requestToQuote.Invoke(objType, new object[] { request });
            Assert.Equal("CON-SNT-CTSIX520", request.Id);

        }

        [Fact]
        public void MapEndUserAndReseller()
        {

            var detailedDto = new DetailedDto
            {
                Source = new SourceDto
                {
                    Id = "123",
                    System = "abc",
                    Type = "abc"
                },
                SalesOrg = "0100",
                Reseller = null,
                EndUser = null
            };
            var details = new List<DetailedDto>();
            // Arrange
            details.Add(detailedDto);
            FindResponse<List<DetailedDto>> configurationFindResponse = new FindResponse<List<DetailedDto>>();
            configurationFindResponse.Data = details;

            QuotePreview quotePreview = new QuotePreview();

           
            Type type = typeof(CommerceService);
            var objType = Activator.CreateInstance(type,
                _middleTierHttpClient.Object,
                _logger.Object,
                _appSettings.Object,
                _cartService.Object,
                _uiContext.Object,
                _mapper.Object,
                 _helperService.Object
                );

            var requestToQuote = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .Where(x => x.Name == "MapEndUserAndReseller" && x.IsPrivate)
                .First();
            //Act
            requestToQuote.Invoke(objType, new object[] { configurationFindResponse, quotePreview });
            Assert.NotNull(configurationFindResponse);
            Assert.NotNull(quotePreview);

        }
       

    }
}
