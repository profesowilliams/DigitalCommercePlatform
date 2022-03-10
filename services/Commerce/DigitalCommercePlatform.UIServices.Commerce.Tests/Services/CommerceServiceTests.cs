//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetPricingCondition;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalCommercePlatform.UIServices.Common.Cart.Contracts;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using DigitalFoundation.Common.TestUtilities;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{

    public class CommerceServiceTest
    {
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<ILogger<CommerceService>> _logger;
        private readonly Mock<IHelperService> _helperService;
        private readonly ICommerceService _commerceService;
        private readonly Mock<ICartService> _cartService;
        private readonly Mock<IUIContext> _uiContext;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IAppSettings> _appSettings;
        public CommerceServiceTest()
        {
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _logger = new Mock<ILogger<CommerceService>>();
            _appSettings = new Mock<IAppSettings>();
            _appSettings.Setup(s => s.GetSetting("App.Configuration.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-configuration/v1");
            _appSettings.Setup(s => s.GetSetting("Product.App.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1");
            _appSettings.Setup(s => s.GetSetting("App.Quote.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-quote/v1");
            _cartService = new Mock<ICartService>();
            _uiContext = new Mock<IUIContext>();
            _helperService = new Mock<IHelperService>();
            _mapper = new Mock<IMapper>();
            _commerceService = new CommerceService(_middleTierHttpClient.Object, _logger.Object, _appSettings.Object, _cartService.Object, _uiContext.Object, _mapper.Object, _helperService.Object);
        }


        [Fact]
        public void TestPrivateCreateQuoteRequest()
        {

            // Arrange
            CreateModelFrom request = new()
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
                .First(x => x.Name == "CreateQuoteRequest" && x.IsPrivate);
            //Act
            requestToQuote.Invoke(objType, new object[] { request });
            Assert.Equal("R3", request.TargetSystem);

        }


        [Fact]
        public void CreateResponseUsingEstimateId()
        {

            // Arrange
            GetQuotePreviewDetails.Request request = new("CON-SNT-CTSIX520", true, "cisco", "Deal");


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
                .First(x => x.Name == "CreateResponseUsingEstimateId" && x.IsPrivate);
            //Act
            requestToQuote.Invoke(objType, new object[] { request });
            Assert.Equal("CON-SNT-CTSIX520", request.Id);

        }

        [Fact]
        public async void CreateResponseUsingEstimateId_DistiBuyMethod()
        {

            // Arrange
            GetQuotePreviewDetails.Request request = new("53761072", true, "cisco","Deal");


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
                .First(x => x.Name == "CreateResponseUsingEstimateId" && x.IsPrivate);
            //Act
            var result = requestToQuote.Invoke(objType, new object[] { request });
            Assert.NotNull(result);
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
            // Arrange
            var details = new List<DetailedDto> { detailedDto };

            FindResponse<IEnumerable<DetailedDto>> configurationFindResponse = new FindResponse<IEnumerable<DetailedDto>>();
            configurationFindResponse.Data = details;

            QuotePreview quotePreview = new QuotePreview();

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var requestToQuote = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapEndUserAndResellerForQuotePreview" && x.IsPrivate);
            //Act
            requestToQuote.Invoke(objType, new object[] { configurationFindResponse, quotePreview });
            Assert.NotNull(configurationFindResponse);
            Assert.NotNull(quotePreview);

        }

        [Fact]
        public void MapEndUserAndResellerFromConfig()
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
                Reseller = new ResellerDto
                {
                    Address = new AddressDto
                    {
                        Address1 = "123 ABC",
                        City = "My City",
                        State = "AZ",
                        PostalCode = "85284"
                    },
                    Name = "My Company",
                    Id = "3800000"
                },
                EndUser = null
            };
            // Arrange
            var details = new List<DetailedDto> { detailedDto };

            FindResponse<IEnumerable<DetailedDto>> configurationFindResponse = new FindResponse<IEnumerable<DetailedDto>>();
            configurationFindResponse.Data = details;

            var quotePreview = new QuotePreview();

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var requestToQuote = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapEndUserAndResellerForQuotePreview" && x.IsPrivate);
            //Act
            requestToQuote.Invoke(objType, new object[] { configurationFindResponse, quotePreview });
            Assert.NotNull(quotePreview.Reseller);
            Assert.NotEmpty(quotePreview.Reseller);
            Assert.Equal("My Company", quotePreview.Reseller[0].CompanyName);
            Assert.Equal("123 ABC", quotePreview.Reseller[0].Line1);
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

            QuotePreviewModel quotePreview = new()
            {
                QuoteDetails = new QuotePreview { Items = null },
            };

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var requestToQuote = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapQuoteLinesForCreatingQuote" && x.IsPrivate);

            //Act
            requestToQuote.Invoke(objType, new object[] { createQuoteModel, quotePreview });
            Assert.NotNull(createQuoteModel);
            Assert.NotNull(quotePreview);

        }

        [Fact]
        public void GetLinesforRequest()
        {
            //arrange

            var quotePreviewModel = GetQuotePreviewModel();

            Line testLine = new()
            {
                TDNumber = "1231234444",
                MFRNumber = "CISCO_35345",
                Manufacturer = "CISCO",
                ShortDescription = "TEST PRODUCT",
                Quantity = 1,
                UnitPrice = (decimal?)12.08
            };

            string id = "4735561697";
            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var requestItemModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetLinesforRequest" && x.IsPrivate);

            //Act
            var result = requestItemModel.Invoke(objType, new object[] { testLine, id, "Estimate", quotePreviewModel });

            //Assert
            Assert.NotNull(testLine);
            Assert.NotNull(result);

        }


        [Fact]
        public void GetLinesforRequest_Zero_Test()
        {
            //arrange

            var quotePreviewModel = GetQuotePreviewModel();

            Line testLine = new()
            {
                TDNumber = "1231234444",
                MFRNumber = "CISCO_35345",
                Manufacturer = "CISCO",
                ShortDescription = "TEST PRODUCT",
                Quantity = 1,
                UnitPrice = (decimal?)0.00,
                UnitListPrice = 100.00M
            };

            string id = "4735561697";
            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var requestItemModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetLinesforRequest" && x.IsPrivate);

            //Act
            var result = requestItemModel.Invoke(objType, new object[] { testLine, id, "Estimate", quotePreviewModel });

            //Assert
            Assert.NotNull(testLine);
            Assert.NotNull(result);

        }

        [Fact]
        public void GetLinesforRequest_Null_Test()
        {
            //arrange

            var quotePreviewModel = GetQuotePreviewModel();

            Line testLine = new()
            {
                TDNumber = "1231234444",
                MFRNumber = "CISCO_35345",
                Manufacturer = "CISCO",
                ShortDescription = "TEST PRODUCT",
                Quantity = 1,
                UnitPrice = (decimal?)12.08
            };


            string id = "4735561697";
            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var requestItemModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetLinesforRequest" && x.IsPrivate);

            //Act
            var result = requestItemModel.Invoke(objType, new object[] { testLine, id, "Estimate", quotePreviewModel });

            //Assert
            Assert.NotNull(testLine);
            Assert.NotNull(result);

        }

        [Fact]
        public void MapAddress_Test()
        {
            //arrange
            List<Address> lstAddress = new();
            Address address = new Address()
            {
                Id = "123",
                Line1 = "123",
                Line2 = "123",
                Line3 = "123",
                Email = "abc@gmail.com"
            };
            lstAddress.Add(address);

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapAddress" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { lstAddress, "" });
            Assert.NotNull(result);
        }

        [Fact]
        public void MapAddressWithCompanyName_Test()
        {
            //arrange
            List<Address> lstAddress = new();
            Address address = new Address()
            {
                Id = "123",
                Line1 = "123",
                Line2 = "123",
                Line3 = "123",
                Email = "abc@gmail.com"
            };
            lstAddress.Add(address);

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapAddress" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { lstAddress, "SHI LLC" });
            Assert.NotNull(result);
        }

        [Fact]
        public void GetAddress_Test()
        {
            //arrange
            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetAddress" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { "123", true });
            Assert.NotNull(result);

        }

        [Fact]
        public void CreateResponseUsingEstimateId_Test()
        {
            //arrange
            GetQuotePreviewDetails.Request request = new GetQuotePreviewDetails.Request("123", true, "Cisco", "Deal");

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "CreateResponseUsingEstimateId" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { request });
            Assert.NotNull(result);

        }

        [Fact]
        public void CreateQuoteRequestFromQuotePreview_Test()
        {
            //arrange
            QuotePreviewModel request = new QuotePreviewModel();

            request.QuoteDetails = new QuotePreview() { Id = "123", Currency = "USD", ConfigurationId = "123", BuyMethod = "Test", };
            request.QuoteDetails.Source = new VendorReferenceModel() { Type = "123", Value = "123" };

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var CreateQuotePreview = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "CreateQuoteRequestFromQuotePreview" && x.IsPrivate);

            //Act
            var result = CreateQuotePreview.Invoke(objType, new object[] { request });

            //Assert
            Assert.NotNull(result);

        }


        [Fact]
        public void MapAnnuity_Test()
        {
            //arrange
            QuoteModel input = new();
            List<ItemModel> items = new List<ItemModel>();
            ItemModel item = new ItemModel();

            List<AttributeDto> attributes = new List<AttributeDto>();

            AttributeDto materialAttribute = new AttributeDto();
            materialAttribute.Name = "materialtype";
            materialAttribute.Value = "service";
            attributes.Add(materialAttribute);

            AttributeDto endDate = new AttributeDto();
            endDate.Name = "requestedenddate";
            endDate.Value = "6-13-2022";
            attributes.Add(endDate);

            AttributeDto startDate = new AttributeDto();
            startDate.Name = "requestedstartdate";
            startDate.Value = "6-13-2021";
            attributes.Add(startDate);

            AttributeDto billingTermAttribute = new AttributeDto();
            billingTermAttribute.Name = "billingterm";
            billingTermAttribute.Value = "Monthly";
            attributes.Add(billingTermAttribute);

            AttributeDto autoRenewalTermAttribute = new AttributeDto();
            autoRenewalTermAttribute.Name = "initialterm";
            autoRenewalTermAttribute.Value = "36";
            attributes.Add(autoRenewalTermAttribute);

            AttributeDto dealDurationAttribute = new AttributeDto();
            dealDurationAttribute.Name = "autorenewalterm";
            dealDurationAttribute.Value = "1";
            attributes.Add(dealDurationAttribute);

            item.Attributes = attributes;
            items.Add(item);

            input.Items = items;

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapAnnuity" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { input });
            Assert.NotNull(result);
        }

        [Fact]
        public void BuildAnnuity_Test()
        {
            //arrange

            ItemModel input = new ItemModel();

            List<AttributeDto> attributes = new List<AttributeDto>();

            AttributeDto materialAttribute = new AttributeDto();
            materialAttribute.Name = "materialtype";
            materialAttribute.Value = "service";
            attributes.Add(materialAttribute);

            AttributeDto endDate = new AttributeDto();
            endDate.Name = "requestedenddate";
            endDate.Value = "6-13-2022";
            attributes.Add(endDate);

            AttributeDto startDate = new AttributeDto();
            startDate.Name = "requestedstartdate";
            startDate.Value = "6-13-2021";
            attributes.Add(startDate);

            AttributeDto billingTermAttribute = new AttributeDto();
            billingTermAttribute.Name = "billingterm";
            billingTermAttribute.Value = "Monthly";
            attributes.Add(billingTermAttribute);

            AttributeDto autoRenewalTermAttribute = new AttributeDto();
            autoRenewalTermAttribute.Name = "initialterm";
            autoRenewalTermAttribute.Value = "36";
            attributes.Add(autoRenewalTermAttribute);

            AttributeDto dealDurationAttribute = new AttributeDto();
            dealDurationAttribute.Name = "autorenewalterm";
            dealDurationAttribute.Value = "1";
            attributes.Add(dealDurationAttribute);

            input.Attributes = attributes;

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildAnnuity" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { input });
            Assert.Null(result);
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

        // Public methods Unit test cases
        [Theory]
        [AutoDomainData]
        public async Task GetQuote(GetQuote.Request request)
        {


            // Act
            var result = await _commerceService.GetQuote(request);
            // Assert
            Assert.Null(result);
        }



        [Theory]
        [AutoDomainData]
        public async Task FindQuotes(FindModel request)
        {
            // Act
            var result = await _commerceService.FindQuotes(request);
            // Assert
            Assert.Null(result);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetPricingConditions(GetPricingConditions.Request request)
        {
            // Act
            var result = await _commerceService.GetPricingConditions(request);
            // Assert
            Assert.NotNull(result);
        }

        [Theory]
        [AutoDomainData]
        public async Task CreateQuoteFrom(CreateQuote.Request request)
        {
            List<Line> lstline = new List<Line>();

            Line line = new Line()
            {
                Id = "54390",
                ConfigID = "3478",
                UnitPrice = 1,
                VendorPartNo = "Chg-YUt"

            };
            lstline.Add(line);
            VendorReferenceModel Type = new VendorReferenceModel()
            {
                Type = "Estimate",
                Value = "010101"
            };
            QuotePreview quotePreview = new QuotePreview()
            {
                BuyMethod = "tdavnet67",
                Currency = "USD",
                Id = "875439076",
                Items = lstline,
                Source = Type
            };
            QuotePreviewModel quotePreviewModel = new QuotePreviewModel()
            {
                QuoteDetails = quotePreview
            };
            request = new CreateQuote.Request(quotePreviewModel);
            // Act
            var result = await _commerceService.CreateQuoteFrom(request);
            // Assert
            Assert.Null(result);
        }

        [Theory]
        [AutoDomainData]
        public async Task CreateQuoteFromExpired(CreateQuoteFrom.Request request)
        {
            // Act
            var result = await _commerceService.CreateQuoteFromExpired(request);
            // Assert
            Assert.NotNull(result);
        }

        [Theory]
        [AutoDomainData]
        public async Task UpdateQuote(UpdateQuote.Request request)
        {
            // Act
            var result = await _commerceService.UpdateQuote(request);
            // Assert
            Assert.NotNull(result);
        }

        [Theory]
        [AutoDomainData]
        public void CreateQuoteFromActiveCart(CreateQuoteFrom.Request request)
        {
            //arrange
            request.CreateModelFrom.CreateFromId = "";
            request.CreateModelFrom.CreateFromType = Models.Enums.QuoteCreationSourceType.ActiveCart;
            request.CreateModelFrom.TargetSystem = "R3";
            request.CreateModelFrom.PricingCondition = "Commercial";

            // Act
            Task<UIServiceException> ex = Assert.ThrowsAsync<UIServiceException>(() => _commerceService.CreateQuoteFromActiveCart(request));

            // Assert
            Assert.Equal("Invalid Active Cart", ex.Result.Message);
        }

        [Theory]
        [AutoDomainData]
        public void CreateQuoteFromSavedCart_Exception(CreateQuoteFrom.Request request)
        {
            //arrange
            request.CreateModelFrom.CreateFromId = "96725045";
            request.CreateModelFrom.CreateFromType = Models.Enums.QuoteCreationSourceType.SavedCart;
            request.CreateModelFrom.TargetSystem = "R3";
            request.CreateModelFrom.PricingCondition = "Commercial";

            // Act
            Task<UIServiceException> ex = Assert.ThrowsAsync<UIServiceException>(() => _commerceService.CreateQuoteFromSavedCart(request));

            // Assert
            Assert.Equal("Invalid savedCartId: 96725045", ex.Result.Message);

        }

        [Fact]
        public void BuildAnnuity_NullCheck()
        {
            //arrange

            ItemModel input = new ItemModel();

            List<AttributeDto> attributes = new List<AttributeDto>();

            AttributeDto materialAttribute = new AttributeDto();
            materialAttribute.Name = "materialtype";
            materialAttribute.Value = "service";
            attributes.Add(materialAttribute);

            AttributeDto endDate = new AttributeDto();
            endDate.Name = "requestedenddate";
            endDate.Value = "6-13-2022";
            attributes.Add(endDate);

            AttributeDto startDate = new AttributeDto();
            startDate.Name = "requestedstartdate";
            attributes.Add(startDate);

            AttributeDto billingTermAttribute = new AttributeDto();
            billingTermAttribute.Name = "billingterm";
            attributes.Add(billingTermAttribute);

            AttributeDto autoRenewalTermAttribute = new AttributeDto();
            autoRenewalTermAttribute.Name = "initialterm";
            attributes.Add(autoRenewalTermAttribute);

            AttributeDto dealDurationAttribute = new AttributeDto();
            dealDurationAttribute.Name = "autorenewalterm";
            attributes.Add(dealDurationAttribute);

            input.Attributes = attributes;

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildAnnuity" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { input });
            Assert.Null(result);
        }

        [Fact]
        public void BuildAttibute_Test()
        {
            //arrange

            string id = "TT132145197LJ";
            string attributeName = "ORIGINALESTIMATEID";

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildAttribute" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { id, attributeName });
            Assert.NotNull(result);
        }

        [Fact]
        public void BuildLineAttibutes_Test()
        {
            //arrange
            Line item = new Line
            {
                TDNumber = "1231234444",
                MFRNumber = "CISCO_35345",
                Manufacturer = "CISCO",
                ShortDescription = "TEST PRODUCT",
                Quantity = 1,
                UnitPrice = (decimal?)12.08
            };
            string id = "TT132145197LJ";

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildLineAttibutes" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { item, id });
            Assert.NotNull(result);
        }

        [Fact]
        public void GetAccountDetails()
        {
            //arrange 
            GetQuotePreviewDetails.Request request = new GetQuotePreviewDetails.Request("123", true, "Cisco", "Deal");

            //Act
            var result = _commerceService.QuotePreview(request);

            //Assert
            Assert.NotNull(result);
        }
        private Task<QuotePreviewModel> GetQuotePreviewModel()
        {
            QuotePreview quotePreview = new QuotePreview
            {
                BuyMethod = "tdavnet69",
                Currency = "USD",
                Id = "123",
                IsExclusive = true,
                CustomerBuyMethod = "AVT"
            };
            QuotePreviewModel quotePreviewModel = new QuotePreviewModel
            {
                QuoteDetails = quotePreview
            };
            return Task.FromResult(quotePreviewModel);
        }
        [Fact]
        public void MapQuotePrice_Test()
        {
            //arrange

            var quotePreviewModel = GetQuotePreviewModel();

            Line line = new Line
            {
                TDNumber = "1231234444",
                MFRNumber = "CISCO_35345",
                Manufacturer = "CISCO",
                ShortDescription = "TEST PRODUCT",
                Quantity = 1,
                UnitPrice = 123.98M,
                UnitListPrice = 100.00M
            };

            //Act

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapQuotePrice" && x.IsPrivate);

            imageProductModel.Invoke(objType, new object[] { quotePreviewModel, line });

            //Assert 
            Assert.NotNull(quotePreviewModel.Result);

        }

        [Theory]
        [AutoDomainData]
        public void CallCreateQuote_Exception()
        {
            //arrange
            CreateModelFrom request = new CreateModelFrom
            {
                TargetSystem = "R13",
                CreateFromId = "96722368",
                CreateFromType = Models.Enums.QuoteCreationSourceType.SavedCart,
                PricingCondition = "EduStudentStaff",
                Items = new List<ItemModel> {
                new ItemModel {
                    Quantity =1,
                    Product = new List<ProductModel> { new ProductModel { Type ="2", Id = "SNSC220-ENT-K9", Name = "SHOW & SHARE SVR ENTERPRISE HW", Manufacturer ="CISCO" }  },
                    },
                }
            };

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var response = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "CallCreateQuote" && x.IsPrivate);

            var result = response.Invoke(objType, new object[] { request });

            //Assert 
            Assert.NotNull(result);

        }



        [Fact]
        public void EndUserName_Test()
        {
            //arrange
            ContactModel contactModel = new ContactModel()
            {
                Name = "Sandy Shore",
                Email = "sandyshore@gmail.com",
                Phone = "000-000-0000"
            };
            IEnumerable<ContactModel> contact = new List<ContactModel>() { contactModel };
            EndUserModel endUserModel= new EndUserModel()
            {
                Name ="Tom",
                Contact= contact
            };
            QuoteModel quoteModel = new QuoteModel()
            {
                EndUser=endUserModel
            };

             //Act
             Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var response = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapEndUserName" && x.IsPrivate);

            var result = response.Invoke(objType, new object[] { quoteModel });

            //Assert 
            Assert.NotNull(quoteModel);
        }
    }
}
