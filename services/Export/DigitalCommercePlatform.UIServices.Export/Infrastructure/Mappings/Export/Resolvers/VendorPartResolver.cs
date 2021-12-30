//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models;
using System.Linq;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using AutoMapper;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers
{
    public class VendorPartResolver : IValueResolver<Item, Line, string>
    {
        public string Resolve(Item source, Line destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Where(p => p.Type.ToUpper().Equals("MANUFACTURER")).Any() 
                ? source.Product.Where(p => p.Type.ToUpper().Equals("MANUFACTURER")).FirstOrDefault()?.Id 
                : "Unavailable";
            return description;
        }
    }
}
