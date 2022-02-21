//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Services
{
    public class HelperServiceTests
    {
        private readonly IHelperService _helperService;

        public HelperServiceTests()
        {
            _helperService = new HelperService();
        }

        /// <summary>
        /// Used for accessing Private methods
        /// </summary>
        /// <param name="type"></param>
        /// <param name="objType"></param>
        private void InitiateHelperService(out Type type, out object objType)
        {
            type = typeof(HelperService);

            objType = Activator.CreateInstance(type);
        }

        [Fact]
        public void HelperService_TestFromDate()
        {
            //InitiateHelperService(out Type type,out object objType);
            var dateValue = new DateTime(2022, 1, 2);
            var compareDate = new DateTime(2022, 1, 2, 0, 0, 0);
            var dateOutput = (DateTime)_helperService.GetDateParameter(dateValue, "from");
            
            Assert.Equal(compareDate, dateOutput);            
        }

        [Fact]
        public void HelperService_TestToDate()
        {
            //InitiateHelperService(out Type type,out object objType);
            var dateValue = new DateTime(2022, 1, 7);
            var compareDate = new DateTime(2022, 1, 7, 23, 59, 59);
            var dateOutput = (DateTime)_helperService.GetDateParameter(dateValue, "to");

            Assert.Equal(compareDate, dateOutput);
        }

    }
}
