//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Renewal.Tests
{
    public class ServiceTests
    {
        private static IMapper Mapper => new MapperConfiguration(config => config.AddProfile(new RenewalsMapper())).CreateMapper();
        private static Mock<ILogger<RenewalService>> Logger => new();
        private static Mock<IAppSettings> AppSettings
        {
            get
            {
                var moq = new Mock<IAppSettings>();

                moq.Setup(x => x.GetSetting("App.Renewal.Url")).Returns("http://appConfigUrl/v1/");
                moq.Setup(x => x.GetSetting("App.Quote.Url")).Returns("http://appquoteUrl/v1/");

                return moq;
            }
        }

        public ServiceTests()
        {

        }

        [Theory]
        [AutoDomainData]
        public void ServicesGetCountTests(RefinementRequest request)
        {
            var httpClient = new Mock<IMiddleTierHttpClient>();
            
            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), null, null,null)).ReturnsAsync(ReturnedData);

            var helperQueryService = new Mock<IHelperService>();

            var refinementRequest = new Mock<RefinementRequest>();
            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsSummaryCountFor(request).Result;
            
            result.Should().Be(5);
        }

        [Theory]
        [AutoDomainData]
        public void ServicesGetDetailedReturnNotNullTests(SearchRenewalDetailed.Request request)
        {
            var httpClient = new Mock<IMiddleTierHttpClient>();
            
            httpClient.Setup(x => x.GetAsync<ResponseDetailedDto>(It.IsAny<string>(), null, null,null)).ReturnsAsync(ReturnedDetailedData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsDetailedFor(request).Result;
            
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Theory]
        [AutoDomainData]
        public void ServicesGetSummaryReturnNotNullTests(SearchRenewalSummary.Request request)
        {
            var httpClient = new Mock<IMiddleTierHttpClient>();
            
            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), null, null,null)).ReturnsAsync(ReturnedSummaryData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsSummaryFor(request).Result;
            
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Theory]
        [AutoDomainData]
        public void ThrowsExceptionOtherThanRemoteServerHttpException(SearchRenewalSummary.Request request)
        {
            //arrange            
            var httpClient = new Mock<IMiddleTierHttpClient>();
            
            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null)).ThrowsAsync(new Exception("test 123"));

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            
            //act
            Func<Task> act = async () => await service.GetRenewalsSummaryFor(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            httpClient.Verify(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(),null), Times.Once);
        }

        private ResponseSummaryDto ReturnedSummaryData()
        {
            return new ResponseSummaryDto
            {
                Count = 3,
                Data = new List<SummaryDto>() 
                { 
                    new SummaryDto
                    {                
                        EndUserPO = "Test 1",
                        DueDate = DateTime.Now.AddDays(5)                        
                    },
                    new SummaryDto
                    {
                        EndUserPO = "Test 2",
                        DueDate = DateTime.Now.AddDays(2)
                    },
                    new SummaryDto
                    {
                        EndUserPO = "Test 3",
                        DueDate = DateTime.Now.AddDays(7)
                    }
                }
            };
        }

        private ResponseDetailedDto ReturnedDetailedData()
        {
            return new ResponseDetailedDto
            {
                Count = 3,
                Data = new List<DetailedDto>()
                {
                    new DetailedDto
                    {
                        Vendor = new Dto.Renewals.Internal.VendorDto()
                        {
                            Name = "TestVendor"
                        },
                        EndUserPO = "Test 1",
                        DueDate = DateTime.Now.AddDays(5)
                    },
                    new DetailedDto
                    {
                        EndUserPO = "Test 2",
                        DueDate = DateTime.Now.AddDays(2)
                    },
                    new DetailedDto
                    {
                        EndUserPO = "Test 3",
                        DueDate = DateTime.Now.AddDays(7)
                    }
                }
            };
        }

        [Theory]
        [AutoDomainData]
        public void ServicesGetRefainmentGroupTests(RefinementRequest request)
        {
            var httpClient = new Mock<IMiddleTierHttpClient>();
            
            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), null, null,null)).ReturnsAsync(ReturnedData);

            var helperQueryService = new Mock<IHelperService>();

            var refinementRequest = new Mock<RefinementRequest>();
            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRefainmentGroup(request).Result;
            
            result.Should().NotBeNull();
            result.Group.Should().Be("RenewalAttributes");
            result.Refinements.Should().NotBeEmpty();
            result.Refinements.Count.Should().Be(3);           
        }

        [Fact]
        public void ServicesGetDetailedResellerIdPartialSearch()
        {
            var request = new SearchRenewalDetailed.Request()
            {
                ResellerId = new List<string> { "302", "343"},
                ResellerName = "Name",
                ResellerPO  = "ResellerPO",
                EndUser = "EndUser",
                EndUserEmail = "EndUserEmail",
                ContractID = "ContractID",
                Instance = "Instance",
                SerialNumber = "SerialNumber"
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseDetailedDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedDetailedData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsDetailedFor(request).Result;

            for (var i = 0; i < request.ResellerId.Count; i++)
            {
                request.ResellerId[i].Should().EndWith("*");
            }

            request.ResellerName.Should().NotEndWith("*");
            request.ResellerPO.Should().NotEndWith("*");
            request.EndUser.Should().NotEndWith("*");
            request.EndUserEmail.Should().NotEndWith("*");
            request.ContractID.Should().NotEndWith("*");
            request.Instance.Should().NotEndWith("*");
            request.SerialNumber.Should().NotEndWith("*");
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Fact]
        public void ServicesGetDetailedResellerNamePartialSearch()
        {
            var request = new SearchRenewalDetailed.Request()
            {
                ResellerName = "Name",
                ResellerPO = "ResellerPO",
                EndUser = "EndUser",
                EndUserEmail = "EndUserEmail",
                ContractID = "ContractID",
                Instance = "Instance",
                SerialNumber = "SerialNumber"
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseDetailedDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedDetailedData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsDetailedFor(request).Result;

            request.ResellerName.Should().EndWith("*");
            request.ResellerPO.Should().NotEndWith("*");
            request.EndUser.Should().NotEndWith("*");
            request.EndUserEmail.Should().NotEndWith("*");
            request.ContractID.Should().NotEndWith("*");
            request.Instance.Should().NotEndWith("*");
            request.SerialNumber.Should().NotEndWith("*");
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Fact]
        public void ServicesGetDetailedResellerPOPartialSearch()
        {
            var request = new SearchRenewalDetailed.Request()
            {
                ResellerPO = "ResellerPO",
                EndUser = "EndUser",
                EndUserEmail = "EndUserEmail",
                ContractID = "ContractID",
                Instance = "Instance",
                SerialNumber = "SerialNumber"
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseDetailedDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedDetailedData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsDetailedFor(request).Result;

            request.ResellerPO.Should().EndWith("*");
            request.EndUser.Should().NotEndWith("*");
            request.EndUserEmail.Should().NotEndWith("*");
            request.ContractID.Should().NotEndWith("*");
            request.Instance.Should().NotEndWith("*");
            request.SerialNumber.Should().NotEndWith("*");
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Fact]
        public void ServicesGetDetailedEndUserPartialSearch()
        {
            var request = new SearchRenewalDetailed.Request()
            {
                EndUser = "EndUser",
                EndUserEmail = "EndUserEmail",
                ContractID = "ContractID",
                Instance = "Instance",
                SerialNumber = "SerialNumber"
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseDetailedDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedDetailedData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsDetailedFor(request).Result;

            request.EndUser.Should().EndWith("*");
            request.EndUserEmail.Should().NotEndWith("*");
            request.ContractID.Should().NotEndWith("*");
            request.Instance.Should().NotEndWith("*");
            request.SerialNumber.Should().NotEndWith("*");
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Fact]
        public void ServicesGetSummaryResellerNamePartialSearch()
        {
            var request = new SearchRenewalSummary.Request()
            {
                ResellerName = "Name",
                ResellerPO = "ResellerPO",
                EndUser = "EndUser",
                EndUserEmail = "EndUserEmail",
                ContractID = "ContractID",
                Instance = "Instance",
                SerialNumber = "SerialNumber"
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedSummaryData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsSummaryFor(request).Result;

            request.ResellerName.Should().EndWith("*");
            request.ResellerPO.Should().NotEndWith("*");
            request.EndUser.Should().NotEndWith("*");
            request.EndUserEmail.Should().NotEndWith("*");
            request.ContractID.Should().NotEndWith("*");
            request.Instance.Should().NotEndWith("*");
            request.SerialNumber.Should().NotEndWith("*");
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Fact]
        public void ServicesGetSummaryResellerPOPartialSearch()
        {
            var request = new SearchRenewalSummary.Request()
            {
                ResellerPO = "ResellerPO",
                EndUser = "EndUser",
                EndUserEmail = "EndUserEmail",
                ContractID = "ContractID",
                Instance = "Instance",
                SerialNumber = "SerialNumber"
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedSummaryData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsSummaryFor(request).Result;

            request.ResellerPO.Should().EndWith("*");
            request.EndUser.Should().NotEndWith("*");
            request.EndUserEmail.Should().NotEndWith("*");
            request.ContractID.Should().NotEndWith("*");
            request.Instance.Should().NotEndWith("*");
            request.SerialNumber.Should().NotEndWith("*");
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Fact]
        public void ServicesGetSummaryEndUserPartialSearch()
        {
            var request = new SearchRenewalSummary.Request()
            {
                EndUser = "EndUser",
                EndUserEmail = "EndUserEmail",
                ContractID = "ContractID",
                Instance = "Instance",
                SerialNumber = "SerialNumber"
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedSummaryData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsSummaryFor(request).Result;

            request.EndUser.Should().EndWith("*");
            request.EndUserEmail.Should().NotEndWith("*");
            request.ContractID.Should().NotEndWith("*");
            request.Instance.Should().NotEndWith("*");
            request.SerialNumber.Should().NotEndWith("*");
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Fact]
        public void ServicesGetSummarySortByDueDaysSearch()
        {
            var request = new SearchRenewalSummary.Request()
            {
                SortBy = "duedays",
                SortAscending = true
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedSummaryData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsSummaryFor(request).Result;

            result.Response.FirstOrDefault().EndUserPO.Should().Be("Test 2");
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Fact]
        public void ServicesGetDetailedSortByDueDaysSearch()
        {
            var request = new SearchRenewalDetailed.Request()
            {
                SortBy = "duedays",
                SortAscending = false
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseDetailedDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedDetailedData);

            var helperQueryService = new Mock<IHelperService>();

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsDetailedFor(request).Result;

            result.Response.FirstOrDefault().EndUserPO.Should().Be("Test 3");
            result.Should().NotBeNull();
            result.Count.Should().Be(3);
        }

        [Fact]
        public void ServicesGetDetailedGetVendorLogo()
        {
            var request = new SearchRenewalDetailed.Request()
            {
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseDetailedDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedDetailedData);

            var helperQueryService = new Mock<IHelperService>();
            helperQueryService.Setup(x => x.GetVendorLogo("TestVendor")).Returns("http://testVendor/logoUrl.svg");

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsDetailedFor(request).Result;

            result.Response.FirstOrDefault().VendorLogo.Should().Be("http://testVendor/logoUrl.svg");
        }

        [Fact]
        public void ServicesGetRenewalsQuoteDetailedGetVendorLogo()
        {
            var request = new GetRenewalQuoteDetailed.Request()
            {
            };
            var httpClient = new Mock<IMiddleTierHttpClient>();

            List<QuoteDetailedDto> ReturnsQuoteData = new List<QuoteDetailedDto>();
            ReturnsQuoteData.Add(new()
            {
                Source = new(),

                Items = new()
                {
                    new()
                    {
                        Product = new()
                        {
                            new() { Manufacturer = "TestVendor" }
                        }
                    }
                }
            });

            httpClient.Setup(x => x.GetAsync<IEnumerable<QuoteDetailedDto>>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnsQuoteData);

            var helperQueryService = new Mock<IHelperService>();
            helperQueryService.Setup(x => x.GetVendorLogo("TestVendor")).Returns("http://testVendor/logoUrl.svg");

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Mapper, helperQueryService.Object);
            var result = service.GetRenewalsQuoteDetailedFor(request).Result;

            result.FirstOrDefault().VendorLogo.Should().Be("http://testVendor/logoUrl.svg");
        }

        private ResponseSummaryDto ReturnedData()
        {
            return new ResponseSummaryDto() { Count = 5, Data = new List<SummaryDto>() };
        }
    }
}
