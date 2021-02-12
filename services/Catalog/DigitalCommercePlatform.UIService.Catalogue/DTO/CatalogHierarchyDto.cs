using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using MongoDB.Bson.Serialization.Attributes;
using DigitalFoundation.Common.MongoDb.Models;
using DigitalFoundation.Common.MongoDb.Entities;
using DigitalCommercePlatform.UIService.Catalogue.DTO.Internal;

namespace DigitalCommercePlatform.UIService.Catalogue.DTO
{
    [ExcludeFromCodeCoverage]
    [BsonDiscriminator("Catalog.Hierarchy")]
    [BsonIgnoreExtraElements]
    public class CatalogHierarchyDto : MongoDbEntityBase
    {
        public Source Source { get; set; }
        public Dictionary<string, List<NodeDto>> Localizations { get; set; }

        public DateTime Updated { get; set; }
        public DateTime Published { get; set; }
    }
}
