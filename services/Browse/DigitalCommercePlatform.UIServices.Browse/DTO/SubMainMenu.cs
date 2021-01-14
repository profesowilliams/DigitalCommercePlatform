using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.DTO
{
    public class SubMainMenu
    {

    }

    public class Product
    {
        public List<Computing> Computing { get; set; }
        [JsonProperty("Mobility&IoT")]
        public List<MobilityIoT> MobilityIoT { get; set; }
        public List<DataCenter> DataCenter { get; set; }
        [JsonProperty("Printers&Scanners")]
        public List<PrintersScanner> PrintersScanners { get; set; }
        public List<Software> Software { get; set; }
        public List<Networking> Networking { get; set; }
        public List<Component> Components { get; set; }
        public List<AudioVisual> AudioVisual { get; set; }
        public List<Supply> Supplies { get; set; }
        public List<Warranty2> Warranties { get; set; }
        [JsonProperty("OnSale&Promos")]
        public List<OnSalePromo> OnSalePromos { get; set; }
    }




    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse); 
    public class Laptop
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Desktop
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Server
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class TabletEBook
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class IndustrialHandheld
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class POSSystem
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Warranty
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class ConfigurationService
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class DealsOnSale
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Computing
    {
        public List<Laptop> Laptops { get; set; }
        public List<Desktop> Desktops { get; set; }
        public List<Server> Servers { get; set; }
        [JsonProperty("Tablet&e-Books")]
        public List<TabletEBook> TabletEBooks { get; set; }
        public List<IndustrialHandheld> IndustrialHandhelds { get; set; }
        public List<POSSystem> POSSystems { get; set; }
        public List<Warranty> Warranties { get; set; }
        public List<ConfigurationService> ConfigurationServices { get; set; }
        [JsonProperty("Deals&OnSale")]
        public List<DealsOnSale> DealsOnSale { get; set; }
    }

    public class MobilityIoT
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class DataCenter
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class PrintersScanner
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Software
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Networking
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Component
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class AudioVisual
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Supply
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Warranty2
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class OnSalePromo
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }


    public class ModernEdge
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class VisualEdge
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class MobileEdge
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Edge
    {
        public List<ModernEdge> ModernEdge { get; set; }
        public List<VisualEdge> VisualEdge { get; set; }
        public List<MobileEdge> MobileEdge { get; set; }
    }

    public class NextGenSDDC
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class IntegrationLayer
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class PublicCloud
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class DatacenterCloud
    {
        [JsonProperty("NextGen/SDDC")]
        public List<NextGenSDDC> NextGenSDDC { get; set; }
        public List<IntegrationLayer> IntegrationLayer { get; set; }
        public List<PublicCloud> PublicCloud { get; set; }
    }

    public class DataManagement
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class ArtificialIntelligence
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class DataCaptureIoT
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Analytic
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class DesignSoftware
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class BusinessIntegrationApplicationSW
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class DataLifecycle
    {
        public List<DataManagement> DataManagement { get; set; }
        public List<ArtificialIntelligence> ArtificialIntelligence { get; set; }
        [JsonProperty("DataCapture/IoT")]
        public List<DataCaptureIoT> DataCaptureIoT { get; set; }
        public List<Analytic> Analytics { get; set; }
        public List<DesignSoftware> DesignSoftware { get; set; }
        [JsonProperty("BusinessIntegration&ApplicationSW")]
        public List<BusinessIntegrationApplicationSW> BusinessIntegrationApplicationSW { get; set; }
    }

    public class SubSecurity
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Security
    {
        public List<Security> SubSecurity { get; set; }
    }

    public class Networking2
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class UnifiedCommunication
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class CommunicationsManagement
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class WorkplaceManagementCollaboration
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class NetworkingCommunication
    {
        public List<Networking2> Networking { get; set; }
        public List<UnifiedCommunication> UnifiedCommunications { get; set; }
        public List<CommunicationsManagement> CommunicationsManagement { get; set; }
        [JsonProperty("WorkplaceManagement&Collaboration")]
        public List<WorkplaceManagementCollaboration> WorkplaceManagementCollaboration { get; set; }
    }

    public class Solution
    {
        public List<Edge> Edge { get; set; }
        [JsonProperty("Datacenter&Cloud")]
        public List<DatacenterCloud> DatacenterCloud { get; set; }
        public List<DataLifecycle> DataLifecycle { get; set; }
        public List<Security> Security { get; set; }
        [JsonProperty("Networking&Communications")]
        public List<NetworkingCommunication> NetworkingCommunications { get; set; }
    }

    public class SupplyChain
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Integration
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Deployment
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class MaintenanceSupport
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Repair
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class ITAssetDisposition
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class ChannelManagement
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class CustomerSuccess
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class CertificationTraining
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class RevenueRetention
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class GlobalLifecycleManagement
    {
        public List<SupplyChain> SupplyChain { get; set; }
        public List<Integration> Integration { get; set; }
        public List<Deployment> Deployment { get; set; }
        [JsonProperty("Maintenance&Support")]
        public List<MaintenanceSupport> MaintenanceSupport { get; set; }
        public List<Repair> Repair { get; set; }
        public List<ITAssetDisposition> ITAssetDisposition { get; set; }
        public List<ChannelManagement> ChannelManagement { get; set; }
        public List<CustomerSuccess> CustomerSuccess { get; set; }
        [JsonProperty("Certification&Training")]
        public List<CertificationTraining> CertificationTraining { get; set; }
        public List<RevenueRetention> RevenueRetention { get; set; }
    }

    public class BusinessStrategy
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class EngineeringStrategy
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class LifecycleStrategy
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class MarketingStrategy
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class OperationsStrategy
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class TechDataCommunity
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class SalesStrategy
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class FinanceStrategy
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class DigitalPracticeBuilder
    {
        public List<BusinessStrategy> BusinessStrategy { get; set; }
        public List<EngineeringStrategy> EngineeringStrategy { get; set; }
        public List<LifecycleStrategy> LifecycleStrategy { get; set; }
        public List<MarketingStrategy> MarketingStrategy { get; set; }
        public List<OperationsStrategy> OperationsStrategy { get; set; }
        public List<TechDataCommunity> TechDataCommunity { get; set; }
        public List<SalesStrategy> SalesStrategy { get; set; }
        public List<FinanceStrategy> FinanceStrategy { get; set; }
    }

    public class Maverick
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Datech
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class SpecialtyService
    {
        public List<Maverick> Maverick { get; set; }
        public List<Datech> Datech { get; set; }
    }

    public class Service
    {
        public List<GlobalLifecycleManagement> GlobalLifecycleManagement { get; set; }
        public List<DigitalPracticeBuilder> DigitalPracticeBuilder { get; set; }
        public List<SpecialtyService> SpecialtyServices { get; set; }
    }

    public class ViewAllBrand
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Apple
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Cisco
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Dell
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Google
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class HewlettPackard
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class IBM
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Intel
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Lenovo
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class LG
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Microsoft
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Panasonic
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Samsung
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Sharp
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Sony
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class VMware
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Featured
    {
        public List<ViewAllBrand> ViewAllBrands { get; set; }
        public List<Apple> Apple { get; set; }
        public List<Cisco> Cisco { get; set; }
        public List<Dell> Dell { get; set; }
        public List<Google> Google { get; set; }
        public List<HewlettPackard> HewlettPackard { get; set; }
        public List<IBM> IBM { get; set; }
        public List<Intel> Intel { get; set; }
        public List<Lenovo> Lenovo { get; set; }
        public List<LG> LG { get; set; }
        public List<Microsoft> Microsoft { get; set; }
        public List<Panasonic> Panasonic { get; set; }
        public List<Samsung> Samsung { get; set; }
        public List<Sharp> Sharp { get; set; }
        public List<Sony> Sony { get; set; }
        public List<VMware> VMware { get; set; }
    }

    public class Edge2
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class DataLifecycle2
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class NetworkingCommunication2
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class DataCenterCloud2
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Security3
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class BySolution
    {
        public List<Edge2> Edge { get; set; }
        public List<DataLifecycle2> DataLifecycle { get; set; }
        [JsonProperty("Networking&Communications")]
        public List<NetworkingCommunication2> NetworkingCommunications { get; set; }
        [JsonProperty("DataCenter&Cloud")]
        public List<DataCenterCloud2> DataCenterCloud { get; set; }
        public List<Security3> Security { get; set; }
    }

    public class ViewAllBrand2
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class ByName09
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class AE
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class FJ
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class KO
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class PT
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class UZ
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class ByName
    {
        public List<ViewAllBrand2> ViewAllBrands { get; set; }
        [JsonProperty("0-9")]
        public List<ByName09> ByName09 { get; set; }
        [JsonProperty("A-E")]
        public List<AE> AE { get; set; }
        [JsonProperty("F-J")]
        public List<FJ> FJ { get; set; }
        [JsonProperty("K-O")]
        public List<KO> KO { get; set; }
        [JsonProperty("P-T")]
        public List<PT> PT { get; set; }
        [JsonProperty("U-Z")]
        public List<UZ> UZ { get; set; }
    }

    public class Brand
    {
        public List<Featured> Featured { get; set; }
        public List<BySolution> BySolution { get; set; }
        public List<ByName> ByName { get; set; }
    }

    public class Blog
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class MediaContact
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class NewsReleas
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class RecentNew
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Award
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class OurNew
    {
        public List<Blog> Blog { get; set; }
        public List<MediaContact> MediaContact { get; set; }
        public List<NewsReleas> NewsReleases { get; set; }
        public List<RecentNew> RecentNews { get; set; }
        public List<Award> Awards { get; set; }
    }

    public class WhatWeDo
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class WhoWeAre
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class HowWeOperate
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class WhereWeAre
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class OurCompany
    {
        public List<WhatWeDo> WhatWeDo { get; set; }
        public List<WhoWeAre> WhoWeAre { get; set; }
        public List<HowWeOperate> HowWeOperate { get; set; }
        public List<WhereWeAre> WhereWeAre { get; set; }
    }

    public class Person
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Planet
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class Progress
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class OurPurpose
    {
        public List<Person> People { get; set; }
        public List<Planet> Planet { get; set; }
        public List<Progress> Progress { get; set; }
    }

    public class HowweHire
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class ARewardingExperience
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class JoinOurTeam
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class LifeatTechData
    {
        public string path { get; set; }
        public long lastModified { get; set; }
        public string url { get; set; }
        public object description { get; set; }
        public string title { get; set; }
        public string @private { get; set; }
        public string parent { get; set; }
    }

    public class OurCareer
    {
        public List<HowweHire> HowweHire { get; set; }
        public List<ARewardingExperience> ARewardingExperience { get; set; }
        public List<JoinOurTeam> JoinOurTeam { get; set; }
        public List<LifeatTechData> LifeatTechData { get; set; }
    }

    public class AboutUs
    {
        public List<OurNew> OurNews { get; set; }
        public List<OurCompany> OurCompany { get; set; }
        public List<OurPurpose> OurPurpose { get; set; }
        public List<OurCareer> OurCareers { get; set; }
    }


}
