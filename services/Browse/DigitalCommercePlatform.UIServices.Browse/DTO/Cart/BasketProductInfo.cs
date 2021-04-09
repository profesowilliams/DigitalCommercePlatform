using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    [ExcludeFromCodeCoverage]
    public class BasketProductInfo
    {
        /// <summary>
        /// Gets or sets Product Id
        /// </summary>
        public int ProductId { get; set; }

        /// <summary>
        /// Gets or sets Product Description
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets Prouct short description
        /// </summary>
        public string ShortDescription { get; set; }

        /// <summary>
        /// Gets or sets Ean
        /// </summary>
        public string Ean { get; set; }

        /// <summary>
        /// Gets or sets Manufacturer
        /// </summary>
        public string Manufacture { get; set; }

        /// <summary>
        /// Gets or sets Level of Manufacturer
        /// </summary>
        public string ManufactureLevel { get; set; }

        /// <summary>
        /// Gets or sets Order
        /// </summary>
        public string Order { get; set; }

        /// <summary>
        /// Gets or sets Quantity of Products
        /// </summary>
        public string Quantity { get; set; }

        /// <summary>
        /// Gets or sets type of Product
        /// </summary>
        public string ProductType { get; set; }

        /// <summary>
        /// Gets or sets type of Product price
        /// </summary>
        public decimal? Price { get; set; }

        /// <summary>
        /// Gets or sets type of Product price
        /// </summary>
        public string Bonus { get; set; }

        /// <summary>
        /// Gets or sets type of Product price
        /// </summary>
        public decimal? DefaultPrice { get; set; }

        /// <summary>
        /// Gets or sets type of Product price
        /// </summary>
        public decimal? MinimalPrice { get; set; }

        /// <summary>
        /// Gets or sets type of Product price
        /// </summary>
        public decimal? Vat { get; set; }

        /// <summary>
        /// Gets or sets type of Stock Total
        /// </summary>
        public int? StockTotal { get; set; }

        /// <summary>
        /// Gets or sets type of Stock
        /// </summary>
        public IEnumerable<StockDto> Stock { get; set; }

        /// <summary>
        /// Gets or sets type of Stock Availability Value
        /// </summary>
        public string StockAvailabilityValue { get; set; }

        /// <summary>
        /// Gets or sets type of Product price
        /// </summary>
        public decimal? ListPrice { get; set; }

        /// <summary>
        /// Gets or sets type of Product price
        /// </summary>
        public string GroupName { get; set; }

        /// <summary>
        /// Gets or sets total price
        /// </summary>
        public decimal? TotalPrice { get; set; }

        /// <summary>
        /// Gets or sets vat code
        /// </summary>
        public string VatCode { get; set; }

        /// <summary>
        /// Gets or sets Gov Fees
        /// </summary>
        public decimal? GovFees { get; set; }

        /// <summary>
        /// Gets or sets manufacture's part number
        /// </summary>
        public string ManufacturePartNo { get; set; }

        /// <summary>
        /// Hierarchy node name
        /// </summary>
        public int? AvailableValue { get; set; }

        /// <summary>
        /// Hierarchy node name
        /// </summary>
        public string SubclassCode { get; set; }

        /// <summary>
        /// Gets or sets Item Category Group
        /// </summary>
        public string ItemCategoryGroup { get; set; }

        /// <summary>
        /// Gets or sets Image URL
        /// </summary>
        public Uri ImageURL { get; set; }

        /// <summary>
        /// Gets or sets Image URL
        /// </summary>
        public string EndCustomerAgreementId { get; set; }

        /// <summary>
        /// Gets or sets Available Bid Qty
        /// </summary>
        public decimal? EndCustomerAvailability { get; set; }

        /// <summary>
        /// Gets or sets Available Bid Qty
        /// </summary>
        public bool IsSpecialBid { get; set; }

        /// <summary>
        /// Gets or sets best price
        /// </summary>
        public QuantityBreakDto BestPrice { get; set; }

        public string SmallImage { get; set; }

        public int? BBPristineProd { get; set; }
        public string BBStrgLoc { get; set; }

        /// <summary>
        /// Returns information if product is BB product.
        /// </summary>
        public bool IsBBProduct
        {
            get
            {
                return !string.IsNullOrEmpty(BBStrgLoc);
            }
        }

        /// <summary>
        /// If product is pristine product, returns ProductId.
        /// If product is badbox product, returns BBPristineProd.
        /// </summary>
        public int ProductIdForBasket
        {
            get
            {
                if (BBPristineProd.HasValue)
                    return BBPristineProd.Value;
                return ProductId;
            }
        }

        public decimal? PriceWithoutBump { get; set; }
        public decimal? AbsoluteBump { get; set; }
        public decimal? OriginalPrice { get; set; }
        public int? IsLOL { get; set; }
        public int? VLOL { get; set; }
        public IEnumerable<QuantityBreakDto> QuantityBreaks { get; set; }
        public decimal? IntouchBestPrice { get; set; }

        /// <summary>
        /// Gets or sets type of AdjustedCostPrice
        /// </summary>
        public decimal? AdjustedCostPrice { get; set; }

        public decimal? PricePC { get; set; }
    }
}