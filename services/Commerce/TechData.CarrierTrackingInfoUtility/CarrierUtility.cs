using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.RegularExpressions;


namespace TechData.CarrierTrackingInfoUtility.Utitlity
{
    [ExcludeFromCodeCoverage]
    internal class CarrierUtility
    {
        private const string CARRIER_PILOT_LTL = "PILOT LTL";
        private const string CARRIER_APPLE = "APPLE";
        private const string CARRIER_HENDERSON = "HENDERSON";
        private const string CARRIER_CUSTOMER_PICKUP = "CUSTOMER PICK UP";
        internal Model.CarrierInformation GetCarrierInformation(Model.TrackingQuery input)
        {
            var _info = new Model.CarrierInformation();
            var _carrierName = new Constants.CarrierName();
            _info.Error = string.Empty;
            try
            {
                var _trackingId = input.TrackingId;


                if (string.IsNullOrEmpty(_trackingId.Trim()) == false)
                {
                    if (string.IsNullOrEmpty(input.CarrierName) == false)
                    {
                        _carrierName = GetCarrierCode(input.CarrierName, _trackingId);
                        if (_carrierName != Constants.CarrierName.None)
                        {
                            _info = SetCarrierInformation(_carrierName, input); // return info from calling 
                            return _info;
                        }
                    }

                    _carrierName = GetCarrier(_trackingId);
                    if (_carrierName == Constants.CarrierName.None)
                    {
                        _info.CarrierName = string.IsNullOrEmpty(input.CarrierName) ? string.Empty : input.CarrierName;
                        _info.CarrierURL = string.Empty;
                        _info.CarrierImageURL = CarrierTrackingInfoUtility.Constants.CarrierConstants.NoShippingImageUrl;
                        _info.TrackingId = _trackingId;
                        _info.Error = CarrierTrackingInfoUtility.Constants.CarrierConstants.InvalidCarrierAndTrackingName;
                    }
                    else
                    {
                        switch (_carrierName)
                        {
                            case Constants.CarrierName.Transplace:
                                if (IsTransplace(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.Transplace, input);

                                }
                                break;
                            case Constants.CarrierName.FedExExpress:
                                if (IsFedexExpress(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.FedExExpress, input);
                                }
                                break;
                            case Constants.CarrierName.FedExGround:
                                if (IsFedexGround(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.FedExGround, input);
                                }
                                break;
                            case Constants.CarrierName.UPS:
                                if (IsUPSCarrier(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.UPS, input);
                                }
                                break;
                            case Constants.CarrierName.AIT:
                                if (IsAIT(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.AIT, input);
                                }
                                break;
                            case Constants.CarrierName.CampbellExpress:
                                if (IsCampbellExpress(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.CampbellExpress, input);
                                }
                                break;
                            case Constants.CarrierName.CEVA:
                                if (IsCEVA(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.CEVA, input);
                                }
                                break;
                            case Constants.CarrierName.SJTransportation:
                                if (IsSJTransportation(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.SJTransportation, input);
                                }
                                break;
                            case Constants.CarrierName.SRMTransport:
                                if (IsSRMTransport(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.SRMTransport, input);
                                }
                                break;
                            case Constants.CarrierName.TownRegional:
                                if (IsTownRegional(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.TownRegional, input);
                                }
                                break;
                            case Constants.CarrierName.Mainfreight:
                                if (IsMainFreight(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.Mainfreight, input);
                                }
                                break;
                            case Constants.CarrierName.Expeditors:
                                if (IsExpeditors(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.Expeditors, input);
                                }
                                break;
                            case Constants.CarrierName.Forward:
                                if (IsForward(_trackingId) == true)
                                {
                                    _info = SetCarrierInformation(Constants.CarrierName.Forward, input);
                                }
                                break;
                            case Constants.CarrierName.Southeastern:
                                _info = SetCarrierInformation(Constants.CarrierName.Southeastern, input);
                                break;
                            case Constants.CarrierName.PittOhio:
                                _info = SetCarrierInformation(Constants.CarrierName.PittOhio, input);
                                break;
                            case Constants.CarrierName.SAIA:
                                _info = SetCarrierInformation(Constants.CarrierName.SAIA, input);
                                break;
                            case Constants.CarrierName.ADPyle:
                                _info = SetCarrierInformation(Constants.CarrierName.ADPyle, input);
                                break;
                            case Constants.CarrierName.Conway:
                                _info = SetCarrierInformation(Constants.CarrierName.Conway, input);
                                break;
                            case Constants.CarrierName.PilotLTL:
                                _info = SetCarrierInformation(Constants.CarrierName.PilotLTL, input);
                                break;

                            default:
                                _info.CarrierName = string.IsNullOrEmpty(input.CarrierName) ? string.Empty : input.CarrierName;
                                _info.CarrierURL = string.Empty;
                                _info.CarrierCode = string.Empty;
                                _info.TrackingId = _trackingId;
                                _info.CarrierImageURL = CarrierTrackingInfoUtility.Constants.CarrierConstants.NoShippingImageUrl;
                                break;
                        }
                        if (string.IsNullOrEmpty(_info.TrackingId))
                        {
                            _info.CarrierName = string.IsNullOrEmpty(input.CarrierName) ? string.Empty : input.CarrierName;
                            _info.CarrierURL = string.Empty;
                            _info.CarrierCode = string.Empty;
                            _info.TrackingId = string.IsNullOrEmpty(_trackingId) ? string.Empty : _trackingId;
                            _info.Error = CarrierTrackingInfoUtility.Constants.CarrierConstants.NoCarrierError;
                            _info.CarrierImageURL = CarrierTrackingInfoUtility.Constants.CarrierConstants.NoShippingImageUrl;
                        }
                    }
                }
                else
                {
                    _info.CarrierName = string.IsNullOrEmpty(input.CarrierName) ? string.Empty : input.CarrierName;
                    _info.CarrierURL = string.Empty;
                    _info.CarrierImageURL = CarrierTrackingInfoUtility.Constants.CarrierConstants.NoShippingImageUrl;
                    _info.CarrierCode = string.Empty;
                    _info.TrackingId = string.IsNullOrEmpty(_trackingId) ? string.Empty : _trackingId;
                    _info.Error = CarrierTrackingInfoUtility.Constants.CarrierConstants.NoCarrierInfo;
                }

            }
            catch (Exception)
            {
                _info.CarrierName = string.IsNullOrEmpty(input.CarrierName) ? string.Empty : input.CarrierName;
                _info.CarrierImageURL = CarrierTrackingInfoUtility.Constants.CarrierConstants.NoShippingImageUrl;
                _info.CarrierURL = string.Empty;
                _info.CarrierCode = string.Empty;
                _info.TrackingId = string.IsNullOrEmpty(input.TrackingId) ? string.Empty : input.TrackingId;
                _info.Error = CarrierTrackingInfoUtility.Constants.CarrierConstants.NoCarrierInfo;
            }


            return _info;
        }



