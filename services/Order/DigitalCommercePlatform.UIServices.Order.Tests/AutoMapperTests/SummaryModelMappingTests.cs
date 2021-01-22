using DigitalCommercePlatform.UIService.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalFoundation.Common.MongoDb.Models;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.AutoMapperTests
{
    public class SummaryModelMappingTests : BaseTest
    {
        [Trait("Category", "Get Object")]
        [Trait("Category", "Data Mapping")]
        [Theory(DisplayName = "Map SummaryModel")]
        [MemberData(nameof(GetSource))]
        public void SummaryModelMapTest(SummaryDto source)
        {
            var target = GetMapper().Map<SummaryModel>(source);

            target.Should().NotBeNull().And.BeAssignableTo<SummaryModel>();
            SummaryModelTest(source, target);
        }

        public static TheoryData<SummaryDto> GetSource()
        {
            return new TheoryData<SummaryDto>
            {
                new SummaryDto
                    {
                        Contract = "Test Contact",
                        Created = new DateTime(2021, 01, 15),
                        Customer = new AddressPartyDto
                        {
                            ID = "123",
                            Name = "Customer One",
                            Address = new AddressDto
                            {
                                Name = "Adam",
                                ID = "2",
                                City = "Prague",
                                Email = "adam.rod@tester.cz"
                            },
                            Contact = new ContactDto
                            {
                                Email = "adam.rod@tester.cz",
                                Name = "Adam Contact",
                                Phone = string.Empty
                            }
                        },
                        CustomerPO = "Customer PO",
                        EndUserPO = "End User PO",
                        Payer = new PayerDto
                        {
                            ID = "23",
                            Name = "Payer Name"
                        },
                        PoDate = new DateTime(2021, 01, 20),
                        Price = (decimal?)3421.90,
                        Quote = new QuoteLinkDto
                        {
                            Group = "Group 1",
                            ID = "45",
                            Request = "Request One",
                            Revision = "Revision One",
                            SalesOrg = "AB",
                            SubRevision = "Subrevision one",
                            System = "App.Order",
                            TargetSystem = "App.Quote"
                        },
                        SalesArea = new ContactPartyDto
                        {
                            Contact = new ContactDto
                            {
                                Name = "Adam Contact",
                                Phone = "+345 89 098 90"
                            },
                            ID = "12",
                            Name = "Sales Area Contact"
                        },
                        SalesTeam = new ContactPartyDto
                        {
                            Contact = new ContactDto
                            {
                                Name = "Contact Team",
                                Phone = "+345 89 098 90"
                            },
                            ID = "12",
                            Name = "Sales Team Contact"
                        },
                        ShipTo = new AddressPartyDto
                        {
                            ID = "223",
                            Name = "Customer One",
                            Address = new AddressDto
                            {
                                Name = "Sam",
                                ID = "12",
                                City = "Prague",
                                Email = "sa,.rod@tester.cz"
                            },
                            Contact = new ContactDto
                            {
                                Email = "adam.rod@tester.cz",
                                Name = "Adam Contact",
                                Phone = string.Empty
                            }
                        },
                        Source = new Source
                        {
                            ID = "13",
                            SalesOrg = "AB",
                            System = "S12"
                        },
                        Status = Enums.Status.OPEN,
                        SuperSalesArea = new ContactPartyDto
                        {
                            Contact = new ContactDto
                            {
                                Name = "Super Sales Team",
                                Phone = "+345 89 098 10"
                            },
                            ID = "121",
                            Name = "Super Sales Contact"
                        }
                    }
            };
        }
    }
}