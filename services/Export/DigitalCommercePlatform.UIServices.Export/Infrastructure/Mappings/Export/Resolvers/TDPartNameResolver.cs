//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models;
using System.Linq;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using AutoMapper;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers
{
    public class TDPartNameResolver : IValueResolver<Item, Line, string>
    {
        public string Resolve(Item source, Line destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA"))
                                            .Any() 
                                                ? source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA"))
                                                                .FirstOrDefault()?
                                                                .Name 
                                                : "Unavailable";
            return description;
        }
    }
}
