using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal;
using FluentAssertions;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.AutoMapperTests
{
    public class AgreementModelMappingTests : BaseTest
    {
        [Trait("Category", "Get Object")]
        [Trait("Category", "Data Mapping")]
        [Theory(DisplayName = "Map AgreementModel")]
        [MemberData(nameof(GetDto))]
        public void AgreementModelSuccessfullMapTest(AgreementDto source)
        {
            var target = GetMapper().Map<AgreementModel>(source);

            target.Should().NotBeNull().And.BeAssignableTo<AgreementModel>();
            AgreementModelTest(source, target);
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
                    ID = null,
                    SelectionFlag = "ReadOnly",
                    VendorID = "12345"
                },
                new AgreementDto
                {
                    ID = "10000",
                    SelectionFlag = "Admin",
                    VendorID = string.Empty
                },
                new AgreementDto
                {
                    VendorID = string.Empty
                }
            };
        }
    }
}