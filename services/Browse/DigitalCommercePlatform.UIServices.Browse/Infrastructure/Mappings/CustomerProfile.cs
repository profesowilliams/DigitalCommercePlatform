using AutoMapper;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIService.Browse.DTO.Customer;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            CreateMap<CustomerDto, CustomerModel>();
            CreateMap<AddressDto, AddressModel>();
            CreateMap<CarrierAccountNumberDto, CarrierAccountNumberModel>();
            CreateMap<ClassificationDto, ClassificationModel>();
            CreateMap<CompanyDto, CompanyModel>();
            CreateMap<CreditDto, CreditModel>();
            CreateMap<FloorplannerDto, FloorplannerModel>();
            CreateMap<FreightDto, FreightModel>();
            CreateMap<SalesAreaDto, SalesAreaModel>();
            CreateMap<SalesDivisionDto, SalesDivisionModel>();
            CreateMap<SalesStructureDto, SalesStructureModel>();
            CreateMap<SourceRelDto, SourceRelModel>();
            CreateMap<SuperSalesAreaDto, SuperSalesAreaModel>();
            CreateMap<TaxCertificateDto, TaxCertificateModel>();
            CreateMap<TeamDto, TeamModel>();

            CreateMap<FindCriteriaModel, FindCriteriaDto>();




            CreateMap<CustomerModel, GetCustomerHandler.GetCustomerResponse>()
               .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.Source.ID));
        }
    }
}
