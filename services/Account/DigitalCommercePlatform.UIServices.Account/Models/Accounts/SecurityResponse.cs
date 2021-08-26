//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Accounts
{
    [ExcludeFromCodeCoverage]
    public class SecurityResponse
    {
        public virtual bool IsError { get; set; }
        public string ErrorCode { get; set; }
        public SecurityResponseErrorType ErrorType { get; set; }
        public string ErrorDescription { get; set; }
        public Exception Exception { get; set; }

        public static T FromException<T>(Exception ex, string errorMessage = null) where T : SecurityResponse, new()
        {
            var response = new T()
            {
                IsError = true,
                ErrorCode = "exception",
                ErrorDescription = ex.Message,
                ErrorType = SecurityResponseErrorType.Exception,
                Exception = ex
            };

            return response;
        }
    }

    public enum SecurityResponseErrorType
    {
        /// <summary>
        /// No error in response
        /// </summary>
        None = 0,

        /// <summary>
        /// Valid response but protocol level error (e.g. no valid access token)
        /// </summary>
        Protocol,

        /// <summary>
        /// Http error - e.g 404
        /// </summary>
        Http,

        /// <summary>
        /// Exception error occured - e.g TLS
        /// </summary>
        Exception
    }
}
