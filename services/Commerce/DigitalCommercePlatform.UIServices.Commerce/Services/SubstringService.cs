//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public class SubstringService : ISubstringService
    {
        public string GetSubstring(string text, string substringDelimiter)
        {
            if (substringDelimiter == null)
            {
                return text;
            }

            if (string.IsNullOrWhiteSpace(text))
            {
                return string.Empty;
            }

            int charLocation = text.IndexOf(substringDelimiter, StringComparison.Ordinal);

            if (charLocation > 0)
            {
                var substring = text.Substring(0, charLocation);
                return substring;
            }

            return text;
        }
    }
}
