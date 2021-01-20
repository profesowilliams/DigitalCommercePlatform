using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder.Internal;
using DigitalCommercePlatform.UIServices.Order.Infrastructure.Contracts;
using DigitalCommercePlatform.UIServices.Order.Models.SalesOrder;
using DigitalCommercePlatform.UIServices.Order.Models.SalesOrder.Internal;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace DigitalCommercePlatform.UIServices.Order.Tests.ActionTests
{
    public class HandlerTests<T>
    {
        protected readonly IMapper mapper;
        protected readonly Mock<ILogger<T>> loggerMock;
        protected readonly Mock<IMiddleTierHttpClient> middleTierHttpClientMock;
        protected readonly IOptions<AppSettings> options;

        protected readonly string CoreOrderValue = "https://test-endpoint";

        public HandlerTests()
        {
            var mapperCfg = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<OrderProfile>();
            });

            mapper = mapperCfg.CreateMapper();
            loggerMock = new Mock<ILogger<T>>();
            middleTierHttpClientMock = new Mock<IMiddleTierHttpClient>();
            options = GetAppOptions();
        }

        private IOptions<AppSettings> GetAppOptions()
        {
            AppSettings settings = new AppSettings();
            settings.Configure(new Dictionary<string, string>
            {
                [AppConstants.CoreOrderKey] = CoreOrderValue
            });

            return Options.Create<AppSettings>(settings);
        }

        protected object GetPropertyAccessor(object instance, string memberName)
        {
            var pis = instance.GetType().GetProperty(memberName, BindingFlags.NonPublic | BindingFlags.Instance);
            return pis is null ? null : pis.GetValue(instance);
        }

        protected TDto GetObjectSource<TDto>(string filename)
        {
            FileInfo fi = new FileInfo(filename);
            if (!fi.Exists)
            {
                return default(TDto);
            }

            using var reader = new StreamReader(filename);
            var json = reader.ReadToEnd();
            return JsonConvert.DeserializeObject<TDto>(json);
        }

        protected void SourceTargetVerification(SalesOrderDto source, SalesOrderModel target)
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
    }
}