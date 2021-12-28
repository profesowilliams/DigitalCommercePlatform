//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using AutoMapper;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers
{
    public class LineTotalResolver : IValueResolver<Item, Line, decimal?>
    {
        public decimal? Resolve(Item source, Line destination, decimal? destMember, ResolutionContext context)
        {
            if (source.TotalPrice is null && source.UnitPrice.HasValue)
                source.TotalPrice = source.UnitPrice * source.Quantity;

            return source.TotalPrice;
        }
    }
}
