using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Quote.Generated
{
    [ExcludeFromCodeCoverage]
    public class ResponseDto<T>
    {
        public ResponseDto()
        {
        }

        public T ReturnObject { get; set; }

        public List<string> Errors { get; set; }
    }
}
