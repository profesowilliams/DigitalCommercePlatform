namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    public class AddToBasketInputMultipleItemDto
    {
        public AddToBasketInputMultipleItemDto()
        {
            IsFreeProducts = "N";
            ParentProductId = 0;
            EndUserContractID = "0";
            PriceLevel = "";
        }

        /// <summary>
        /// Gets or sets Product Id
        /// </summary>
        public string ProductId { get; set; }

        /// <summary>
        /// Gets or sets Product quantity in Basket
        /// </summary>
        public string Quantity { get; set; }

        /// <summary>
        /// Gets or sets source where the product was added
        /// </summary>
        public string CustomerId { get; set; }

        public int CountryCode { get; set; }

        public string UserId { get; set; }

        public string Source { get; set; }

        /// <summary>
        /// Gets or sets agreement id
        /// </summary>
        public string AgreementId { get; set; }

        /// <summary>
        /// Gets or sets end customer id
        /// </summary>
        public string EndCustomerId { get; set; }

        /// <summary>
        /// Gets or sets SDUAN
        /// </summary>
        public string SDUAN { get; set; }

        /// <summary>
        /// Gets or sets SDLineNo
        /// </summary>
        public string SDLineNo { get; set; }

        /// <summary>
        /// Gets or sets BundleId
        /// </summary>
        public string BundleId { get; set; }

        public string IsFreeProducts { get; set; }
        public int ParentProductId { get; set; }

        public string RenewalsQty { get; set; }

        public string ResellerPrice { get; set; }
        public string VendorPurchasePrice { get; set; }
        public string PurchaseCurrency { get; set; }
        public string IsResellerPriceUploaded { get; set; }
        public string IsVendorPurchasePriceUplaoded { get; set; }

        public string EndUserContractID { get; set; }
        public string PriceLevel { get; set; }

        //WestMinsterP2 Rikesh
        public string RenewalType { get; set; }

        public string PriceFactor { get; set; }
        public string RenewalLP { get; set; }
        public string RenewalLPCurrency { get; set; }

        public string ContractDuration { get; set; }
        public string LinkedRenewal { get; set; }
        public string EndUserType { get; set; }
    }
}