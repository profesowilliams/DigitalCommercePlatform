//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Enum;
using System;

namespace DigitalCommercePlatform.UIServices.Renewal.Helpers
{
    public static class EnumExtensions
    {
        public static bool IsEqualTo(this ConfigurationType configurationType, string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return false;

            return configurationType.ToString().Equals(value, StringComparison.InvariantCultureIgnoreCase);
        }
    }
}