        #region "Private Methods"

        private Constants.CarrierName GetCarrierCode(string _shipVia, string _trackingId)
        {

            string _carrierCode = "";
            _shipVia = _shipVia.Trim().ToUpper();

            if (new string[] { "UPS", "X-AIR NDAY WEST", "COSTCO 3RD PARTY" }.Any(n => _shipVia.Contains(n)))
            {
                _carrierCode = "UPS";
                return Constants.CarrierName.UPS;
            }
            else if (_shipVia.Contains("FED"))
            {
                _carrierCode = "FEDEX";
                return Constants.CarrierName.FedExGround;
            }
            else if (new string[] { "PURO", "GRND LOBLAWS" }.Any(n => _shipVia.Contains(n))) //_shipVia.Contains("PURO") 
            {
                _carrierCode = "PURO";
                return Constants.CarrierName.PURO;
            }
            else if (_shipVia.Contains("CEVA"))
            {
                _carrierCode = "CEVA";
                return Constants.CarrierName.CEVA;
            }
            else if (_shipVia.Contains("EAGLE"))
            {
                _carrierCode = "CEVA";
                return Constants.CarrierName.CEVA;
            }
            else if (_shipVia.Contains("AIT"))
            {
                _carrierCode = "AIT";
                return Constants.CarrierName.AIT;
            }
            else if (_shipVia.Contains("CAMPBELL"))
            {
                _carrierCode = "CAMPBELL";
                return Constants.CarrierName.CampbellExpress;
            }
            else if (_shipVia.Contains("SJ"))
            {
                _carrierCode = "SJ";
                return Constants.CarrierName.SJTransportation;
            }
            else if (_shipVia.Contains("SRM"))
            {
                _carrierCode = "SRM";
                return Constants.CarrierName.SRMTransport;
            }
            else if (_shipVia.Contains("TOWNE"))
            {
                _carrierCode = "TOWNE";
                return Constants.CarrierName.TownRegional;
                // insert additional carrier codes here...
            }
            else if (_shipVia.Contains("MAINFREIGHT"))
            {
                _carrierCode = "MAINFREIGHT";
                return Constants.CarrierName.Mainfreight;
                // insert additional carrier codes here...
            }
            else if (_shipVia.Contains("EXPEDITOR"))
            {
                _carrierCode = "EXPEDITOR";
                return Constants.CarrierName.Expeditors;
            }
            else if (_shipVia.Contains("FORWARD"))
            {
                _carrierCode = "FORWARD";
                return Constants.CarrierName.Forward;
            }
            else if (_shipVia.Contains("SOUTHEASTERN"))
            {
                _carrierCode = "SOUTHEASTERN";
                return Constants.CarrierName.Southeastern;
            }
            else if (_shipVia.Contains("PITT-OHIO") || _shipVia.Contains("PITT OHIO"))
            {
                _carrierCode = "PITTOHIO";
                return Constants.CarrierName.PittOhio;
            }
            else if (_shipVia.Contains("SAIA"))
            {
                _carrierCode = "SAIA";
                return Constants.CarrierName.SAIA;
            }
            else if (Regex.IsMatch(_shipVia, @"A(\.?\s?)D(uie)?(\s)?Pyle", RegexOptions.IgnoreCase)) //match on AD Pyle | A.Duie Pyle | ADPyle
            {
                _carrierCode = "ADPYLE";
                return Constants.CarrierName.ADPyle;
            }
            else if (new string[] { "CONWAY", "CON-WAY", "XPO LOGISTICS" }.Any(n => _shipVia.Contains(n)))
            {
                _carrierCode = "CONWAY";
                return Constants.CarrierName.Conway;
            }
            else if (_shipVia.Contains(CARRIER_PILOT_LTL))
            {
                _carrierCode = "PILOT_LTL";
                return Constants.CarrierName.PilotLTL;
            }
            else if (_shipVia.Contains(CARRIER_APPLE))
            {
                _carrierCode = "APPLE";
                return Constants.CarrierName.AppleExpress;
            }
            else if (new string[] { "ATS", "T-FORCE", "TFORCE" }.Any(n => _shipVia.Contains(n)))
            {
                _carrierCode = "ANDLAEUR_TRANSP";
                return Constants.CarrierName.AndlaurTransp;
            }
            else if (_shipVia.Contains(CARRIER_HENDERSON))
            {
                _carrierCode = "CW_HENDERSON_GT";
                return Constants.CarrierName.HENDERSON;
            }
            else if (_shipVia.Contains(CARRIER_CUSTOMER_PICKUP))
            {
                _carrierCode = "CUSTOMER_PICKUP";
                return Constants.CarrierName.CustomerPickUp;
            }
            else if (_shipVia.Contains("TRANSPLACE"))
            {
                _carrierCode = "JX";
                return Constants.CarrierName.Transplace;
            }
            else if (_shipVia.Contains("WRDS LTL"))
            {
                _carrierCode = "WRDS";
                return Constants.CarrierName.WRDS;
            }
            else if (_shipVia.Contains("AGS"))
            {
                _carrierCode = "AGS";
                return Constants.CarrierName.AGS;
            }
            else if (_shipVia.Contains("FSP"))
            {
                _carrierCode = "FSP";
                return Constants.CarrierName.FSP;
            }
            else if (_shipVia.Contains("USPSL"))
            {
                _carrierCode = "USPS";
                return Constants.CarrierName.USPS;
            }
            else
            {
                _carrierCode = string.Empty;
                return Constants.CarrierName.None;
            }
            //return _carrierCode;

        }

