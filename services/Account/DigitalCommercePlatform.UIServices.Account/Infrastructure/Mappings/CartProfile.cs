using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.SavedCartsList;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class CartProfile : Profile
    {
        public CartProfile()
        {
            CreateMap<CartModel, GetCartsList.Response>()
                .ForMember(dest => dest.SavedCarts, opt => opt.MapFrom(src => src.UserSavedCarts));

        }
    }
}
