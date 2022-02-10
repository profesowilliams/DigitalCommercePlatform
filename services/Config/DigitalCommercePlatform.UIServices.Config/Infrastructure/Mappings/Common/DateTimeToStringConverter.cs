//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using System;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Common
{
    public class DateTimeToStringConverter : ITypeConverter<DateTime?, string>
    {
        public const string Format = "MM/dd/yyyy";
        public const string DefaultDateTimeString = "n/a";

        private static readonly DateTime _defaultDateTime = new();

        public string Convert(DateTime? s, string d, ResolutionContext context)
        {
            if (!s.HasValue || _defaultDateTime.CompareTo(s.Value) == 0) 
                return DefaultDateTimeString;
            return s.Value.ToString(Format);
        }
    }
}