        private string GetCountryCode(Constants.CarrierInfoRequestFrom requestFrom)
        {
            var _country = "US";
            try
            {
                switch (requestFrom)
                {
                    case Constants.CarrierInfoRequestFrom.TDWebCN:
                    case Constants.CarrierInfoRequestFrom.MOTCN:
                        return Constants.CarrierConstants.Canada;//"CANADA";
                    case Constants.CarrierInfoRequestFrom.TDWebUS:
                    case Constants.CarrierInfoRequestFrom.MOTUS:
                    case Constants.CarrierInfoRequestFrom.Other:
                        return Constants.CarrierConstants.USA;
                    default:
                        return Constants.CarrierConstants.USA;
                }
            }
            catch (Exception)
            {
                return _country;

            }

        }

        private Model.CarrierInformation SetCarrierInformation(Constants.CarrierName carrierName, Model.TrackingQuery input)
        {
            var TrackingId = input.TrackingId;
            var SourceZip = input.SourceZip;
            var DestinationZip = input.DestinationZip;
            var _info = new Model.CarrierInformation();
            var _countryCode = GetCountryCode(input.RequestBy);
            try
            {
                //_info.CarrierURL = GetTrackingURL(carrierName, TrackingId);
                _info.Error = string.Empty;
                if (carrierName == Constants.CarrierName.Transplace)
                {
                    _info.CarrierCode = Constants.CarrierConstants.Transplace;
                    _info.CarrierName = Constants.CarrierConstants.TransplaceName;
                    var _url = Constants.CarrierConstants.TransplaceTrackUrl;
                    _url = _url + TrackingId + "&"; //+ "originZip=" + SourceZip + "&destinationZip=" + DestinationZip ;
                    _url = _url + "originZip=" + SourceZip + "&";
                    _url = _url + "destinationZip=" + DestinationZip;
                    _info.CarrierURL = _url;
                    _info.CarrierImageURL = Constants.CarrierConstants.NoShippingImageUrl;
                }
                else if (carrierName == Constants.CarrierName.UPS)
                {
                    _info.CarrierCode = Constants.CarrierConstants.UPS;
                    _info.CarrierName = Constants.CarrierConstants.UPSName;
                    _info.CarrierURL = Constants.CarrierConstants.UPSTrackUrl + TrackingId;
                    _info.CarrierImageURL = Constants.CarrierConstants.UPSImageUrl;

                }
                else if (carrierName == Constants.CarrierName.FedExExpress)
                {
                    _info.CarrierCode = Constants.CarrierConstants.FEDEX;
                    _info.CarrierName = Constants.CarrierConstants.FEDEXExpressName;
                    var _url = Constants.CarrierConstants.FedExGroundTrackUrl + "&";
                    _url = _url + "cntry_code=" + _countryCode + "&";
                    _url = _url + Constants.CarrierConstants.Language + Constants.CarrierConstants.English + "&";
                    _url = _url + Constants.CarrierConstants.Tracknumbers + TrackingId;
                    //_info.CarrierURL = Constants.CarrierConstants.FedExGroundTrackUrl + TrackingId; 
                    _info.CarrierURL = _url;
                    _info.CarrierImageURL = Constants.CarrierConstants.FedExExpressImageUrl;
                }
                else if (carrierName == Constants.CarrierName.FedExGround)
                {
                    _info.CarrierCode = Constants.CarrierConstants.FEDEX;
                    _info.CarrierName = Constants.CarrierConstants.FEDEXGroundName;

                    var _url = Constants.CarrierConstants.FedExGroundTrackUrl + "&";
                    _url = _url + "cntry_code=" + _countryCode + "&";
                    _url = _url + Constants.CarrierConstants.Language + Constants.CarrierConstants.English + "&";
                    var _trackingId = TrackingId;
                    if (input.RequestBy == Constants.CarrierInfoRequestFrom.TDWebCN)
                        _trackingId = _trackingId.TrimStart('0');
                    _url = _url + Constants.CarrierConstants.Tracknumbers + _trackingId;
                    //_info.CarrierURL = Constants.CarrierConstants.FedExGroundTrackUrl + TrackingId; 
                    _info.CarrierURL = _url;
                    _info.CarrierImageURL = Constants.CarrierConstants.FedExGroundImageUrl;
                }
                else if (carrierName == Constants.CarrierName.AIT)
                {
                    _info.CarrierCode = Constants.CarrierConstants.AIT;
                    _info.CarrierName = Constants.CarrierConstants.AITName;
                    _info.CarrierURL = Constants.CarrierConstants.AITTrackUrl + TrackingId;
                    _info.CarrierImageURL = Constants.CarrierConstants.AITImageUrl;
                }
                else if (carrierName == Constants.CarrierName.CampbellExpress)
                {
                    _info.CarrierCode = Constants.CarrierConstants.CampbellExpress;
                    _info.CarrierName = Constants.CarrierConstants.CampbellExpressName;
                    _info.CarrierURL = Constants.CarrierConstants.CampbellExpressTrackUrl;
                    _info.CarrierImageURL = Constants.CarrierConstants.CampbellExpressImageUrl;
                }
                else if (carrierName == Constants.CarrierName.CEVA)
                {
                    _info.CarrierCode = Constants.CarrierConstants.CEVA;
                    _info.CarrierName = Constants.CarrierConstants.CEVAName;
                    var _url = Constants.CarrierConstants.CEVATrackUrl + TrackingId;
                    if (input.RequestBy == Constants.CarrierInfoRequestFrom.TDWebCN)
                        _url = _url + "&st=All";
                    _info.CarrierURL = _url;
                    _info.CarrierImageURL = Constants.CarrierConstants.CEVAImageUrl;
                }
                else if (carrierName == Constants.CarrierName.SJTransportation)
                {
                    _info.CarrierCode = Constants.CarrierConstants.SJTransportation;
                    _info.CarrierName = Constants.CarrierConstants.SJTransportationName;
                    _info.CarrierURL = string.Empty; //Constants.CarrierConstants.SJTransportationTrackUrl + TrackingId;
                    _info.CarrierImageURL = Constants.CarrierConstants.SJTransportationImageUrl;
                }
                else if (carrierName == Constants.CarrierName.SRMTransport)
                {
                    _info.CarrierCode = Constants.CarrierConstants.SRMTransport;
                    _info.CarrierName = Constants.CarrierConstants.SRMTransportName;
                    _info.CarrierURL = string.Empty; //Constants.CarrierConstants.SRMTransportTrackUrl + TrackingId;
                    _info.CarrierImageURL = Constants.CarrierConstants.SRMTransportImageUrl;
                }
                else if (carrierName == Constants.CarrierName.TownRegional)
                {
                    _info.CarrierCode = Constants.CarrierConstants.TownRegional;
                    _info.CarrierName = Constants.CarrierConstants.TownRegionalName;
                    _info.CarrierURL = string.Empty; //Constants.CarrierConstants.TownRegionalTrackUrl + TrackingId;
                    _info.CarrierImageURL = Constants.CarrierConstants.TownRegionalImageUrl;
                }
                else if (carrierName == Constants.CarrierName.Mainfreight)
                {
                    _info.CarrierCode = Constants.CarrierConstants.MainFreight;
                    _info.CarrierName = Constants.CarrierConstants.MainFreightName;
                    _info.CarrierURL = Constants.CarrierConstants.MainFreightTrackUrl + TrackingId + "&Code=C&Country=NZL&NoFlash=False";
                    _info.CarrierImageURL = Constants.CarrierConstants.MainFreightShippingImageUrl;
                }
                else if (carrierName == Constants.CarrierName.Expeditors)
                {
                    _info.CarrierCode = Constants.CarrierConstants.EXPEDITORS;
                    _info.CarrierName = Constants.CarrierConstants.ExpeditorsName;
                    _info.CarrierURL = Constants.CarrierConstants.ExpeditorsTrackUrl + TrackingId;
                    _info.CarrierImageURL = Constants.CarrierConstants.ExpeditorsImageUrl;
                }
                else if (carrierName == Constants.CarrierName.Forward)
                {
                    _info.CarrierCode = Constants.CarrierConstants.Forward;
                    _info.CarrierName = Constants.CarrierConstants.ForwardName;
                    _info.CarrierImageURL = Constants.CarrierConstants.ForwardImageUrl;
                    _info.CarrierURL = Constants.CarrierConstants.ForwardTrackUrl;
                }
                else if (carrierName == Constants.CarrierName.Southeastern)
                {
                    _info.CarrierCode = Constants.CarrierConstants.Southeastern;
                    _info.CarrierName = Constants.CarrierConstants.SoutheasternName;
                    _info.CarrierURL = Constants.CarrierConstants.SoutheasternTrackUrl + TrackingId;
                    _info.CarrierImageURL = Constants.CarrierConstants.SoutheasternImageUrl;
                }
                else if (carrierName == Constants.CarrierName.PittOhio)
                {
                    _info.CarrierCode = Constants.CarrierConstants.PittOhio;
                    _info.CarrierName = Constants.CarrierConstants.PittOhioName;
                    _info.CarrierURL = Constants.CarrierConstants.PittOhioLTLTrackUrl;
                    _info.CarrierImageURL = Constants.CarrierConstants.PittOhioImageUrl;
                }
                else if (carrierName == Constants.CarrierName.SAIA)
                {
                    _info.CarrierCode = Constants.CarrierConstants.Saia;
                    _info.CarrierName = Constants.CarrierConstants.SaiaName;
                    _info.CarrierURL = Constants.CarrierConstants.SaiaTrackUrl + TrackingId;
                    _info.CarrierImageURL = Constants.CarrierConstants.SaiaImageUrl;
                }
                else if (carrierName == Constants.CarrierName.ADPyle)
                {
                    _info.CarrierCode = Constants.CarrierConstants.ADPyle;
                    _info.CarrierName = Constants.CarrierConstants.ADPyleName;
                    _info.CarrierImageURL = Constants.CarrierConstants.ADPyleImageUrl;
                    _info.CarrierURL = Constants.CarrierConstants.ADPyleTrackUrl + TrackingId;
                }
                else if (carrierName == Constants.CarrierName.Conway)
                {
                    _info.CarrierCode = Constants.CarrierConstants.Conway;
                    _info.CarrierName = Constants.CarrierConstants.ConwayName;
                    _info.CarrierImageURL = Constants.CarrierConstants.ConwayImageUrl;
                    _info.CarrierURL = Constants.CarrierConstants.ConwayTrackUrl + TrackingId;
                }
                else if (carrierName == Constants.CarrierName.PilotLTL)
                {
                    _info.CarrierCode = Constants.CarrierConstants.PilotLTL;
                    _info.CarrierName = Constants.CarrierConstants.PilotLTLName;
                    _info.CarrierImageURL = Constants.CarrierConstants.PilotLTLImageUrl;
                    _info.CarrierURL = Constants.CarrierConstants.PilotLTLTrackUrl + TrackingId;
                }
                else if (carrierName == Constants.CarrierName.PURO)
                {
                    _info.CarrierCode = Constants.CarrierConstants.PURO;
                    _info.CarrierName = Constants.CarrierConstants.PUROName;
                    _info.CarrierImageURL = Constants.CarrierConstants.PuroImageUrl;
                    var _url = Constants.CarrierConstants.PUROTrackURL + TrackingId;
                    _info.CarrierURL = _url;
                }
                else if (carrierName == Constants.CarrierName.AppleExpress)
                {
                    _info.CarrierCode = Constants.CarrierConstants.AppleExpress;
                    _info.CarrierName = Constants.CarrierConstants.AppleExpressName;
                    _info.CarrierImageURL = Constants.CarrierConstants.AppleExpressImageUrl;
                    var _url = Constants.CarrierConstants.AppleExpressTrackUrl + TrackingId;
                    _info.CarrierURL = _url;
                }
                else if (carrierName == Constants.CarrierName.AndlaurTransp)
                {
                    _info.CarrierCode = Constants.CarrierConstants.AndlaurTransp;
                    _info.CarrierName = Constants.CarrierConstants.AndlaurTranspName;
                    _info.CarrierImageURL = Constants.CarrierConstants.AndlaurTranspImageUrl;
                    var _url = Constants.CarrierConstants.AndlaurTranspTrackUrl + TrackingId;
                    _info.CarrierURL = input.CarrierName.ToUpper().Contains("ATS") ? string.Empty : _url;
                }
                else if (carrierName == Constants.CarrierName.HENDERSON)
                {
                    _info.CarrierCode = Constants.CarrierConstants.CWHendersonGT;
                    _info.CarrierName = Constants.CarrierConstants.CWHendersonGTName;
                    _info.CarrierImageURL = Constants.CarrierConstants.HendersonImageUrl;
                    var _url = Constants.CarrierConstants.HendersonTrackUrl + (string.IsNullOrEmpty(Constants.CarrierConstants.HendersonTrackUrl) ? "" : TrackingId);
                    _info.CarrierURL = _url;
                }
                else if (carrierName == Constants.CarrierName.WRDS)
                {
                    _info.CarrierCode = Constants.CarrierConstants.WRDS;
                    _info.CarrierName = Constants.CarrierConstants.WRDSName;
                    _info.CarrierImageURL = Constants.CarrierConstants.WRDSImageUrl;
                    var _url = Constants.CarrierConstants.WRDSUrl + TrackingId;
                    _info.CarrierURL = _url;
                }
                else if (carrierName == Constants.CarrierName.AGS)
                {
                    _info.CarrierCode = Constants.CarrierConstants.AGS;
                    _info.CarrierName = Constants.CarrierConstants.AGSName;
                    _info.CarrierImageURL = Constants.CarrierConstants.AGSImageUrl;
                    var _url = Constants.CarrierConstants.AGSUrl;
                    _info.CarrierURL = _url;
                }
                else if (carrierName == Constants.CarrierName.FSP)
                {
                    _info.CarrierCode = Constants.CarrierConstants.FSP;
                    _info.CarrierName = Constants.CarrierConstants.FSPName;
                    _info.CarrierImageURL = Constants.CarrierConstants.FSPImageUrl;
                    var _url = Constants.CarrierConstants.FSPUrl;
                    _info.CarrierURL = _url;
                }
                else if (carrierName == Constants.CarrierName.USPS)
                {
                    _info.CarrierCode = Constants.CarrierConstants.USPS;
                    _info.CarrierName = Constants.CarrierConstants.USPSName;
                    _info.CarrierImageURL = Constants.CarrierConstants.USPSImageUrl;
                    var _url = Constants.CarrierConstants.USPSUrl;
                    _info.CarrierURL = _url;
                }
                else if (carrierName == Constants.CarrierName.CustomerPickUp)
                {
                    _info.CarrierCode = Constants.CarrierConstants.CustomerPickup;
                    _info.CarrierName = Constants.CarrierConstants.CustomerPickupName;
                    _info.CarrierImageURL = Constants.CarrierConstants.CustomerPickupImageUrl;
                    var _url = Constants.CarrierConstants.NoCarrierTrackUrl;
                    _info.CarrierURL = _url;
                }
                else
                {
                    _info.CarrierCode = Constants.CarrierConstants.NoCarrier;
                    _info.CarrierName = Constants.CarrierConstants.NoCarrierName;
                    _info.CarrierURL = string.Empty;
                    _info.CarrierImageURL = Constants.CarrierConstants.NoShippingImageUrl;
                    _info.Error = Constants.CarrierConstants.NoCarrierError;
                }
            }
            catch (Exception)
            {
                _info.CarrierCode = string.Empty;
                _info.CarrierName = string.Empty;
                _info.CarrierURL = string.Empty;
                _info.CarrierImageURL = Constants.CarrierConstants.NoShippingImageUrl;
                _info.Error = Constants.CarrierConstants.SetCarrierException;
            }
            _info.TrackingId = TrackingId;
            return _info;
        }

