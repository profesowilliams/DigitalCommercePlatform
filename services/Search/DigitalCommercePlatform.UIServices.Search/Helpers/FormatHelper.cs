//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;
using System.Globalization;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Search.Helpers
{
    public static class FormatHelper
    {
        private const string intFormat = "N0";       

        public static string Format(this DateOnly? input)
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

        public static string Format(this int input)
        {
            return input.ToString(intFormat);
        }

        public static string FormatSubtraction(decimal? minuend, decimal? subtrahend, string currency)
        {
            return minuend.HasValue && subtrahend.HasValue ? Format((decimal)(minuend - subtrahend), currency) : null;
        }

        public static bool IsAvailable(this decimal? input)
        {
            return input.HasValue && input.Value != 0;
        }

        public static string ListPriceFormat(decimal? listPrice, string naLabel, bool listPriceAvailable, string currency)
        {
            if (IsAvailable(listPrice))
                return listPrice.Value.Format(currency);

            return listPriceAvailable ? 0m.Format(currency) : naLabel;
        }

        public static string Format(this decimal input, string currencyCode)
        {
            if (string.IsNullOrEmpty(currencyCode))
                throw new ArgumentNullException(nameof(currencyCode));

            var culture = (from c in CultureInfo.GetCultures(CultureTypes.SpecificCultures)
                           let r = new RegionInfo(c.Name)
                           where r != null
                           && r.ISOCurrencySymbol.ToUpper() == currencyCode.ToUpper()
                           select c).FirstOrDefault();

            if (culture == null)
            {
                var message = $"Cannot find the {nameof(culture)}";
                throw new ArgumentNullException(message);
            }

            return string.Format(culture, "{0:C}", input);
        }

        public static string Format(this DateTime? input)
        {
            return input.HasValue ? input.Value.ToString() : null;
        }
    }
}
