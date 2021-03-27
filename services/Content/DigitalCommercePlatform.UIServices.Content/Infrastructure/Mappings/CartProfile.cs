using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Infrastructure.Mappings
{
    public class CartProfile : Profile
    {
        public CartProfile()
        {
            CreateMap<IEnumerable<Cart123>, GetCart.Response>()
                .ForMember(dest => dest.Cart, opt => opt.MapFrom(src => src));

            //.ForPath(dest => dest.Id, opt => opt.MapFrom(src => src.source.Id))
            //.ForPath(dest => dest.CustomerNo, opt => opt.MapFrom(src => src.customerNo));
            //.ForPath(dest => dest.lineNo, opt => opt.MapFrom(src => src.lines));
        }
    }
}
