
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Models
{
    public class Cart1
    {

    }

    

public class Rootobject
    {
        public Source source { get; set; }
        public bool Default { get; set; }
        public string customerNo { get; set; }
        public string userId { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public Line[] lines { get; set; }
        public int numberOfLines { get; set; }
        public float totalQuantity { get; set; }
        public string currency { get; set; }
        public string status { get; set; }
        public DateTime expireDate { get; set; }
        public DateTime syncDate { get; set; }
    }

    public class Source
    {
        public string id { get; set; }
        public string salesOrg { get; set; }
        public string system { get; set; }
    }

    public class Line
    {
        public string lineNo { get; set; }
        public string productId { get; set; }
        public float quantity { get; set; }
        public string uan { get; set; }
        public object type { get; set; }
        public Extensionproperty[] extensionProperties { get; set; }
    }

    public class Extensionproperty
    {
        public string propertyName { get; set; }
        public string value { get; set; }
    }
}
