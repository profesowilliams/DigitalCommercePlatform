using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace TechData.CarrierTrackingInfoUtility
{
    [ExcludeFromCodeCoverage]
    public class ShipmentUtility
    {
        public Model.CarrierInformation GetSingleCarrierInformation(Model.TrackingQuery input)
        {

            var _info = new Model.CarrierInformation();
            try
            {

                var _objManager = new Manager.TrackingManager();
                _info = _objManager.GetCarrierInformation(input);
            }
            catch (Exception)
            {

            }
            return _info;
        }
        /// <summary>
        /// Accepts collection of TrackingQuery class as Input
        /// Output: Collection of CarrierInformation Class.
        /// </summary>
        /// <param name="lstinput">Collection of TrackingQuery class</param>
        /// <returns></returns>
        public List<Model.CarrierInformation> GetMultipleCarrierInformation(List<Model.TrackingQuery> lstinput)
        {

            var _lstInfo = new List<Model.CarrierInformation>();
            try
            {
                if (lstinput.Count > 0)
                {
                    var _objManager = new Manager.TrackingManager();
                    #region "use FOREACH if PARALLEL.FOREACH is making noice"
                    //foreach (var input in lstinput)
                    //{
                    //    var _info = new Model.CarrierInformation();
                    //    _info = _objManager.GetCarrierInformation(input);
                    //    _lstInfo.Add(_info);
                    //}
                    #endregion

                    Parallel.ForEach(lstinput, input =>
                    {
                        var _info = new Model.CarrierInformation();
                        _info = _objManager.GetCarrierInformation(input);
                        _lstInfo.Add(_info);
                    }
                    );
                }
            }
            catch (Exception)
            {

            }
            return _lstInfo;
        }

    }
}
