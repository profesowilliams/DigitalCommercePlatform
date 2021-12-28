//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers
{
    public class DateResolver : IValueResolver<OrderModel, OrderDetailModel, string>
    {
        public string Resolve(OrderModel source, OrderDetailModel destination, string destMember, ResolutionContext context)
        {
            var poDate = source.PoDate.HasValue
                ? source.PoDate.Value.ToString("MM/dd/yy")
                : string.Empty;
            return poDate;
        }
    }
}
