using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.DTO
{

    public class Menu
    {
        public string path { get; set; }
        public string lastModified { get; set; }
        public string url { get; set; }
        public string description { get; set; }
        public string title { get; set; }
        public string isprivate { get; set; }
        public string parent { get; set; }
        //public Array[] SubMenu { get; set; }
        public List<SubMenu> subMenu { get; set; }

        
        public Menu()
        {
            subMenu = new List<SubMenu>();
        }

    }

    //public partial class Menu
    //{
    //    [JsonProperty("Products")]
    //    public List<Product> Products { get; set; }

    //    [JsonProperty("Solutions")]
    //    public List<Solution> Solutions { get; set; }

    //    [JsonProperty("Services")]
    //    public List<Service> Services { get; set; }

    //    [JsonProperty("Brands")]
    //    public List<Brand> Brands { get; set; }

    //    [JsonProperty("About Us")]
    //    public List<AboutUs> AboutUs { get; set; }
    //}
}

    //public class Root
    //{
    //    [JsonProperty("Menu")]
    //    public Menu Menu { get; set; }
    //    //public List<Dictionary<string, object>> Data { get; set; }
    //}
    //public partial class Menu
    //{
    //    [JsonProperty("Products")]
    //    public List<Product> Products { get; set; }

    //    [JsonProperty("Solutions")]
    //    public List<Solution> Solutions { get; set; }

    //    [JsonProperty("Services")]
    //    public List<Service> Services { get; set; }

    //    [JsonProperty("Brands")]
    //    public List<Brand> Brands { get; set; }

    //    [JsonProperty("About Us")]
    //    public List<AboutUs> AboutUs { get; set; }
    //}

    //public partial class Product
    //{
    //    [JsonProperty("Computing")]
    //    public List<Computing> Computing { get; set; }

    //    [JsonProperty("Mobility & IoT")]
    //    public List<AudioVisual> MobilityIoT { get; set; }

    //    [JsonProperty("Data Center")]
    //    public List<AudioVisual> DataCenter { get; set; }

    //    [JsonProperty("Printers & Scanners")]
    //    public List<AudioVisual> PrintersScanners { get; set; }

    //    [JsonProperty("Software")]
    //    public List<AudioVisual> Software { get; set; }

    //    [JsonProperty("Networking")]
    //    public List<AudioVisual> Networking { get; set; }

    //    [JsonProperty("Components")]
    //    public List<AudioVisual> Components { get; set; }

    //    [JsonProperty("Audio Visual")]
    //    public List<AudioVisual> AudioVisual { get; set; }

    //    [JsonProperty("Supplies")]
    //    public List<AudioVisual> Supplies { get; set; }

    //    [JsonProperty("Warranties")]
    //    public List<AudioVisual> Warranties { get; set; }

    //    [JsonProperty("On Sale & Promos")]
    //    public List<AudioVisual> OnSalePromos { get; set; }
    //}

    //public partial class Computing
    //{
    //    [JsonProperty("Laptops")]
    //    public List<AudioVisual> Laptops { get; set; }

    //    [JsonProperty("Desktops")]
    //    public List<AudioVisual> Desktops { get; set; }

    //    [JsonProperty("Servers")]
    //    public List<AudioVisual> Servers { get; set; }

    //    [JsonProperty("Tablet & e-Books")]
    //    public List<AudioVisual> TabletEBooks { get; set; }

    //    [JsonProperty("Industrial Handhelds")]
    //    public List<AudioVisual> IndustrialHandhelds { get; set; }

    //    [JsonProperty("POS Systems")]
    //    public List<AudioVisual> PosSystems { get; set; }

    //    [JsonProperty("Warranties")]
    //    public List<AudioVisual> Warranties { get; set; }

    //    [JsonProperty("Configuration Services")]
    //    public List<AudioVisual> ConfigurationServices { get; set; }

    //    [JsonProperty("Deals & On Sale")]
    //    public List<AudioVisual> DealsOnSale { get; set; }
    //}

    //public partial class AudioVisual
    //{
    //    [JsonProperty("path")]
    //    public Path Path { get; set; }

    //    [JsonProperty("lastModified")]
    //    public string LastModified { get; set; }

    //    [JsonProperty("url")]
    //    public Url Url { get; set; }

    //    [JsonProperty("description")]
    //    public string Description { get; set; }

    //    [JsonProperty("title")]
    //    public string Title { get; set; }

    //    [JsonProperty("private")]
    //    //[JsonConverter()]
    //    public bool Private { get; set; }

    //    [JsonProperty("parent")]
    //    public Parent Parent { get; set; }
    //}

    //public enum Parent { AboutUs, Brands, Products, Services, Solutions };

    //public enum Path { ContentWeRetailLanguageMastersEnBrandsWomenCoats, ContentWeRetailLanguageMastersEnProductsWomenCoats, ContentWeRetailLanguageMastersEnServicesWomenCoats };

    //public enum Url { ContentWeRetailLanguageMastersEnBrandsWomenCoatsHtml, ContentWeRetailLanguageMastersEnProductsWomenCoatsHtml, ContentWeRetailLanguageMastersEnServicesWomenCoatsHtml };

//}
