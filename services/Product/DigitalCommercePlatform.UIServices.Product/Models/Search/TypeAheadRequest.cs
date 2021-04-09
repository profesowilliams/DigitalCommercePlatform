using MediatR;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class TypeAheadRequest : IRequest<TypeAheadResponse>
    {
        public string SearchApplication { get; set; }
        public string Keyword { get; set; }
        public object Clone()
        {
            return new TypeAheadRequest
            {
                Keyword = Keyword,
                SearchApplication = SearchApplication
            };
        }
    }
}