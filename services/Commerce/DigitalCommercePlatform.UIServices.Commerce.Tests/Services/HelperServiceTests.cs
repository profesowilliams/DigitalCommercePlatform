//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Contexts;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Linq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class HelperServiceTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<ILogger<HelperService>> _logger;

        public HelperServiceTests()
        {
            _context = new Mock<IUIContext>();
            _logger = new Mock<ILogger<HelperService>>();
        }

        private HelperService GetHelperService()
        {
            return new HelperService(_logger.Object, _context.Object);
        }

        [Fact]
        public void GetOrderPricingConditions()
        {
            TypeModel orderType = new TypeModel();
            LevelModel orderLevel = new LevelModel();

            var result = GetHelperService().GetOrderPricingConditions("2", out orderType, out orderLevel);

            Assert.True(result);
            Assert.NotNull(orderType);
            Assert.NotNull(orderLevel);

        }

        [Fact]
        public void GetOrderPricingConditionsNull()
        {
            // Arrange
            TypeModel orderType = new TypeModel();
            LevelModel orderLevel = new LevelModel();
            // Act
            var result = GetHelperService().GetOrderPricingConditions(null, out orderType, out orderLevel);
            // Assert
            Assert.True(result);
            Assert.NotNull(orderType);
            Assert.NotNull(orderLevel);
        }

        [Fact]
        public void GetParameterName()
        {
            TypeModel orderType = new TypeModel();
            LevelModel orderLevel = new LevelModel();

            var result = GetHelperService().GetParameterName("id");
            Assert.NotNull(result);
        }

        [Fact]
        public void TestPrivateMethods()
        {
            Type type = typeof(HelperService);
            var objType = Activator.CreateInstance(type, _logger.Object, _context.Object);

            var getOrderPricingConditionMappings = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .Where(x => x.Name == "GetOrderPricingConditionMappings" && x.IsPrivate)
                .First();
            //Act
            var getOrderPricingMappings = (OrderPricingCondtionMapping)getOrderPricingConditionMappings.Invoke(objType, new object[] { "EduStudentStaff" });
            Assert.NotNull(getOrderPricingMappings);

        }

        [Fact]
        public void TestOrderLevel()
        {
            var orderLevel = GetHelperService().GetOrderType("ZZED", "ZZED");
            Assert.NotNull(orderLevel);
        }
    }
}
