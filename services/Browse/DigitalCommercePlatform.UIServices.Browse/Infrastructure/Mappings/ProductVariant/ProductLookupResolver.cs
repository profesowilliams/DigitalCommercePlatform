//2022 (c) Tech Data Corporation - All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.ProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Models.ProductVariant;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings.ProductVariant
{
    public class ProductLookupResolver : IValueResolver<ProductVariantDto, ProductVariantModel, IEnumerable<ProductLookupModel>>
    {
        public IEnumerable<ProductLookupModel> Resolve(ProductVariantDto source, ProductVariantModel destination, IEnumerable<ProductLookupModel> member, ResolutionContext context)
        {
            var dict = new Dictionary<string, IEnumerable<string>>();
            foreach (var (attribute, attributeValue) in source.AttributeGroups
                .SelectMany(attributeGroup => attributeGroup.Attributes
                    .SelectMany(attribute => attribute.Values
                        .Select(attributeValue => (attribute, attributeValue)))))
            {
                var key = $"{attribute.Id}:{attributeValue.Id}";
                if (dict.ContainsKey(key))
                {
                    continue;
                }

                dict.Add(key, attributeValue.ProductIds);
            }

            return dict.Select(kvp => new ProductLookupModel { Key = kvp.Key, Value = kvp.Value });
        }
    }
}
