using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace DigitalCommercePlatform.UIServices.Browse.DTO
{
    public class SubMenu
    {
        //public string RediredctURL { get; set; }
        //public DateTime LastModified { get; set; }
        //public string Description { get; set; }
        //public string Title { get; set; }
        //public string Private { get; set; }
        //public string Parent { get; set; }
        //public string Image { get; set; }
        [JsonProperty("path")]
        public string path { get; set; }
        [JsonProperty("lastModified")]
        public string lastModified { get; set; }
        [JsonProperty("url")]
        public string url { get; set; }
        [JsonProperty("description")]
        public string description { get; set; }
        [JsonProperty("title")]
        public string title { get; set; }
        [JsonProperty("isprivate")]
        public string isprivate { get; set; }
        [JsonProperty("parent")]
        public string parent { get; set; }
        [JsonProperty("SubMenus1")]
        public Dictionary<string, object> SubMenus1 { get; set; }

        //[XmlElement("Menus")]
        //public List<SubMenu> SubMenus { get; set; }
        //public SubMenu()
        //{
        //    SubMenus = new List<SubMenu>();
        //}

        //public SubMenu()
        //{
        //    SubMenu newobj = new SubMenu();

        //    SubMenus1 = new Dictionary<string, object>();
        //}



        //public SubMenu[] subMenu { get; set; }
    }
}

//    public partial class Product
//    {
//        [JsonProperty("Computing")]
//        public List<Computing> Computing { get; set; }

//        [JsonProperty("Mobility & IoT")]
//        public List<AudioVisual> MobilityIoT { get; set; }

//        [JsonProperty("Data Center")]
//        public List<AudioVisual> DataCenter { get; set; }

//        [JsonProperty("Printers & Scanners")]
//        public List<AudioVisual> PrintersScanners { get; set; }

//        [JsonProperty("Software")]
//        public List<AudioVisual> Software { get; set; }

//        [JsonProperty("Networking")]
//        public List<AudioVisual> Networking { get; set; }

//        [JsonProperty("Components")]
//        public List<AudioVisual> Components { get; set; }

//        [JsonProperty("Audio Visual")]
//        public List<AudioVisual> AudioVisual { get; set; }

//        [JsonProperty("Supplies")]
//        public List<AudioVisual> Supplies { get; set; }

//        [JsonProperty("Warranties")]
//        public List<AudioVisual> Warranties { get; set; }

//        [JsonProperty("On Sale & Promos")]
//        public List<AudioVisual> OnSalePromos { get; set; }
//    }
//    public partial class Solution
//    {
//        [JsonProperty("Edge")]
//        public List<Edge> Edge { get; set; }

//        [JsonProperty("Datacenter & Cloud")]
//        public List<DatacenterCloud> DatacenterCloud { get; set; }

//        [JsonProperty("Data Lifecycle")]
//        public List<DataLifecycle> DataLifecycle { get; set; }

//        [JsonProperty("Security")]
//        public List<Security> Security { get; set; }

//        [JsonProperty("Networking & Communications")]
//        public List<NetworkingCommunication> NetworkingCommunications { get; set; }
//    }
//    public partial class Service
//    {
//        [JsonProperty("Global Lifecycle Management")]
//        public List<GlobalLifecycleManagement> GlobalLifecycleManagement { get; set; }

//        [JsonProperty("Digital Practice Builder")]
//        public List<DigitalPracticeBuilder> DigitalPracticeBuilder { get; set; }

//        [JsonProperty("Specialty Services")]
//        public List<SpecialtyService> SpecialtyServices { get; set; }
//    }
//    public partial class Brand
//    {
//        [JsonProperty("Featured")]
//        public List<Dictionary<string, List<AudioVisual>>> Featured { get; set; }

//        [JsonProperty("By Solution")]
//        public List<BySolution> BySolution { get; set; }

//        [JsonProperty("By Name")]
//        public List<Dictionary<string, List<AudioVisual>>> ByName { get; set; }
//    }
//    public partial class AboutUs
//    {
//        [JsonProperty("Our News")]
//        public List<OurNew> OurNews { get; set; }

//        [JsonProperty("Our Company")]
//        public List<OurCompany> OurCompany { get; set; }

