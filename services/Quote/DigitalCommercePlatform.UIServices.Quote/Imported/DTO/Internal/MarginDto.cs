using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class MarginDto
    {
        public TypeDtoEnum TypeMargin { get; set; }
        public decimal Amount { get; set; }
        public decimal Percent { get; set; }
    }
}