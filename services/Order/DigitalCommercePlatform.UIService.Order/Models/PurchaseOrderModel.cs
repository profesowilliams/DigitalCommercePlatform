using DigitalFoundation.Common.MongoDb.Entities;
using DigitalFoundation.Common.MongoDb.Models;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Order.Models
{
    public sealed class PurchaseOrderModel
    {
        public class Item
        {
            public string ID { get; set; }
            public string Parent { get; set; }
            public List<String> Product { get; set; }
            public String Name { get; set; }
            public int? Quantity { get; set; }
            public Decimal? TotalPrice { get; set; }
            public Decimal? UnitPrice { get; set; }
            public List<OrderLink> SalesOrder { get; set; }
            public DateTime? Updated { get; set; }
        }

        public class OrderLink
        {
            public String ID { get; set; }
            public String AltID { get; set; }
            public String Line { get; set; }
        }

        [BsonDiscriminator("Order.Purchase")]
        [BsonIgnoreExtraElements]
        public class PurchaseModel : MongoDbEntityBase
        {
            public Source Source { get; set; }
            public String Vendor { get; set; }
            public List<Item> Items { get; set; }
            public DateTime? Created { get; set; }
            public DateTime? Updated { get; set; }
        }

        public class Summary
        {
            public Source Source { get; set; }
            public String Vendor { get; set; }
            public DateTime? Created { get; set; }
            public DateTime? Updated { get; set; }

            public Summary(PurchaseModel pModel)
            {
                if (pModel == null)
                {
                    throw new ArgumentNullException(nameof(pModel));
                }
                Source = pModel.Source;
                Vendor = pModel.Vendor;
                Created = pModel.Created;
                Updated = pModel.Updated;
            }
        }

        public class FindModel
        {
            public DateTime? CreatedFrom { get; set; }
            public DateTime? CreatedTo { get; set; }
            public DateTime? UpdatedFrom { get; set; }
            public DateTime? UpdatedTo { get; set; }
            public int Skip { get; set; }
            public int Count { get; set; } = 50;
        }
    }
}