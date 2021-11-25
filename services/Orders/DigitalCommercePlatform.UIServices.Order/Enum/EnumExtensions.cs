//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Enum
{
    [ExcludeFromCodeCoverage]
    public static class EnumExtensions
    {
        public static bool Compare<T>(this T @enum, string value, StringComparison? stringComparison = null) where T:System.Enum
        {
            var stringValue = @enum.ToString();
            return stringValue.Equals(value, stringComparison.HasValue
                ? stringComparison.Value : StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
