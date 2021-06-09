using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Configuration.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class PunchInModel
    {
        public string PostBackURL { get; set; } 
        public string FunctionName { get; set; } 
        public string ActionName { get; set; }        
        public string IdValue { get; set; }
        public string UserId { get; set; } 
        public string SalesOrg { get; set; } 
        public string VendorName { get; set; } 
        public string DefaultOrdering { get; set; } 
    }
}