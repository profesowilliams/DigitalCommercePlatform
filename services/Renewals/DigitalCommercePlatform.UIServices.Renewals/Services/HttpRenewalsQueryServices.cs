using DigitalCommercePlatform.UIServices.Renewals.Actions.GetRenewals;
using DigitalCommercePlatform.UIServices.Renewals.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewals.Services
{
    public class HttpRenewalsQueryServices : IRenewalsQueryServices
    {
        private readonly IHttpClientFactory _clientFactory;
#pragma warning disable CS0414 // The field is assigned but its value is never used
        private readonly string _applicationServiceReturnUrl;
#pragma warning restore CS0414 // The field is assigned but its value is never used
        private static readonly Random getrandom = new Random();
        public HttpRenewalsQueryServices(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
            _applicationServiceReturnUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-renewals/v1/";
        }


        public async Task<RenewalsDto> GetRenewalsAsync(GetMultipleRenewals.Request request)
        {

            // Revisit when Renewal AppService is Ready
            //var url = _applicationServiceReturnUrl.AppendPathSegment("Find");
            //var getReturnsHttpRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);
            //var apiReturnsClient = _clientFactory.CreateClient("apiServiceClient");
            //var getOrdersHttpResponse = await apiReturnsClient.SendAsync(getReturnsHttpRequestMessage);
            //var returnsDto = await getOrdersHttpResponse.Content.ReadAsAsync<RenewalsDto>();
            var lstRenewals = new List<Renewal>();

            for (int i = 0; i < 30; i++)
            {
                Renewal objRenewal = new Renewal();
                var randomNumber = Convert.ToString(GetRandomNumber(10, 60));
                var quantity = GetRandomNumber(1, 10);
                var expirationDate = i > 9 ? i % 2 == 0 ? GetRandomNumber(10, 100) : 0 : 0;
                var price = GetRandomNumber(1, 50) + (i % 2 == 0 ? 0.35 : 0.75);
                objRenewal.RenewalId = "R12345" + randomNumber;
                objRenewal.VendorName = i % 2 == 0 ? "DELL" : "CISCO";
                objRenewal.RenewalNumber = "RW58691" + randomNumber;
                objRenewal.ExpirationDate = DateTime.Now.AddDays(expirationDate);
                objRenewal.ExpirationDateToString = DateTime.Now.AddDays(expirationDate).ToShortDateString();
                objRenewal.QuoteNumber = i % 3 == 0 ? "" : "Q40100930" + randomNumber;
                objRenewal.Quantity = quantity;
                objRenewal.Price = price;
                objRenewal.TotalPrice = price * (quantity + (i % 2 == 0 ? 0.35 : 0.75));
                objRenewal.EndUserName = i % 2 == 0 ? "JACKSON COUNTY COURTHOUSE" : "WESTFIELD BANK";
                objRenewal.ContractNumber = i % 2 == 0 ? "JAC150" + randomNumber : "WEST250" + quantity;
                objRenewal.TDPartNumber = "131323" + randomNumber;
                objRenewal.PartDescription = i % 2 == 0 ? "Dell Latitude 5520-15.6' - Core i7 1185G7 - vPro - 16 GB RAM -512 GB SSD" : "Cisco MXA UCS C220 M3 Rack Server for Cisco Show and Share Enterprise";
                objRenewal.CreatedTime = DateTime.Now.AddDays(i * -10);
                objRenewal.UpdatedTime = DateTime.Now.AddDays(i * -5);
                objRenewal.Action = !string.IsNullOrWhiteSpace(objRenewal.QuoteNumber) ? "Update" : ""; // update or create Quote

                lstRenewals.Add(objRenewal);
            }

            var objReponse = new RenewalsDto
            {
                ListOfRenewals = lstRenewals,
                TotalRecords = lstRenewals.Count(),
                SortBy = "ExpirationDate",
                SortDirection = "Asc",
                PageSize = 25,
                CurrentPage = 10,
            };

            return await Task.FromResult(objReponse);
        }
        /// <summary>
        /// Need to revisit once we have app service call is ready
        /// </summary>
        /// <param name="criteria"></param>
        /// <returns></returns>
        public async Task<RenewalsSummaryModel> GetRenewalsSummaryAsync(string criteria)
        {
            var findRequest = new FindModel
            {
                AuthToken = "",
                CustomerId = "00380000",
                UserId = "50546",
                SortBy = "ExpirationDate"
            };
            var request = new GetMultipleRenewals.Request
            {
                Criteria = findRequest
            };
            var response = new RenewalsSummaryModel();
            var apiResponse = await GetRenewalsAsync(request);

            if (apiResponse.ListOfRenewals.Count > 0)
            {
                // read days from criteria once AEM(client) starts calling api 
                response.ThirtyDays = apiResponse.ListOfRenewals.Where(x => x.ExpirationDate >= DateTime.Now.AddDays(30)).Count();
                response.Today = apiResponse.ListOfRenewals.Where(x => x.ExpirationDate >= DateTime.Now.AddDays(1)).Count();
                response.NinetyDays = apiResponse.ListOfRenewals.Where(x => x.ExpirationDate >= DateTime.Now.AddDays(90)).Count();
                response.SixtyDays = apiResponse.ListOfRenewals.Where(x => x.ExpirationDate >= DateTime.Now.AddDays(60)).Count();
            }

            return await Task.FromResult(response);
        }

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public async Task<RenewalsDto> GetRenewalByIdAsync(string id)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
        {
            throw new NotImplementedException();
        }

        public static int GetRandomNumber(int min, int max)
        {            
            return getrandom.Next(min, max);
        }
    }
}
