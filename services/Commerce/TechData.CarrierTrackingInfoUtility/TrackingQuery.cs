using System.Collections.Generic;
using Constant = TechData.CarrierTrackingInfoUtility.Constants;
namespace TechData.CarrierTrackingInfoUtility.Model
{
    public class TrackingQuery
    {
        public string TrackingId;

        public Constant.CarrierInfoRequestFrom RequestBy;

        public string CarrierName;

        public string SourceZip;

        public string DestinationZip;

        public List<string> Extras;
    }
}
