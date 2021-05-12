using System;
using System.Diagnostics.CodeAnalysis;
using Utility = TechData.CarrierTrackingInfoUtility.Utitlity;

namespace TechData.CarrierTrackingInfoUtility.Manager
{
    // Temporary class library inside solution. In future will be inside NuGet package
    [ExcludeFromCodeCoverage]
    internal class TrackingManager
    {
        internal Model.CarrierInformation GetCarrierInformation(Model.TrackingQuery input)
        {
            var _info = new Model.CarrierInformation();
            var _trackingId = input.TrackingId;
            try
            {
                var _objCarrierUtility = new Utility.CarrierUtility();
                _info = _objCarrierUtility.GetCarrierInformation(input);
            }
            catch (Exception)
            {
                _info.CarrierCode = string.Empty;
                _info.CarrierName = string.Empty;
                _info.CarrierURL = string.Empty;
                _info.TrackingId = _trackingId;
                _info.Error = Constants.CarrierConstants.CarrierUtilityException;
            }
            return _info;
        }
    }
}
