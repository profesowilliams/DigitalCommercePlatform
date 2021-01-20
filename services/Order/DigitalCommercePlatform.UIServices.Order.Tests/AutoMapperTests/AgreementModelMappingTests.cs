using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal;
using FluentAssertions;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.AutoMapperTests
{
    public class AgreementModelMappingTests : MappingTests
    {
        [Trait("Category", "Get Object")]
        [Trait("Category", "Data Mapping")]
        [Theory(DisplayName = "Map AgreementModel")]
        [MemberData(nameof(GetDto))]
        public void AgreementModelSuccessfullMapTest(AgreementDto source)
        {
            var target = mapper.Map<AgreementDto>(source);

            target.Should().NotBeNull().And.NotBeAssignableTo<AgreementModel>();
            target.SelectionFlag.Should().BeEquivalentTo(source.SelectionFlag);
            target.VendorID.Should().BeEquivalentTo(source.VendorID);
            target.ID.Should().BeEquivalentTo(source.ID);
        }

        public static TheoryData<AgreementDto> GetDto()
        {
            return new TheoryData<AgreementDto>()
            {
                new AgreementDto
                {
                    ID = "10909",
                    SelectionFlag = "Flag",
                    VendorID = "17890"
                },
                new AgreementDto
                {
                    ID = "10910",
                    SelectionFlag = "ReadOnly",
                    VendorID = "12345"
                },
                new AgreementDto
                {
                    ID = "10000",
                    SelectionFlag = "Admin",
                    VendorID = string.Empty
                }
            };
        }
    }
}