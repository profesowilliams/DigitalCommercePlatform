using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Actions.ActiveCart;
using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalCommercePlatform.UIServices.Content.Models.Search;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class CartProfile : Profile
    {
        public CartProfile()
        {
            CreateMap<CartModel, GetCart.Response>()
                .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src));

            CreateMap<IEnumerable<TypeAheadSuggestion>, TypeAheadSearch.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

            CreateMap<ActiveCartModel, GetActiveCart.Response>()
               .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src));
        }
    }
}
