//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Services;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class SubstringServiceTests
    {
        [Theory(DisplayName = "Return string before delimiter")]
        [InlineData("", ".", "")]
        [InlineData("     ", ".", "")]
        [InlineData(null, ".", "")]
        [InlineData("1.1", null, "1.1")]
        [InlineData("1.1",".","1")]
        [InlineData("1.0.1", ".", "1")]
        [InlineData("200.1", ".", "200")]
        [InlineData("1.0.2.3.4", ".", "1")]
        [InlineData("1.1", "", "1.1")]
        [InlineData("1.1", "*", "1.1")]
        public void ReturnStringBeforeDelimiter(string text, string delimiter, string expectedResult)
        {
            var sut = new SubstringService();

            var result = sut.GetSubstring(text, delimiter);

            Assert.Equal(expectedResult, result);
        }
    }
}
