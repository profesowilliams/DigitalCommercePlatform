using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.DTO.Common
{
    [ExcludeFromCodeCoverage]
    public class FindResponse<T>
    {
        public long? Count { get; set; }
        public T Data { get; set; }
    }
}