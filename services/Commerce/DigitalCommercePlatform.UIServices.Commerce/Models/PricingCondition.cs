using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models
{
    [ExcludeFromCodeCoverage]
    public class PricingCondition
    {
        private string _key;
        private string _value;
        public PricingCondition(string key, string value) 
        {
            this._key = key;
            this._value = value;
        }
        public string Key {
            get { return _key; }
            set { _key = value; }
        }
        public string Value
        {
            get { return _value; }
            set { _value = value; }
        }
    }
}
