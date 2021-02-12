namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    /// <summary>
    /// Output DTO returning all calculations for the basket
    /// </summary>
    public class BasketCalculationsDto
    {
        public double ItemTotalWithReversecharge { get; set; }
        public double ItemTotalWithoutReversecharge { get; set; }
        public double? IntouchDiscount { get; set; }
        public double? ItemTotalWithDiscount { get; set; }
        public double FreightCostWithReverseCharge { get; set; }
        public double FreightCostWithoutReverseCharge { get; set; }
        public double BasketTotalWithoutVATWithReverseCharge { get; set; }
        public double BasketTotalWithoutVATWithoutReverseCharge { get; set; }
        public double VAT { get; set; }
        public double BasketTotal { get; set; }
        public bool RCItemBasket { get; set; }
        public double Weight { get; set; }
        public double WeightWRC { get; set; }
        public double MinimumSurchargeWithReverseCharge { get; set; }
        public double MinimumSurchargeWithoutReverseCharge { get; set; }
        public double EqualizationTaxSurchargeWithoutReverseCharge { get; set; }
        public double EqualizationTaxSurchargeWithReverseCharge { get; set; }
        public bool IsBadBoxBasket { get; set; }
        public double FEM { get; set; }
        public double GovFees { get; set; }
        public double SubTotalWithoutGovFees { get; set; }
        public double TotalFreight { get; set; }
    }
}