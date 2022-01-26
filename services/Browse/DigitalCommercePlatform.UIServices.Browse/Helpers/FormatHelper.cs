//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Browse.Helpers
{
    public static class FormatHelper
    {
        private const string currencyFormat = "C";
        private const string intFormat = "N0";

        public static string Format(this DateTime? input)
        {
            return input.HasValue ? input.Value.ToString() : null;
        }

        public static string Format(this int? input)
        {
            return input.Format(null);
        }

        public static string Format(this int? input, string defaultValue)
        {
            return input.HasValue ? input.Value.Format() : defaultValue;
        }

        public static string Format(this decimal? input, string defaultValue)
        {
            return input.HasValue ? input.Value.Format() : defaultValue;
        }

        public static string Format(this decimal? input)
        {
            return input.Format(null);
        }

        public static string Format(this int input)
        {
            return input.ToString(intFormat);
        }

        public static string Format(this decimal input)
        {
            return input.ToString(currencyFormat);
        }

        public static string FormatSubtraction(decimal? minuend, decimal? subtrahend)
        {
            return minuend.HasValue && subtrahend.HasValue ? Format((decimal)(minuend - subtrahend)) : null;
        }
    }
}