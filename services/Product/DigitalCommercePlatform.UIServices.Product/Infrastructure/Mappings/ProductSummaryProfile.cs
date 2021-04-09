using AutoMapper;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Product.Dto.Summary;
using DigitalCommercePlatform.UIServices.Product.Dto.Summary.Internal;
using DigitalCommercePlatform.UIServices.Product.Models.Summary;
using DigitalCommercePlatform.UIServices.Product.Models.Summary.Internal;

namespace DigitalCommercePlatform.UIServices.Product.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class ProductSummaryProfile : Profile
    {
        public ProductSummaryProfile()
        {
            CreateMap<MaterialProfileDto, MaterialProfileModel>();
            CreateMap<PlantDto, PlantModel>();
            CreateMap<SalesOrganizationDto, SalesOrganizationModel>();
            CreateMap<SourceDto, SourceModel>();
            CreateMap<VendorDto, VendorModel>();
            CreateMap<SummaryDto, SummaryModel>();
        }
    }
}