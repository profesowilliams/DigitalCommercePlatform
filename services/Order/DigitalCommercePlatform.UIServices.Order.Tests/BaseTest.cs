using AutoMapper;
using DigitalCommercePlatform.UIService.Order.AutoMapper;
using DigitalCommercePlatform.UIService.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.MongoDb.Models;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace DigitalCommercePlatform.UIService.Order.Tests
{
    public class BaseTest
    {
        protected IMapper GetMapper()
        {
            var mapperCfg = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<OrderProfile>();
                cfg.AddProfile<InvoiceProfile>();
            });

            return mapperCfg.CreateMapper();
        }

        protected Mock<IMiddleTierHttpClient> GetMiddleTierHttpClientMock()
        {
            return new Mock<IMiddleTierHttpClient>();
        }

        protected Mock<ILogger<T>> GetLoggerMock<T>()
        {
            return new Mock<ILogger<T>>();
        }

        #region Mapping Tests functions

        protected void AddressModelTest(AddressDto source, AddressModel target)
        {
            if (source is null)
            {
                target.Should().BeNull();
                return;
            }

            target.Contact.Should().Be(source.Contact);
            target.City.Should().Be(source.City);
            target.Country.Should().Be(source.Country);
            target.Email.Should().Be(source.Email);
            target.ID.Should().Be(source.ID);
            target.Line1.Should().Be(source.Line1);
            target.Line2.Should().Be(source.Line2);
            target.Line3.Should().Be(source.Line3);
            target.Name.Should().Be(source.Name);
            target.Phone.Should().Be(source.Phone);
            target.ZIP.Should().Be(source.ZIP);
        }

        protected void AddressPartyModelTest(AddressPartyDto source, AddressPartyModel target)
        {
            if (source is null)
            {
                target.Should().BeNull();
                return;
            }

            target.Should().NotBeNull();
            target.Name.Should().Be(source.Name);
            target.ID.Should().Be(source.ID);

            ContactModelTest(source.Contact, target.Contact);
        }

        protected void AgreementModelTest(AgreementDto source, AgreementModel target)
        {
            if (source is null)
            {
                target.Should().BeNull();
                return;
            }

            target.ID.Should().Be(source.ID);
            target.VendorID.Should().Be(source.VendorID);
            target.SelectionFlag.Should().Be(source.SelectionFlag);
        }

        protected void ContactModelTest(ContactDto source, ContactModel target)
        {
            if (source is null)
            {
                target.Should().BeNull();
                return;
            }

            target.Name.Should().Be(source.Name);
            target.Phone.Should().Be(source.Phone);
            target.Email.Should().Be(source.Email);
        }

        protected void ContactPartyModelTest(ContactPartyDto source, ContactPartyModel target)
        {
            if (source is null)
            {
                target.Should().BeNull();
                return;
            }

            target.Should().NotBeNull().And.BeAssignableTo<ContactPartyModel>();
            target.Name.Should().Be(source.Name);
            target.ID.Should().Be(source.ID);

            ContactModelTest(source.Contact, target.Contact);
        }

        protected void IdValueModelTest(IdValueDto source, IdValueModel target)
        {
            if (source is null)
            {
                target.Should().BeNull();
                return;
            }

            target.Should().NotBeNull().And.BeAssignableTo<IdValueModel>();
            target.ID.Should().Be(source.ID);
        }

        protected void QuoteLinkModelTest(QuoteLinkDto source, QuoteLinkModel target)
        {
            if (source is null)
            {
                target.Should().BeNull();
                return;
            }

            target.Should().NotBeNull().And.BeAssignableTo<QuoteLinkModel>();
            target.System.Should().Be(source.System);
            target.SalesOrg.Should().Be(source.SalesOrg);
            target.ID.Should().Be(source.ID);
            target.Group.Should().Be(source.Group);
            target.Revision.Should().Be(source.Revision);
            target.SubRevision.Should().Be(source.SubRevision);
            target.Request.Should().Be(source.Request);
            target.TargetSystem.Should().Be(source.TargetSystem);
        }

        protected void SalesOrderModelTest(SalesOrderDto source, SalesOrderModel target)
        {
            target.EndUserPO.Should().Be(source.EndUserPO);
            target.CustomerPO.Should().Be(source.CustomerPO);
            target.PoDate.Should().Be(source.PoDate);
            target.Contract.Should().Be(source.Contract);
            target.Price.Should().Be(source.Price);
            target.Contact.Should().Be(source.Contact);
            target.Currency.Should().Be(source.Currency);
            target.DocType.Should().Be(source.DocType);
            target.DocCategory.Should().Be(source.DocCategory);
            target.Creator.Should().Be(source.Creator);
            target.VendorSalesRep.Should().Be(source.VendorSalesRep);
            target.VendorSalesAssociate.Should().Be(source.VendorSalesAssociate);
            target.Created.Should().Be(source.Created);
            target.Updated.Should().Be(source.Updated);
            target.TDOSSearchable.Should().Be(source.TDOSSearchable);
            target.WorkflowId.Should().Be(source.WorkflowId);

            IdValueModelTest(source.Type, target.Type);
            IdValueModelTest(source.Level, target.Level);
            QuoteLinkModelTest(source.Quote, target.Quote);

            ContactPartyModelTest(source.SuperSalesArea, target.SuperSalesArea);
            ContactPartyModelTest(source.SalesArea, target.SalesArea);
            ContactPartyModelTest(source.SalesTeam, target.SalesTeam);

            target.Status.Should().Be(source.Status);
            target.BlockReason.Should().Be(source.BlockReason);
            target.ConfirmationStatus.Should().Be(source.ConfirmationStatus);
            target.DeliveryStatus.Should().Be(source.DeliveryStatus);
        }

        protected void SourceTest(Source source, Source target)
        {
            source.Equals(target).Should().BeTrue();
        }

        protected void SummaryModelTest(SummaryDto source, SummaryModel target)
        {
            if (source is null)
            {
                target.Should().BeNull();
                return;
            }

            target.CustomerPO.Should().Be(source.CustomerPO);
            target.EndUserPO.Should().Be(source.EndUserPO);
            target.Contract.Should().Be(source.Contract);
            target.Price.Should().Be(source.Price);
            target.Status.Should().Be(source.Status);
            target.Created.Should().Be(source.Created);
            target.Updated.Should().Be(source.Updated);
            target.PoDate.Should().Be(source.PoDate);

            SourceTest(source.Source, target.Source);

            ContactPartyModelTest(source.SuperSalesArea, target.SuperSalesArea);
            ContactPartyModelTest(source.SalesArea, target.SalesArea);
            ContactPartyModelTest(source.SalesTeam, target.SalesTeam);

            AddressPartyModelTest(source.Customer, target.Customer);
            AddressPartyModelTest(source.ShipTo, target.ShipTo);

            QuoteLinkModelTest(source.Quote, target.Quote);
        }

        #endregion Mapping Tests functions
    }
}