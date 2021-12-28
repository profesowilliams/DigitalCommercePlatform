//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using AutoMapper;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Export.Models.Order;
using Techdata.Common.Utility.CarrierTracking;
using Techdata.Common.Utility.CarrierTracking.Model;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers
{
    public class LineTrackingsResolver : IValueResolver<Item, Line, List<TrackingDetails>>
    {
        public ShipmentUtility ShipmentUtility { get; set; } = new ();

        public List<TrackingDetails> Resolve(Item source, Line destination, List<TrackingDetails> destMember, ResolutionContext context)
        {
            var trackingDetails = source?.Shipments.Select(i => new TrackingDetails
            {
                ID = i.ID,
                Carrier = i.Carrier,
                Date = i.Date,
                Description = i.Description,
                DNote = i.DNote,
                DNoteLineNumber = i.DNoteLineNumber,
                GoodsReceiptNo = i.GoodsReceiptNo,
                ServiceLevel = i.ServiceLevel,
                TrackingNumber = i.TrackingNumber,
                TrackingLink = ShipmentUtility.GetSingleCarrierInformation(new TrackingQuery { TrackingId = i.TrackingNumber })?.CarrierURL,
                Type = i.Type
            }).ToList();

            return trackingDetails;
        }
    }
}
