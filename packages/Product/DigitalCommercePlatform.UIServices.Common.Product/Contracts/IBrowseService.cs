using DigitalCommercePlatform.UIServices.Common.Product.Models.Catalog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Product.Contracts
{
    public interface IBrowseService
    {
        Task<List<CatalogResponse>> GetCatalogDetails(string Id);

        Task<List<CatalogResponse>> GetProductCatalogDetails(ProductCatalog request);

    }
}