        private Constants.CarrierName GetCarrier(string trackingId)
        {
            switch (trackingId.Length)
            {
                //TODO: Confirm length for Expeditors
                case 10:
                    return Constants.CarrierName.Expeditors;
                case 12:
                    return Constants.CarrierName.FedExExpress;
                case 15:
                    return Constants.CarrierName.FedExGround;
                case 18:
                    return Constants.CarrierName.UPS;
                //case 9:
                //    return Constants.CarrierName.PilotLTL;
                default:
                    return Constants.CarrierName.None;
            }
        }

        private bool IsUPSCarrier(string TrackingId)
        {
            try
            {
                char[] trackingNumberArray = new char[TrackingId.Length];
                trackingNumberArray = TrackingId.ToCharArray();
                int checkDigit = 0;
                int sum = 0;
                for (int i = 2; i < TrackingId.Length - 1; i++)
                {
                    if (char.IsDigit(trackingNumberArray[i]) == false)
                    {
                        if (Regex.IsMatch(trackingNumberArray[i].ToString(), "[A-H]"))
                        {
                            trackingNumberArray[i] = (char)(Convert.ToInt32(trackingNumberArray.GetValue(i)) - 15);
                        }
                        else if (Regex.IsMatch(trackingNumberArray[i].ToString(), "[I-R]"))
                        {
                            trackingNumberArray[i] = (char)(Convert.ToInt32(trackingNumberArray.GetValue(i)) - 25);
                        }
                        else if (Regex.IsMatch(trackingNumberArray[i].ToString(), "[S-Z]"))
                        {
                            trackingNumberArray[i] = (char)(Convert.ToInt32(trackingNumberArray.GetValue(i)) - 35);
                        }

                    }
                    if (i % 2 == 0) // adding all odd positions
                    {
                        sum += (Convert.ToInt32(trackingNumberArray.GetValue(i)) - 48);
                    }
                    else
                    {
                        sum += 2 * (Convert.ToInt32(trackingNumberArray.GetValue(i)) - 48);
                    }

                }
                checkDigit = (int)(Math.Ceiling(sum / 10.0d) * 10) - sum; // round to the next highest ten (71 becomes 80)
                if ((Convert.ToInt32(trackingNumberArray.GetValue(TrackingId.Length - 1)) - 48) == checkDigit)
                {
                    // check digit passes
                    return true;
                }
                else
                {
                    // check digit fails
                    return false;
                }
            }
            catch (Exception)
            {
                return false;
                //throw;
            }

        }

