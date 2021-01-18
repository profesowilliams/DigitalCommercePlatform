using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.Core.Services.Quote.DTO
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