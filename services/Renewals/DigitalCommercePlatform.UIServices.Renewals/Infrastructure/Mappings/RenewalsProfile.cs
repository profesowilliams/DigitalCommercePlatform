using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewals.Models;
using System;

namespace DigitalCommercePlatform.UIServices.Renewals.Infrastructure.Mappings
{
    public class RenewalsProfile : Profile
    {
        public RenewalsProfile()
        {
            CreateMap<Renewal, Renewal>()
                .ForMember(dest => dest.RenewalId, opt => opt.MapFrom(src => src.RenewalId))
                .ForMember(dest => dest.FormatedPrice, opt => opt.MapFrom(src => String.Format("{0:C}", src.Price)))
                .ForMember(dest => dest.FormatedTotalPrice, opt => opt.MapFrom(src => String.Format("{0:C}", src.TotalPrice)))
                ;

        }
    }
}