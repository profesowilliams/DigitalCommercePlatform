using AutoMapper;
using DigitalCommercePlatform.UIService.Catalog.DTO;
using DigitalCommercePlatform.UIService.Catalog.DTO.Internal;
using DigitalCommercePlatform.UIService.Catalog.Models;
using DigitalCommercePlatform.UIService.Catalog.Models.Internal;
using DigitalFoundation.Common.MongoDb.Models;

namespace DigitalCommercePlatform.UIService.Catalog.Automapper
{
    public class CatalogProfile : Profile
    {
        public CatalogProfile()
        {
            CreateMap<CatalogHierarchyDto, CatalogHierarchyModel>();
            CreateMap<SourceDto, SourceModel>();
            CreateMap<Source, SourceModel>();
            CreateMap<NodeDto, NodeModel>();
        }
    }
}