using AutoMapper;
using DigitalCommercePlatform.UIService.Order.DTO.Invoice;
using DigitalCommercePlatform.UIService.Order.DTO.Invoice.Internal;
using DigitalCommercePlatform.UIService.Order.Enums;
using DigitalCommercePlatform.UIService.Order.Models.Invoice;
using DigitalCommercePlatform.UIService.Order.Models.Invoice.Internal;
using System;

namespace DigitalCommercePlatform.UIService.Order.AutoMapper
{
    public class InvoiceProfile : Profile
    {
        public InvoiceProfile()
        {
            CreateMap<InvoiceAddressDto, InvoiceAddressModel>();
            CreateMap<InvoiceContactDto, InvoiceContactModel>();
            CreateMap<InvoiceOrderDto, InvoiceOrderModel>()
                .ForMember(d => d.WorkflowId, m => m.MapFrom(s => s.RequestNo));
            CreateMap<InvoicePartyDto, InvoicePartyModel>()
                .ForMember(d => d.Type, m => m.MapFrom(s => MapInvoicePartyType(s.Type)));
            CreateMap<InvoiceQuoteDto, InvoiceQuoteModel>();
            CreateMap<InvoiceDto, InvoiceModel>();
            CreateMap<FindInvoiceCriteriaModel, FindInvoiceCriteriaDto>()
                .ForMember(dest => dest.Sort, opt => opt.MapFrom(src => src.SortBy));
        }

        public static string MapInvoicePartyType(InvoicePartyType type)
        {
            return type switch
            {
                InvoicePartyType.CUSTOMER => "Customer",
                InvoicePartyType.SALESTEAM => "Sales_team3",
                _ => throw new NotImplementedException($"Not implemented {nameof(InvoicePartyType)}: {type}"),
            };
        }
    }
}