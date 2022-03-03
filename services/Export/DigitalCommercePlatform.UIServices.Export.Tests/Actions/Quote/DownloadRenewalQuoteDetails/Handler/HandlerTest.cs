//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.Models.Renewal;
using DigitalCommercePlatform.UIServices.Export.Models.Renewal.Internal;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Export.Actions.Quote.DownloadRenewalQuoteDetails;
using DRQD = DigitalCommercePlatform.UIServices.Export.Actions.Quote.DownloadRenewalQuoteDetails;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Actions.Quote.DownloadRenewalQuoteDetails.Handler
{
    public class HandlerTest
    {
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILogger<DRQD.Handler>> _logger;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IRenewalService> _renewalService;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly Mock<IRenewalQuoteDetailsDocumentGenerator> _docGen;

        private readonly DRQD.Handler _handler;

        public HandlerTest()
        {
            _mapper = new();
            _logger = new();
            _middleTierHttpClient = new();
            _renewalService = new();
            _docGen = new();

            _appSettings = new();
            _appSettings.Setup(s => s.GetSetting("Product.App.Url"))
                .Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1");

            _handler = new DRQD.Handler(_renewalService.Object,
                                        _middleTierHttpClient.Object,
                                        _mapper.Object,
                                        _appSettings.Object,
                                        _logger.Object,
                                        _docGen.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleShouldReturnContentAndNoErrors(List<QuoteDetailedModel> appRenewalServiceMockedResult)
        {
            _renewalService.Setup(x => x.GetRenewalsQuoteDetailedFor(
                      It.IsAny<GetRenewalQuoteDetailedRequest>()
                      ))
                  .ReturnsAsync(appRenewalServiceMockedResult);
            _docGen.Setup(x => x.XlsGenerate(It.IsAny<IRenewalQuoteDetailsDocumentModel>()))
                .ReturnsAsync(new byte[10]);
            var request = new Request { Id = "any" };

            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().BeOfType<ResponseBase<Response>>();
            result.Content.Should().NotBeNull();
            result.Content.Should().BeOfType<Response>();
            result.Content.MimeType.Should().Be(mimeType);
            result.Content.BinaryContent.Should().NotBeNullOrEmpty();
        }

        internal class HandleShouldReturnEmptyContentAndNoErrorsData : TheoryData<List<QuoteDetailedModel>>
        {
            public HandleShouldReturnEmptyContentAndNoErrorsData()
            {
                Add(null);
                Add(new List<QuoteDetailedModel>());
            }
        }

        [Theory]
        [ClassData(typeof(HandleShouldReturnEmptyContentAndNoErrorsData))]
        public async Task HandleShouldReturnEmptyContentAndNoErrors(List<QuoteDetailedModel> appRenewalServiceMockedResult)
        {
            _renewalService.Setup(x => x.GetRenewalsQuoteDetailedFor(
                      It.IsAny<GetRenewalQuoteDetailedRequest>()
                      ))
                  .ReturnsAsync(appRenewalServiceMockedResult);
            _docGen.Setup(x => x.XlsGenerate(It.IsAny<IRenewalQuoteDetailsDocumentModel>()))
                .ReturnsAsync(new byte[10]);
            var request = new Request { Id = "any" };

            var result = await _handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().BeOfType<ResponseBase<Response>>();
            result.Content.Should().NotBeNull();
            result.Content.Should().BeOfType<Response>();
            result.Content.MimeType.Should().BeNullOrEmpty();
            result.Content.BinaryContent.Should().BeNullOrEmpty();
        }

        [Fact]
        public void BuildProductApiURL_Tests()
        {
            // Arrange
            List<ItemModel> items = new()
            {
                new ItemModel { 
                    Product = new () { new ProductModel() { Id = "10487448" }}
                },
            };

            // Act
            Type type;
            object objType;
            InitiateHandler(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildProductApiURL" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { items });

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void GetProduct_Tests()
        {
            // Arrange
            List<ItemModel> items = new()
            {
                new ItemModel
                {
                    Product = new() { new ProductModel() { Id = "10487448" } }
                },
            };

            // Act
            Type type;
            object objType;
            InitiateHandler(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetProduct" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { items });

            // Assert
            Assert.NotNull(items);
        }

        private void InitiateHandler(out Type type, out object objType)
        {
            type = typeof(DRQD.Handler);
            objType = Activator.CreateInstance(type,
                                               _renewalService.Object,
                                               _middleTierHttpClient.Object,
                                               _mapper.Object,
                                               _appSettings.Object,
                                               _logger.Object,
                                               _docGen.Object);
        }
    }
}