//        [JsonProperty("Our Purpose")]
//        public List<OurPurpose> OurPurpose { get; set; }

//        [JsonProperty("Our Careers")]
//        public List<OurCareer> OurCareers { get; set; }
//    }

//    //Product Sub Classes 

//    public partial class Computing
//    {
//        [JsonProperty("Laptops")]
//        public List<AudioVisual> Laptops { get; set; }

//        [JsonProperty("Desktops")]
//        public List<AudioVisual> Desktops { get; set; }

//        [JsonProperty("Servers")]
//        public List<AudioVisual> Servers { get; set; }

//        [JsonProperty("Tablet & e-Books")]
//        public List<AudioVisual> TabletEBooks { get; set; }

//        [JsonProperty("Industrial Handhelds")]
//        public List<AudioVisual> IndustrialHandhelds { get; set; }

//        [JsonProperty("POS Systems")]
//        public List<AudioVisual> PosSystems { get; set; }

//        [JsonProperty("Warranties")]
//        public List<AudioVisual> Warranties { get; set; }

//        [JsonProperty("Configuration Services")]
//        public List<AudioVisual> ConfigurationServices { get; set; }

//        [JsonProperty("Deals & On Sale")]
//        public List<AudioVisual> DealsOnSale { get; set; }
//    }

//    //Solution SubClasses 

//    public partial class Edge
//    {
//        [JsonProperty("Modern Edge")]
//        public List<AudioVisual> ModernEdge { get; set; }

//        [JsonProperty("Visual Edge")]
//        public List<AudioVisual> VisualEdge { get; set; }

//        [JsonProperty("Mobile Edge")]
//        public List<AudioVisual> MobileEdge { get; set; }
//    }

//    public partial class DatacenterCloud
//    {
//        [JsonProperty("NextGen/SD DC")]
//        public List<AudioVisual> NextGenSdDc { get; set; }

//        [JsonProperty("Integration Layer")]
//        public List<AudioVisual> IntegrationLayer { get; set; }

//        [JsonProperty("Public Cloud")]
//        public List<AudioVisual> PublicCloud { get; set; }
//    }

//    public partial class DataLifecycle
//    {
//        [JsonProperty("Data Management")]
//        public List<AudioVisual> DataManagement { get; set; }

//        [JsonProperty("Artificial Intelligence")]
//        public List<AudioVisual> ArtificialIntelligence { get; set; }

//        [JsonProperty("Data Capture / IoT")]
//        public List<AudioVisual> DataCaptureIoT { get; set; }

//        [JsonProperty("Analytics")]
//        public List<AudioVisual> Analytics { get; set; }

//        [JsonProperty("Design Software")]
//        public List<AudioVisual> DesignSoftware { get; set; }

//        [JsonProperty("Business Integration & Application SW")]
//        public List<AudioVisual> BusinessIntegrationApplicationSw { get; set; }
//    }

//    public partial class Security
//    {
//        [JsonProperty("Security")]
//        public List<AudioVisual> SecuritySecurity { get; set; }
//    }

//    public partial class NetworkingCommunication
//    {
//        [JsonProperty("Networking")]
//        public List<AudioVisual> Networking { get; set; }

//        [JsonProperty("Unified Communications")]
//        public List<AudioVisual> UnifiedCommunications { get; set; }

//        [JsonProperty("Communications Management")]
//        public List<AudioVisual> CommunicationsManagement { get; set; }

//        [JsonProperty("Workplace Management & Collaboration")]
//        public List<AudioVisual> WorkplaceManagementCollaboration { get; set; }
//    }

//    public partial class GlobalLifecycleManagement
//    {
//        [JsonProperty("Supply Chain")]
//        public List<AudioVisual> SupplyChain { get; set; }

//        [JsonProperty("Integration")]
//        public List<AudioVisual> Integration { get; set; }

//        [JsonProperty("Deployment")]
//        public List<AudioVisual> Deployment { get; set; }

//        [JsonProperty("Maintenance & Support")]
//        public List<AudioVisual> MaintenanceSupport { get; set; }

//        [JsonProperty("Repair")]
//        public List<AudioVisual> Repair { get; set; }

