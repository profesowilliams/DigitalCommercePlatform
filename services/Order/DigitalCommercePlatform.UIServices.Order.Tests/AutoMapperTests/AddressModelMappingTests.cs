using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal;
using FluentAssertions;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.AutoMapperTests
{
    public class AddressModelMappingTests : BaseTest
    {
        [Trait("Category", "Get Object")]
        [Trait("Category", "Data Mapping")]
        [Theory(DisplayName = "Map AddressModel")]
        [MemberData(nameof(GetAddressDto))]
        public void AddressModelSuccessfullMapTest(AddressDto source)
        {
            var target = GetMapper().Map<AddressModel>(source);

            target.Should().NotBeNull().And.BeAssignableTo<AddressModel>();
            AddressModelTest(source, target);
        }

        public static TheoryData<AddressDto> GetAddressDto()
        {
            return new TheoryData<AddressDto>()
            {
                new AddressDto
                {
                    City = "Prague",
                    Contact = "Lukaš Páměk",
                    Country = "Czech",
                    Email = "test@hotdog.cz",
                    ID = "10909",
                    Line1 = "12/7890 Street 1",
                    Name = "Lukaš",
                    Phone = "+420 451 657 90",
                    ZIP = "13000"
                },
                new AddressDto
                {
                    Contact = "Lukaš Páměk",
                    Country = "Czech",
                    Email = "test@hotdog.cz",
                    ID = "10909",
                    Line1 = "12/7890 Street 1",
                    Name = "Lukaš"
                },
                new AddressDto
                {
                    City = "Prague",
                    Contact = "Lukaš Páměk",
                    Country = "Czech",
                    Email = null,
                    ID = "10909",
                    Line1 = string.Empty,
                    Name = null,
                    Phone = "+420 451 657 90",
                    ZIP = "13000"
                }
            };
        }
    }
}