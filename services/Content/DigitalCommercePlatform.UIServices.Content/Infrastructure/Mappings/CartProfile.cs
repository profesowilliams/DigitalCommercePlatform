using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Actions.ActiveCart;
using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class CartProfile : Profile
    {
        public CartProfile()
        {
            CreateMap<CartModel, GetCart.Response>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.source.Id))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.totalQuantity));

            CreateMap<TypeAheadSearch.Response, TypeAheadSearch.Response>();

            CreateMap<ActiveCartModel, GetActiveCart.Response>()
               .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src));
        }
    }
}
