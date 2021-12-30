//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using System;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Common
{
    public class DateTimeToStringConverter : ITypeConverter<DateTime?, string>
    {
        public static readonly string Format = "MM/dd/yyyy";
        public static readonly string DefaultDateTimeString = "n/a";

        private static readonly DateTime _defaultDateTime = new();

        public string Convert(DateTime? s, string d, ResolutionContext context)
        {
            if (!s.HasValue || _defaultDateTime.CompareTo(s.Value) == 0) 
                return DefaultDateTimeString;
            return s.Value.ToString(Format);
        }
    }
}
