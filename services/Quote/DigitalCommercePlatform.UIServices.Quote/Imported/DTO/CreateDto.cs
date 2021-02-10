using DigitalFoundation.App.Services.Quote.DTO.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;


namespace DigitalFoundation.App.Services.Quote.DTO
{
    [ExcludeFromCodeCoverage]
    public class CreateDto
    {
        public string SalesOrg { get; set; }
        public string TargetSystem { get; set; }
        public string EndUserPo { get; set; }
        public string CustomerPo { get; set; }
        public TypeDto Type { get; set; }
        public LevelDto Level { get; set; }
        public string Creator { get; set; }
        public ShipToDto ShipTo { get; set; }
        public EndUserDto EndUser { get; set; }
        public VendorReferenceDto VendorReference { get; set; }
        public IEnumerable<Create.ItemDto> Items { get; set; }
        public IEnumerable<AgreementDto> Agreements { get; set; }
    }
}
