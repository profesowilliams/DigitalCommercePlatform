using AutoMapper;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIService.Product.Dto.Summary;
using DigitalCommercePlatform.UIService.Product.Dto.Summary.Internal;
using DigitalCommercePlatform.UIService.Product.Models.Summary;
using DigitalCommercePlatform.UIService.Product.Models.Summary.Internal;

namespace DigitalCommercePlatform.UIService.Product.Infrastructure.Mappings
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