using System;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Common
{
    public static class StringUtils
    {
        public static string GenerateRandomString(int length, string chars)
        {
            var stringChars = new char[length];
            var random = new Random();

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            return new string(stringChars);
        }
    }
}
