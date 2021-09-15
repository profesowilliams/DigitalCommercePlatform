//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.ActiveCart;
using DigitalCommercePlatform.UIServices.Search.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.Models.Cart;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class CartProfile : Profile
    {
        public CartProfile()
        {
            CreateMap<SavedCartDetailsModel, GetSavedCartDetails.Response>()
                .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src));

            CreateMap<IEnumerable<TypeAheadSuggestion>, TypeAheadSearch.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

            CreateMap<ActiveCartModel, GetActiveCart.Response>()
               .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src));
        }
    }
}
