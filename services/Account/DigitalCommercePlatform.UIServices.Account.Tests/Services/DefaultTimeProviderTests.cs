using DigitalCommercePlatform.UIServices.Account.Services;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Services
{
    public class DefaultTimeProviderTests
    {
        [Fact(DisplayName = "Default time provider returns today date time value")]
        public void DefaultTimeProviderReturnsTodayDateTimeValue()
        {
            var sut = new DefaultTimeProvider();

            var result = sut.Today;

            Assert.Equal(DateTime.Today, result);
        }
    }
}