        [Obsolete("This method will be removed from future versions")]
        private bool IsUPSCarrier(string TrackingId, string URL)
        {


            var _isUPS = false;
            _isUPS = IsUPSCarrier(TrackingId);
            try
            {
                var _id = TrackingId.Trim();
                if (_id.Length != 18)
                {
                    return false;
                }

                if (_id.Substring(0, 2).ToUpper().Equals("1Z") == false)
                {
                    return false;
                }
                var _number = _id.Substring(2, 15);
                var _iRunningTotal = 0d;
                var _validChars = "0123456789";  // used to validate a number

                for (int i = 0; i < _validChars.Length; i++)
                {
                    var c = _number[i].ToString();
                    if (((i + 1) % 2) == 0)
                    { // even index value
                        if (_validChars.IndexOf(c) != -1) // indicates numeric value
                        {
                            _iRunningTotal += 2 * Convert.ToInt32(c);
                        }
                        else
                        {
                            _iRunningTotal += (Convert.ToInt32(_number[i]) - 63) % 10;
                        }

                    }
                    else
                    {
                        if (_validChars.IndexOf(c) != -1) // indicates numeric value
                            _iRunningTotal += Convert.ToInt16(c);
                        else
                        {
                            var n = (Convert.ToInt32(_number[i]) - 63) % 10d;
                            _iRunningTotal += (2 * n) - (9 * Math.Floor(n / 5));
                        }
                    }
                }
                var check = Convert.ToDouble(_id.Substring(17, 1));
                var digit = _iRunningTotal % 10d;
                if (digit != check && digit > 0)
                {
                    digit = 10 - digit;
                }
                else
                {
                    return true;
                }
                _isUPS = (digit == check) ? true : false;
                return _isUPS;

            }
            catch (Exception e)
            {
                _isUPS = false;
            }
            return _isUPS;
        }

