//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Models;
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
                PricingCondition = "EduStudentStaff"
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
            GetQuotePreviewDetails.Request request = new GetQuotePreviewDetails.Request("CON-SNT-CTSIX520", true, "cisco");


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

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var requestToQuote = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .Where(x => x.Name == "MapEndUserAndResellerForQuotePreview" && x.IsPrivate)
                .First();
            //Act
            requestToQuote.Invoke(objType, new object[] { configurationFindResponse, quotePreview });
            Assert.NotNull(configurationFindResponse);
            Assert.NotNull(quotePreview);

        }

        [Fact]
        public void MapQuoteLinesForCreatingQuote()
        {

            //arrange
            var createQuoteModel = new CreateQuoteModel
            {
                SalesOrg = "0100",
                Creator = "516514",
                Reseller = new Models.Quote.Quote.Internal.ResellerModel { Id = "123123", Name = "Nilesh Madhavi" },
                EndUser = null,
                VendorReference = null,
                Items = null
            };

            QuotePreviewModel quotePreview = new QuotePreviewModel { 
            QuoteDetails = new QuotePreview { Items = null},
            };

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var requestToQuote = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .Where(x => x.Name == "MapQuoteLinesForCreatingQuote" && x.IsPrivate)
                .First();
            //Act
            requestToQuote.Invoke(objType, new object[] { createQuoteModel, quotePreview });
            Assert.NotNull(createQuoteModel);
            Assert.NotNull(quotePreview);

        }

        [Fact]
        public void GetLinesforRequest()
        {
            //arrange
            var testLine = new Line
            {
                TDNumber = "1231234444",
                MFRNumber = "CISCO_35345",
                Manufacturer = "CISCO",
                ShortDescription = "TEST PRODUCT",
                Quantity = 1,
                UnitPrice = (decimal?)12.08
            };

            QuotePreviewModel quotePreview = new QuotePreviewModel
            {
                QuoteDetails = new QuotePreview { Items = null },
            };

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var requestItemModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .Where(x => x.Name == "GetLinesforRequest" && x.IsPrivate)
                .First();
            //Act
            var result = requestItemModel.Invoke(objType, new object[] { testLine });
            Assert.NotNull(testLine);
            Assert.NotNull(result);

        }

        private void InitiateCommerceService(out Type type, out object objType)
        {
            type = typeof(CommerceService);
            objType = Activator.CreateInstance(type,
                _middleTierHttpClient.Object,
                _logger.Object,
                _appSettings.Object,
                _cartService.Object,
                _uiContext.Object,
                _mapper.Object,
                _helperService.Object
                );
        }

    }
}
