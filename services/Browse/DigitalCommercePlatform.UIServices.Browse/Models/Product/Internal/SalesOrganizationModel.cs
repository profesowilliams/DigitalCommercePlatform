using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Models.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class SalesOrganizationModel
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
        public ProductHierarchyModel ProductHierarchy { get; set; }
        public BusinessManagerModel BusinessManager { get; set; }
        public DirectorModel Director { get; set; }
        public DivisionManagerModel DivisionManager { get; set; }
        public MaterialStatusModel MaterialStatus { get; set; }
        public AccountAssignmentGroupModel AccountAssignmentGroup { get; set; }
    }
}