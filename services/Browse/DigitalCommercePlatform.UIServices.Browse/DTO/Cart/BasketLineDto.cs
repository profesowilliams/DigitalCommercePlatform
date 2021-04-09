using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.Serialization;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    [Serializable]
    [DataContract]
    [ExcludeFromCodeCoverage]
    public class BasketLineDto
    {
        /// <summary>
        /// Gets or sets Product ID
        /// </summary>
        [DataMember]
        public int? ProdId { get; set; }

        /// <summary>
        /// Basket Line Id
        /// </summary>
        [DataMember]
        public int BasketLineId { get; set; }

        /// <summary>
        /// Gets or sets Product quantity in Basket
        /// </summary>
        [DataMember]
        public int? BasketQty { get; set; }

        /// <summary>
        /// Gets or sets Customer Agreement ID
        /// </summary>
        [DataMember]
        public string AgreementID { get; set; }

        /// <summary>
        /// Gets or sets End Customer ID
        /// </summary>
        [DataMember]
        public string EndCustId { get; set; }

        /// <summary>
        /// Gets or sets Item Type (Delivery/Internal)
        /// </summary>
        [DataMember]
        public string ItemType { get; set; }

        /// <summary>
        /// Gets or sets Manufacturer Part number
        /// </summary>
        [DataMember]
        public string ManufPartNo { get; set; }

        /// <summary>
        /// Gets or sets Free Products Yes/No
        /// </summary>
        [DataMember]
        public string IsFreeProduct { get; set; }

        /// <summary>
        /// Gets or sets Obsolete Products in case no products returns
        /// </summary>
        [DataMember]
        public bool IsObsolete { get; set; }

        [DataMember]
        public int AdditionalInfoStatus { get; set; }

        [DataMember]
        public string ProductName { get; set; }

        [DataMember]
        public string SDZZUAN { get; set; }

        [DataMember]
        public int? EndUserContractID { get; set; }

        public string PriceLevel { get; set; }

        /// <summary>
        /// Gets or sets Product infor from Products csl
        /// </summary>
        [DataMember]
        public List<BasketProductInfo> ProductDetails { get; set; }

        //Basket Product details
        public void AddProductDetail(List<BasketProductInfo> productDetail)
        {
            ProductDetails = productDetail;
        }

        [DataMember]
        public decimal? Pricefactor { get; set; }

        [DataMember]
        public decimal? VendorPurchasePrice { get; set; }

        [DataMember]
        public string PurchaseCurrency { get; set; }

        [DataMember]
        public decimal? ResellerPrice { get; set; }

        [DataMember]
        public string CustomerLineNumber { get; set; }

        [DataMember]
        public int? IsResellerPriceUploaded { get; set; }

        [DataMember]
        public decimal? ResellerPriceManual { get; set; }

        [DataMember]
        public int? IsResellerPriceManual { get; set; }

        [DataMember]
        public string EndUserType { get; set; }

        [DataMember]
        public string SortLabelPointsSeats { get; set; }

        [DataMember]
        public string SortName { get; set; }

        [DataMember]
        public decimal? SortTotalPoints { get; set; }

        [DataMember]
        public int? SortID { get; set; }

        [DataMember]
        public decimal? VendorPurchasePriceManual { get; set; }

        [DataMember]
        public int? IsVendorPurchasePriceManual { get; set; }

        [DataMember]
        public int? IsVendorPurchasePriceUplaoded { get; set; }

        [DataMember]
        public string RenewalType { get; set; }

        public double FEM { get; set; }
        public string ProductType { get; set; }
        public string BBStrgLoc { get; set; }
        public bool? HideSalesPrice { get; set; }
    }
}