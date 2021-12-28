//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models;
using System.Linq;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using AutoMapper;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Export.Models.Order;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers
{
    public class ShipmentsResolver : IValueResolver<Item, Line, List<TrackingDetails>>
    {
        public List<TrackingDetails> Resolve(Item source, Line destination, List<TrackingDetails> destMember, ResolutionContext context)
        {
            if (source.Shipments == null || source.Shipments.Count == 0)
                return new List<TrackingDetails>();

            return source.Shipments
                         .Select(shipment => new TrackingDetails()
                         {
                             Carrier = shipment.Carrier,
                             Description = shipment.Description,
                             TrackingNumber = shipment.TrackingNumber,
                             Date = shipment.Date
                         })
                         .ToList();
        }
    }
}
