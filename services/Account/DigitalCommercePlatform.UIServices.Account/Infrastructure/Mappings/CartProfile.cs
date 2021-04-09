using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using System.Diagnostics.CodeAnalysis;
using static DigitalCommercePlatform.UIServices.Account.Actions.DetailsOfSavedCart.GetCartDetails;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class CartProfile : Profile
    {
        public CartProfile()
        {
            CreateMap<CartModel, GetCartResponse>();
        }
    }
}
