namespace DigitalCommercePlatform.UIServices.Security.Models
{
    public class CoreUserDto
    {
        public User User { get; set; }
        public bool IsError { get; set; }
        public int ExpiresIn { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorDescription { get; set; }
        public int StatusCode { get; set; }
    }
}
