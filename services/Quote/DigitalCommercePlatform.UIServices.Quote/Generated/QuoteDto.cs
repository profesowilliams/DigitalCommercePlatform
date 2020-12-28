using System;

namespace DigitalCommercePlatform.UIServices.Quote.Generated
{
    public class QuoteDto
    {
        public DateTime published { get; set; }
        public Source source { get; set; }
        public int revision { get; set; }
        public int subRevision { get; set; }
        public object description { get; set; }
        public string activeFlag { get; set; }
        public object request { get; set; }
        public string endUserPO { get; set; }
        public string customerPO { get; set; }
        public float price { get; set; }
        public string currency { get; set; }
        public string documentType { get; set; }
        public Type type { get; set; }
        public Level level { get; set; }
        public string creator { get; set; }
        public DateTime created { get; set; }
        public DateTime updated { get; set; }
        public DateTime expiry { get; set; }
        public string status { get; set; }
        public string statusNotes { get; set; }
        public Reseller reseller { get; set; }
        public Shipto shipTo { get; set; }
        public Enduser endUser { get; set; }
        public Vendorsalesrep vendorSalesRep { get; set; }
        public object vendorSalesAssociate { get; set; }
        public object salesTeam { get; set; }
        public Salesarea salesArea { get; set; }
        public Supersalesarea superSalesArea { get; set; }
        public object lastUpdatedBy { get; set; }
        public object[] orders { get; set; }
        public object[] vendorReference { get; set; }
        public Item[] items { get; set; }
        public object[] agreements { get; set; }
    }

    public class Source
    {
        public string id { get; set; }
        public string system { get; set; }
        public string salesOrg { get; set; }
        public object targetSystem { get; set; }
        public object key { get; set; }
    }

    public class Type
    {
        public string id { get; set; }
        public object value { get; set; }
    }

    public class Level
    {
        public string id { get; set; }
        public string value { get; set; }
    }

    public class Reseller
    {
        public string id { get; set; }
        public object name { get; set; }
        public object contact { get; set; }
        public object address { get; set; }
    }

    public class Shipto
    {
        public string id { get; set; }
        public object name { get; set; }
        public object contact { get; set; }
        public object address { get; set; }
    }

    public class Enduser
    {
        public object id { get; set; }
        public object name { get; set; }
        public Contact contact { get; set; }
        public object address { get; set; }
    }

    public class Contact
    {
        public object name { get; set; }
        public object email { get; set; }
        public object phone { get; set; }
    }

    public class Vendorsalesrep
    {
        public object id { get; set; }
        public object name { get; set; }
    }

    public class Salesarea
    {
        public string id { get; set; }
        public string name { get; set; }
        public Contact1 contact { get; set; }
    }

    public class Contact1
    {
        public string name { get; set; }
        public object email { get; set; }
        public object phone { get; set; }
    }

    public class Supersalesarea
    {
        public string id { get; set; }
        public string name { get; set; }
        public Contact2 contact { get; set; }
    }

    public class Contact2
    {
        public string name { get; set; }
        public object email { get; set; }
        public object phone { get; set; }
    }

    public class Item
    {
        public string id { get; set; }
        public object group { get; set; }
        public object solution { get; set; }
        public object parent { get; set; }
        public Product[] product { get; set; }
        public float quantity { get; set; }
        public float confirmedQuantity { get; set; }
        public string contractNumber { get; set; }
        public string contractType { get; set; }
        public string license { get; set; }
        public Reference[] references { get; set; }
        public object status { get; set; }
        public object statusNotes { get; set; }
        public DateTime updated { get; set; }
        public int unitPrice { get; set; }
        public int unitCost { get; set; }
        public int totalPrice { get; set; }
        public int unitListPrice { get; set; }
        public int extendedListPrice { get; set; }
        public Margin[] margins { get; set; }
        public DateTime requested { get; set; }
        public object shippingCondition { get; set; }
        public object shipFrom { get; set; }
        public object endUser { get; set; }
        public object director { get; set; }
        public object divisionManager { get; set; }
        public object businessManager { get; set; }
    }

    public class Product
    {
        public object type { get; set; }
        public string id { get; set; }
        public object name { get; set; }
        public object manufacturer { get; set; }
        public object localManufacturer { get; set; }
        public object classification { get; set; }
    }

    public class Reference
    {
        public string type { get; set; }
        public string value { get; set; }
    }

    public class Margin
    {
        public int typeMargin { get; set; }
        public float amount { get; set; }
        public float percent { get; set; }
    }
}
