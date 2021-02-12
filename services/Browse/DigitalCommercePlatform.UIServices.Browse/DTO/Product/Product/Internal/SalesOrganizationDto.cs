using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class SalesOrganizationDto
    {
        public string Id { get; set; }
        public List<string> Territories { get; set; }
        public string MaterialStatusValidFrom { get; set; }
        public string ItemCategoryGroup { get; set; }
        public string MaterialGroupPricing { get; set; }
        public string OldArticleNumber { get; set; }
        public string PurchasingNotice { get; set; }
        public string SalesNotice { get; set; }
        public string ServiceId { get; set; }
        public string LocalManufacturer { get; set; }
        public ProductHierarchyDto ProductHierarchy { get; set; }
        public BusinessManagerDto BusinessManager { get; set; }
        public DirectorDto Director { get; set; }
        public DivisionManagerDto DivisionManager { get; set; }
        public MaterialStatusDto MaterialStatus { get; set; }
        public AccountAssignmentGroupDto AccountAssignmentGroup { get; set; }
    }
}