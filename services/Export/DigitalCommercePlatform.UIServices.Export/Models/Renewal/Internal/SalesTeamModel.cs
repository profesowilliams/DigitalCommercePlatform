//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Renewal.Internal
{
    [ExcludeFromCodeCoverage]
    public class SalesTeamModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ContactModel Contact { get; set; }
    }
}
