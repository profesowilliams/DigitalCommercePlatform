//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Tests.Actions.Common.Fixtures;
using Moq;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions.Order.DownloadInvoice.Handler
{
    public class InitDownloadInvoiceHandlerFixture : InitHandlerCommonPropertiesFixture
    {
        public int MockedDataSize = 32;
        public byte[] MockedPdfBinaryData { get; set; }

        public InitDownloadInvoiceHandlerFixture() : base()
        {
            MockedPdfBinaryData = new byte[MockedDataSize];

            MockOrderService.Setup(x => x.GetPdfInvoiceAsync(It.IsAny<string>()))
                .ReturnsAsync(MockedPdfBinaryData);

            MockOrderService.Setup(x => x.GetInvoicesFromOrderIdAsync(It.IsAny<string>()))
                .ReturnsAsync(new List<InvoiceModel>() { new InvoiceModel() { } });
        }
    }
}
