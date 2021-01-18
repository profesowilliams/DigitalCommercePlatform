using DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder.Internal;
using DigitalCommercePlatform.UIServices.Order.Models.SalesOrder.Internal;
using FluentAssertions;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.Tests.AutoMapperTests
{
    public class AddressModelMappingTests : MappingTests
    {
        [Trait("Category", "Get Object")]
        [Trait("Category", "Data Mapping")]
        [Theory(DisplayName = "Map AddressModel")]
        [MemberData(nameof(GetAddressDto))]
        public void AddressModelSuccessfullMapTest(AddressDto source)
        {
            var target = mapper.Map<AddressDto>(source);

            target.Should().NotBeNull().And.NotBeAssignableTo<AddressModel>();
            target.Contact.Should().BeEquivalentTo(source.Contact);
            target.City.Should().BeEquivalentTo(source.City);
            target.Country.Should().BeEquivalentTo(source.Country);
            target.Email.Should().BeEquivalentTo(source.Email);
            target.ID.Should().BeEquivalentTo(source.ID);
            target.Line1.Should().BeEquivalentTo(source.Line1);
            target.Line2.Should().BeEquivalentTo(source.Line2);
            target.Line3.Should().BeEquivalentTo(source.Line3);
            target.Name.Should().BeEquivalentTo(source.Name);
            target.Phone.Should().BeEquivalentTo(source.Phone);
            target.ZIP.Should().BeEquivalentTo(source.ZIP);
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
                }
            };
        }
    }
}