        private bool IsFedexExpress(string TrackingId)
        {
            var _isFedexExpress = false;

            try
            {
                #region "js way"
                //var _id = TrackingId.Trim();

                //if (_id.Length != 12)
                //{
                //    return false;
                //}

                //int[] values = new int[] { 3, 1, 7 };// the values to use when multiplying numbers
                //var validnumbers = "0123456789";                // used to validate a number
                //var total = 0;
                //for (int i = 0; i < 11; i++)
                //{
                //    var c = _id[i].ToString();
                //    if (validnumbers.IndexOf(c) == -1)
                //    {// if this isn't a number then its invalid
                //        return false;
                //    }

                //    var n = Convert.ToInt32(c);
                //    total += n * values[i % 3];
                //}
                //var check = total % 11;
                //if (check == 10)
                //{
                //    check = 0;
                //}
                //_isFedexExpress = (Convert.ToInt32(_id[11].ToString()) == check) ? true : false;
                #endregion
                char[] trackingNumberArray = new char[TrackingId.Length];
                trackingNumberArray = TrackingId.ToCharArray();

                //reverse array
                Array.Reverse(trackingNumberArray, 0, TrackingId.Length);
                int sum = 0;
                int multiplier = 7;
                int check = 0;
                for (int i = 1; i < TrackingId.Length; i++) //skip check digit
                {
                    if (multiplier == 7)
                    {
                        multiplier = 1;
                    }
                    else if (multiplier == 1)
                    {
                        multiplier = 3;
                    }
                    else if (multiplier == 3)
                    {
                        multiplier = 7;
                    }
                    sum += (Convert.ToInt32(trackingNumberArray.GetValue(i)) - 48) * multiplier;
                }
                check = sum % 11;
                if (check == 10)
                {
                    check = 0;
                }

                if ((Convert.ToInt32(trackingNumberArray.GetValue(0)) - 48) == check)
                {
                    // check digit passes
                    return true;
                }
                else
                {
                    // check digit fails
                    return false;
                }
            }
            catch (Exception e)
            {
                _isFedexExpress = false;
            }
            return _isFedexExpress;
        }

