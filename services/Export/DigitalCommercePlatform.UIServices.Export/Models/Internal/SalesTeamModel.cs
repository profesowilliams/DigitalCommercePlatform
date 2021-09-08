//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class SalesTeamModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ContactModel Contact { get; set; }
    }
}
