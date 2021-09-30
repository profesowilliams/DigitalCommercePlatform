//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class SalesOrganizationDto
    {
        public string Id { get; set; }
        public List<string> Territory { get; set; }
        public string MaterialStatusValidFrom { get; set; }
        public string ItemCategoryGroup { get; set; }
        public string MaterialGroupPricing { get; set; }
        public string OldArticleNumber { get; set; }
        public string ServiceId { get; set; }
        public string LocalManufacturer { get; set; }
        public ProductHierarchyDto ProductHierarchy { get; set; }
        public BusinessManagerDto BusinessManager { get; set; }
        public DirectorDto Director { get; set; }
        public DivisionManagerDto DivisionManager { get; set; }
        public MaterialStatusDto MaterialStatus { get; set; }
        public AccountAssignmentGroupDto AccountAssignmentGroup { get; set; }
        public List<ProductNoteDto> ProductNotes { get; set; }
        public string DeliveryPlant { get; set; }
        public IEnumerable<PropertyDto> Properties { get; set; }
    }
}