        private bool IsFedexGround(string TrackingId)
        {
            var _isFedexGround = false;

            try
            {
                char[] trackingNumberArray = new char[TrackingId.Length];
                trackingNumberArray = TrackingId.ToCharArray();

                //reverse array
                Array.Reverse(trackingNumberArray, 0, TrackingId.Length);
                int sum = 0;
                int check = 0;
                for (int i = 1; i < TrackingId.Length; i++) // skip position 0
                {
                    if (i % 2 == 1) // every other digit multiplied by 3
                    {
                        sum += (Convert.ToInt32(trackingNumberArray.GetValue(i)) - 48) * 3;
                    }
                    else
                    {
                        sum += (Convert.ToInt32(trackingNumberArray.GetValue(i)) - 48);
                    }
                }
                check = (int)(Math.Ceiling(sum / 10.0d) * 10) - sum;
                if (check == 10)
                {
                    check = 0;
                }
                if ((Convert.ToInt32(trackingNumberArray.GetValue(0)) - 48) == check)
                {
                    // check digit passes
                    return true;
                }
                else
                {
                    // check digit fails
                    return false;
                }
            }
            catch (Exception)
            {
                _isFedexGround = false;
            }
            return _isFedexGround;
        }

        private bool IsCEVA(string TrackingId)
        {
            var _isCEVA = false;

            try
            {
                _isCEVA = true;
            }
            catch (Exception)
            {
                _isCEVA = false;
            }
            return _isCEVA;
        }

