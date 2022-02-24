//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Services
{
    public class ConfigServiceTests
    {
        private static readonly Random getrandom = new Random();
        private readonly IConfigService _configService;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<ILogger<ConfigService>> _logger;
        private readonly Mock<IHttpClientFactory> _httpClientFactory;
        private readonly Mock<IHelperService> _helperService;
        public ConfigServiceTests()
        {
            _appSettings = new Mock<IAppSettings>();
            _appSettings.Setup(s => s.GetSetting("App.Configuration.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-configuration/v1");
            _appSettings.Setup(s => s.GetSetting("App.Spa.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-spa/v1");
            _mapper = new Mock<IMapper>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _logger = new Mock<ILogger<ConfigService>>();
            _httpClientFactory = new Mock<IHttpClientFactory>();
            _helperService = new Mock<IHelperService>();

            _configService = new ConfigService(_appSettings.Object,
                                               _mapper.Object,
                                               _middleTierHttpClient.Object,
                                               _logger.Object,
                                               _httpClientFactory.Object,
                                               _helperService.Object);
        }

        private void InitiateConfigService(out Type type, out object objType)
        {

            type = typeof(ConfigService);

            objType = Activator.CreateInstance(type,
               _appSettings.Object,
               _mapper.Object,
               _middleTierHttpClient.Object,
               _logger.Object,
               _httpClientFactory.Object,
               _helperService.Object);
        }

        [Fact]
        public void ConfigGrid_Test()
        {
            //arrange
            List<Configuration> mappingResult = new List<Configuration>(3);


            mappingResult.Add(new Configuration
            {
                ConfigId = "DD132151240CM",
                ConfigName = "Estimate_DD132151240CM",
                Expires = "n/a",
                Vendor = "CISCO",
                Quotes = null

            });
            mappingResult.Add(new Configuration
            {
                ConfigId = "WU132160739FD",
                ConfigName = "Estimate_DD132151240CM",
                Expires = "n/a",
                Vendor = "CISCO",
                Quotes = null

            });
            mappingResult.Add(new Configuration
            {
                ConfigId = "LS132157989YY",
                ConfigName = "Estimate_DD132151240CM",
                Expires = "n/a",
                Vendor = "CISCO",
                Quotes = null

            });


            Type type;
            object objType;
            InitiateConfigService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapQuotesAsync" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { mappingResult });
            Assert.NotNull(mappingResult);

        }

        [Fact]
        public void BuildQuotesForConfiguration_Test()
        {
            //arrange
            
            var configuration = new Configuration
            {
                ConfigId = "DD132151240CM",
                ConfigName = "Estimate_DD132151240CM",
                Expires = "n/a",
                Vendor = "CISCO",
                Quotes = null

            };

            var lstquotes = new List<QuoteModel>();
            var quote = new QuoteModel
            {
                Source = new SourceModel
                {
                    ID = "1234567",
                    SalesOrg = "0100",
                    TargetSystem = "R3",
                    System = "Q",
                    Key = "R3"
                },
                Created = DateTime.Now,
                Price = 1000.00m,
                Status = "OPEN"
            };
            lstquotes.Add(quote);

            var quoteResponse = new Quote
            {
                Data = lstquotes
            };


            Type type;
            object objType;
            InitiateConfigService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildQuotesForConfiguration" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { configuration, quoteResponse });
            Assert.NotNull(configuration.Quotes);

        }

        [Fact]
        public void Configuration_Test()
        {
            //arrange

           
            Config.Models.Configurations.Internal.FindModel findModel = new Config.Models.Configurations.Internal.FindModel();
            string configurationFindUrl = "https";


            Type type;
            object objType;
            InitiateConfigService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "Configuration" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { findModel, configurationFindUrl });
            Assert.NotNull(result);

        }
    }
}
