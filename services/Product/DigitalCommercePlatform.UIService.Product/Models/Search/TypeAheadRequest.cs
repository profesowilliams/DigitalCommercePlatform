using MediatR;
using System;

namespace DigitalCommercePlatform.UIService.Product.Models.Search
{
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