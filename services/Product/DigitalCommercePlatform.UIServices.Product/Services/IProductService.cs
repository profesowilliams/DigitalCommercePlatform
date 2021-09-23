//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Product.Actions;
using DigitalCommercePlatform.UIServices.Product.Models.Product.Product;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Product.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductModel>> GetProductDetails(ProductDetails.Request request);
    }
}
