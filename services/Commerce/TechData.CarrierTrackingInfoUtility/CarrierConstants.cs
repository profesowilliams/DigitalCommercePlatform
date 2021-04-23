namespace TechData.CarrierTrackingInfoUtility.Constants
{
    public enum CarrierName
    {
        None = 0,
        UPS = 1,
        FedExExpress = 2,
        FedExGround = 3,
        CEVA = 4,
        AIT = 5,
        CampbellExpress = 6,
        SJTransportation = 7,
        SRMTransport = 8,
        TownRegional = 9,
        PURO = 10,
        Mainfreight = 11,
        Expeditors = 12,
        Forward = 13,
        Southeastern = 14,
        PittOhio = 15,
        SAIA = 16,
        ADPyle = 17,
        Conway = 18,
        PilotLTL = 19,
        AppleExpress = 20,
        AndlaurTransp = 21,
        HENDERSON = 22,
        CustomerPickUp = 23,
        Transplace = 24,
        WRDS = 25,
        AGS = 26,
        FSP = 27,
        USPS = 28
    }

    public enum CarrierInfoRequestFrom
    {
        TDWebUS = 0,
        TDWebCN = 1,
        MOTUS = 2,
        MOTCN = 3,
        Other = 4
    }



    internal static class CarrierConstants
    {
        #region "Carrier Track Url"
        public const string UPSTrackUrl = @"http://wwwapps.ups.com/tracking/tracking.cgi?tracknum=";
        public const string FedExGroundTrackUrl = @"http://www.fedex.com/Tracking?"; //http://www.fedex.com/Tracking?ascend_header=1&clienttype=dotcom
        public const string FedExExpressTrackUrl = @"http://www.fedex.com/Tracking?"; //http://www.fedex.com/Tracking?ascend_header=1&clienttype=dotcom
        public const string CEVATrackUrl = @"http://etracking.cevalogistics.com/eTrackResultsMulti.aspx?sv=";
        public const string AITTrackUrl = "http://fastrak.aitworldwide.com/FormattedDefault.aspx?TrackingNums=";
        public const string CampbellExpressTrackUrl = @"http://campbellsexpress.com/";
        public const string SJTransportationTrackUrl = "";
        public const string SRMTransportTrackUrl = "";
        public const string TownRegionalTrackUrl = "";
        public const string PUROTrackURL = @"https://www.purolator.com/en/app-tracker.page?pin=";
        public const string MainFreightTrackUrl = @"http://www.mainfreight.com/Global/en/Freight-Tracking.aspx?ID=";
        public const string ForwardTrackUrl = @"https://www.forwardair.com/";
        public const string ExpeditorsTrackUrl = @"http://expo.expeditors.com/expo/SQGuest?SearchType=shipmentSearch&TrackingNumber=";
        public const string SoutheasternTrackUrl = @"https://www.sefl.com/seflWebsite/servlet?action=Tracing_Trace_by_pro&Type=PN&RefNum=";
        public const string PittOhioLTLTrackUrl = @"http://works.pittohio.com/mypittohio/";
        public const string SaiaTrackUrl = @"http://www.saia.com/Tracing/AjaxProstatusByPro.aspx?m=2&UID=&PWD=&SID=CJ87Y88540106&PRONum1=";//10124751080
        public const string ADPyleTrackUrl = @"http://www.aduiepyle.com/LTL/ShipmentTracking?Pro=";
        public const string NoCarrierTrackUrl = "";
        public const string ConwayTrackUrl = @"https://www.con-way.com/webapp/manifestrpts_p_app/shipmentTracking.do?PRO=";//521999041
        public const string PilotLTLTrackUrl = @"http://www.pilotdelivers.com/quicktrack.aspx?Pro=";//082005120
        public const string AppleExpressTrackUrl = @"https://goapple.appleexpress.com/clientordertracking.aspx?RefNo="; //1256342        
        public const string AndlaurTranspTrackUrl = @"http://www.tforce-solutions.com/quickTrackResult.aspx?ship="; //http://sdn.ensenda.com/ui/track?trackingNumber=123456789
        public const string HendersonTrackUrl = @"http://www.cwhtracking.ca/scripts/cgiip.exe/WService=nalatin1/inq/urlorder.p?wu=x7276927&wr=b"; //123456789
        public const string TransplaceTrackUrl = @"https://tms.transplace.com/security/trackingLogin.do?reference=";
        public const string WRDSUrl = @"http://tracking.wrds.com/zTrack2.aspx?ProNumber=";
        public const string AGSUrl = @"https://tracking.agsystems.com/";
        public const string FSPUrl = @"https://www.shipfsp.com/";
        public const string USPSUrl = @"https://www.usps.com/";


        #endregion

        #region "Carrier Image Url"
        public const string UPSImageUrl = "/images/ShippingCarriers/UPSLogo.png";
        public const string FedExGroundImageUrl = "/images/ShippingCarriers/FedExLogo.png";
        public const string FedExExpressImageUrl = "/images/ShippingCarriers/FedExLogo.png";
        public const string CEVAImageUrl = "/images/ShippingCarriers/CEVALogo.png";
        public const string AITImageUrl = "/images/ShippingCarriers/AITLogo.png";
        public const string CampbellExpressImageUrl = "/images/ShippingCarriers/CampbellsLogo.png";
        public const string SJTransportationImageUrl = "/images/ShippingCarriers/SJTransLogo.png";
        public const string SRMTransportImageUrl = "/images/ShippingCarriers/SRMLogo.png";
        public const string TownRegionalImageUrl = "/images/ShippingCarriers/TowneRegLogo.png";
        public const string MainFreightShippingImageUrl = "/images/ShippingCarriers/NoShippingLogo.png";
        public const string ExpeditorsImageUrl = "/images/ShippingCarriers/Expeditors.png";
        public const string ForwardImageUrl = "/images/ShippingCarriers/NoShippingLogo.png";
        public const string SoutheasternImageUrl = "/images/ShippingCarriers/NoShippingLogo.png";
        public const string NoShippingImageUrl = "/images/ShippingCarriers/NoShippingLogo.png";
        public const string PittOhioImageUrl = NoShippingImageUrl;
        public const string SaiaImageUrl = NoShippingImageUrl;
        public const string ADPyleImageUrl = NoShippingImageUrl;
        public const string ConwayImageUrl = NoShippingImageUrl;
        public const string PilotLTLImageUrl = "/images/ShippingCarriers/PilotLogo.png";
        public const string AppleExpressImageUrl = "/images/ShippingCarriers/AppleExpress.png";
        public const string PuroImageUrl = "/images/ShippingCarriers/Purolator.png";
        public const string AndlaurTranspImageUrl = "/images/ShippingCarriers/AndlaurTransp.png";
        public const string HendersonImageUrl = "/images/ShippingCarriers/Henderson.png";
        public const string CustomerPickupImageUrl = "/images/ShippingCarriers/CustomerPickup.png";
        public const string TransplaceTrackImageUrl = NoShippingImageUrl;
        public const string WRDSImageUrl = NoShippingImageUrl;
        public const string AGSImageUrl = NoShippingImageUrl;
        public const string FSPImageUrl = NoShippingImageUrl;
        public const string USPSImageUrl = NoShippingImageUrl;

        #endregion

        #region "Carrier Codes"
        public const string FEDEX = "FEDEX";
        public const string UPS = "UPS";
        public const string CEVA = "CEVA";
        public const string AIT = "AIT";
        public const string CampbellExpress = "CAMPBELL";
        public const string SJTransportation = "SJ";
        public const string SRMTransport = "SRM";
        public const string TownRegional = "TOWNE";
        public const string PURO = "PURO";
        public const string NoCarrier = "NONE";
        public const string MainFreight = "MAINFREIGHT";
        public const string EXPEDITORS = "EXPEDITORS";
        public const string Forward = "FORWARD";
        public const string Southeastern = "SOUTHEASTERN";
        public const string PittOhio = "PITTOHIO";
        public const string Saia = "SAIA";
        public const string ADPyle = "ADPYLE";
        public const string Conway = "CONWAY";
        public const string PilotLTL = "PILOTLTL";
        public const string AppleExpress = "APPLEEXPRESS";
        public const string AndlaurTransp = "ANDLAURTRANSP";
        public const string CWHendersonGT = "CWHENDERSONGT";
        public const string CustomerPickup = "CUSTOMERPICKUP";
        public const string Transplace = "JX";
        public const string WRDS = "WRDS";
        public const string AGS = "AGS";
        public const string FSP = "FSP";
        public const string USPS = "USPS";

        #endregion

        #region "Carrier Name"
        public const string FEDEXExpressName = "FEDEX Express";
        public const string FEDEXGroundName = "FEDEX Ground";
        public const string UPSName = "UPS Carrier";
        public const string CEVAName = "CEVA Carrier";
        public const string AITName = "AIT Carrier";
        public const string CampbellExpressName = "Campbell Express";
        public const string SJTransportationName = "SJ Transportation";
        public const string SRMTransportName = "SRM Transport";
        public const string TownRegionalName = "Town Regional";
        public const string PUROName = "PURO Transport";
        public const string MainFreightName = "Mainfrieght LTL";
        public const string ExpeditorsName = "Expeditors";
        public const string ForwardName = "Forward LTL";
        public const string SoutheasternName = "Southeastern Freight";
        public const string PittOhioName = "Pitt-Ohio Express";
        public const string SaiaName = "Saia LTL";
        public const string ADPyleName = "A.Duie Pyle LTL";
        public const string ConwayName = "Con-way Freight LTL";
        public const string NoCarrierName = "";
        public const string PilotLTLName = "Pilot LTL";
        public const string AppleExpressName = "APPLE EXPRESS";
        public const string AndlaurTranspName = "ANDLAEUR TRANSP";
        public const string CWHendersonGTName = "CW HENDERSON GT";
        public const string CustomerPickupName = "CUSTOMER PICKUP";
        public const string TransplaceName = "Transplace";
        public const string WRDSName = "WRDS LTL Southern CA";
        public const string AGSName = "AGS";
        public const string FSPName = "FSP";
        public const string USPSName = "USPS";

        #endregion

        #region "Common constants"
        public const string NoCarrierError = "No carrier found.";
        public const string SetCarrierException = "Excpetion in CarrierUtility.SetCarrierInformation";
        public const string CarrierUtilityException = "Error : Exception in CarrierUtility";
        public const string Canada = "CANADA";
        public const string USA = "us";
        public const string Language = "language=";
        public const string English = "english";
        public const string Tracknumbers = "tracknumbers=";
        public const string InvalidCarrierAndTrackingName = "Invalid Carrier and Tracking Information from SAP.";
        public const string NoCarrierInfo = "No Tracking Id received from client";

        #endregion
    }
}
