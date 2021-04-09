using AutoMapper;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIService.Browse.DTO.Catalog;
using DigitalCommercePlatform.UIService.Browse.Models.Catalog;
using DigitalCommercePlatform.UIService.Browse.DTO.Catalog.Internal;
using DigitalCommercePlatform.UIService.Browse.Models.Catalog.Internal;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class CatalogProfile : Profile
    {
        public CatalogProfile()
        {
            CreateMap<CatalogHierarchyDto, CatalogHierarchyModel>();
            CreateMap<SourceDto, SourceModel>();
            CreateMap<NodeDto, NodeModel>();
        }
    }
}