        private bool IsAIT(string TrackingId)
        {
            var _isAIT = false;

            try
            {
                _isAIT = true;
            }
            catch (Exception)
            {
                _isAIT = false;
            }
            return _isAIT;
        }

        private bool IsCampbellExpress(string TrackingId)
        {
            var _isCampbellExpress = false;

            try
            {
                _isCampbellExpress = true;
            }
            catch (Exception)
            {
                _isCampbellExpress = false;
            }
            return _isCampbellExpress;
        }

        private bool IsSJTransportation(string TrackingId)
        {
            var _isSJTransportation = false;

            try
            {
                _isSJTransportation = true;
            }
            catch (Exception)
            {
                _isSJTransportation = false;
            }
            return _isSJTransportation;
        }

        private bool IsSRMTransport(string TrackingId)
        {
            var _isSSRMTransport = false;

            try
            {
                _isSSRMTransport = true;
            }
            catch (Exception)
            {
                _isSSRMTransport = false;
            }
            return _isSSRMTransport;
        }

        private bool IsTownRegional(string TrackingId)
        {
            var _isTownRegional = false;

            try
            {
                _isTownRegional = true;
            }
            catch (Exception)
            {
                _isTownRegional = false;
            }
            return _isTownRegional;
        }

        private bool IsMainFreight(string TrackingId)
        {
            var _IsMainFreight = false;

            try
            {
                _IsMainFreight = true;
            }
            catch (Exception)
            {
                _IsMainFreight = false;
            }
            return _IsMainFreight;
        }

        private bool IsExpeditors(string TrackingId)
        {
            var _IsExpeditors = false;

            try
            {
                _IsExpeditors = true;
            }
            catch (Exception)
            {
                _IsExpeditors = false;
            }
            return _IsExpeditors;
        }

        private bool IsForward(string TrackingId)
        {
            var _IsForward = false;
            try
            {
                _IsForward = true;
            }
            catch
            { }

            return _IsForward;
        }
        private bool IsTransplace(string TrackingId)
        {
            var _IsTransplace = false;
            try
            {
                _IsTransplace = true;
            }
            catch
            { }

            return _IsTransplace;
        }


        [Obsolete("This method will be removed from future versions. Use SetCarrierInformation Instead")]
        private string GetTrackingURL(Constants.CarrierName name, string TrackingId)
        {
            var _url = string.Empty;
            try
            {
                if (name == Constants.CarrierName.UPS)
                {
                    _url = "http://wwwapps.ups.com/tracking/tracking.cgi?tracknum=" + TrackingId;
                }
                else if (name == Constants.CarrierName.FedExExpress || name == Constants.CarrierName.FedExGround)
                {
                    _url = "http://www.fedex.com/Tracking?tracknumbers=" + TrackingId;
                }
                else if (name == Constants.CarrierName.AIT)
                {
                    _url = String.Empty;
                }
                else if (name == Constants.CarrierName.CampbellExpress)
                {
                    _url = String.Empty;
                }
                else if (name == Constants.CarrierName.CEVA)
                {
                    _url = String.Empty;
                }
                else if (name == Constants.CarrierName.SJTransportation)
                {
                    _url = String.Empty;
                }
                else if (name == Constants.CarrierName.SRMTransport)
                {
                    _url = String.Empty;
                }
                else if (name == Constants.CarrierName.TownRegional)
                {
                    _url = String.Empty;
                }
                else
                {
                    _url = String.Empty;
                }
            }
            catch (Exception)
            {
                _url = String.Empty;
            }
            return _url;
        }



        #endregion
    }
}
