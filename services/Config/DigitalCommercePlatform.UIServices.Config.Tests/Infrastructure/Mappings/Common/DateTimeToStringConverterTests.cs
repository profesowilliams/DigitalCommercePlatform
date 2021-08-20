using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Common;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Common
{
    public class DateTimeToStringConverterTests
    {
        private readonly DateTimeToStringConverter _converter;

        public DateTimeToStringConverterTests()
        {
            _converter = new DateTimeToStringConverter();
        }

        internal class ConversionShouldReturnNaData : TheoryData<DateTime?>
        {
            public ConversionShouldReturnNaData()
            {
                Add(null);
                Add(new DateTime());
            }
        }

        [Theory]
        [ClassData(typeof(ConversionShouldReturnNaData))]
        public void ConversionShouldReturnNa(DateTime? dt)
        {
            var result = _converter.Convert(dt, string.Empty, null);
            result.Should().Be(DateTimeToStringConverter.DefaultDateTimeString);
        }
    }
}