//        [JsonProperty("IT Asset Disposition")]
//        public List<AudioVisual> ItAssetDisposition { get; set; }

//        [JsonProperty("Channel Management")]
//        public List<AudioVisual> ChannelManagement { get; set; }

//        [JsonProperty("Customer Success")]
//        public List<AudioVisual> CustomerSuccess { get; set; }

//        [JsonProperty("Certification & Training")]
//        public List<AudioVisual> CertificationTraining { get; set; }

//        [JsonProperty("Revenue Retention")]
//        public List<AudioVisual> RevenueRetention { get; set; }
//    }

//    public partial class DigitalPracticeBuilder
//    {
//        [JsonProperty("Business Strategy")]
//        public List<AudioVisual> BusinessStrategy { get; set; }

//        [JsonProperty("Engineering Strategy")]
//        public List<AudioVisual> EngineeringStrategy { get; set; }

//        [JsonProperty("Lifecycle Strategy")]
//        public List<AudioVisual> LifecycleStrategy { get; set; }

//        [JsonProperty("Marketing Strategy")]
//        public List<AudioVisual> MarketingStrategy { get; set; }

//        [JsonProperty("Operations Strategy")]
//        public List<AudioVisual> OperationsStrategy { get; set; }

//        [JsonProperty("Tech Data Community")]
//        public List<AudioVisual> TechDataCommunity { get; set; }

//        [JsonProperty("Sales Strategy")]
//        public List<AudioVisual> SalesStrategy { get; set; }

//        [JsonProperty("Finance Strategy")]
//        public List<AudioVisual> FinanceStrategy { get; set; }
//    }

//    public partial class SpecialtyService
//    {
//        [JsonProperty("Maverick")]
//        public List<AudioVisual> Maverick { get; set; }

//        [JsonProperty("Datech")]
//        public List<AudioVisual> Datech { get; set; }
//    }

//    //brand Sub Menu

//    public partial class Featured
//    {
//        [JsonProperty("View All Brands")]
//        public List<AudioVisual> ViewAllBrands { get; set; }

//        [JsonProperty("Apple")]
//        public List<AudioVisual> Apple { get; set; }

//        [JsonProperty("Cisco")]
//        public List<AudioVisual> Cisco { get; set; }

//        [JsonProperty("Dell")]
//        public List<AudioVisual> Dell { get; set; }

//        [JsonProperty("Google")]
//        public List<AudioVisual> Google { get; set; }

//        [JsonProperty("Hewlett Packard")]
//        public List<AudioVisual> HewlettPackard { get; set; }

//        [JsonProperty("IBM")]
//        public List<AudioVisual> IBM { get; set; }

//        [JsonProperty("Intel")]
//        public List<AudioVisual> Intel { get; set; }

//        [JsonProperty("Lenovo")]
//        public List<AudioVisual> Lenovo { get; set; }

//        [JsonProperty("LG")]
//        public List<AudioVisual> LG { get; set; }

//        [JsonProperty("Microsoft")]
//        public List<AudioVisual> Microsoft { get; set; }

//        [JsonProperty("Panasonic")]
//        public List<AudioVisual> Panasonic { get; set; }

//        [JsonProperty("Samsung")]
//        public List<AudioVisual> Samsung { get; set; }

//        [JsonProperty("Sharp")]
//        public List<AudioVisual> Sharp { get; set; }

//        [JsonProperty("Sony")]
//        public List<AudioVisual> Sony { get; set; }

//        [JsonProperty("VMware")]
//        public List<AudioVisual> VMware { get; set; }
//    }

//    public partial class BySolution
//    {
//        [JsonProperty("Edge")]
//        public List<AudioVisual> Edge { get; set; }

//        [JsonProperty("Data Lifecycle")]
//        public List<AudioVisual> DataLifecycle { get; set; }

//        [JsonProperty("Networking & Communication")]
//        public List<AudioVisual> NetworkingCommunication { get; set; }

//        [JsonProperty("Data Center & Cloud")]
//        public List<AudioVisual> DataCenterCloud { get; set; }

//        [JsonProperty("Security")]
//        public List<AudioVisual> Security { get; set; }
//    }

//    public partial class ByName
//    {

//    }

//}
