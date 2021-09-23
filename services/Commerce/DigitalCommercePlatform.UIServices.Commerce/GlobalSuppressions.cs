//2021 (c) Tech Data Corporation -. All Rights Reserved.
// This file is used by Code Analysis to maintain SuppressMessage
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given
// a specific target and scoped to a namespace, type, member, etc.

using System.Diagnostics.CodeAnalysis;

[assembly: SuppressMessage("Globalization", "CA1305:Specify IFormatProvider")]
[assembly: SuppressMessage("Usage", "CA2227:Collection properties should be read only")]
[assembly: SuppressMessage("Design", "CA1002:Do not expose generic lists")]
[assembly: SuppressMessage("Design", "CA1031:Do not catch general exception types")]
[assembly: SuppressMessage("Critical Code Smell", "S4487:Unread \"private\" fields should be removed")]
[assembly: SuppressMessage("Major Code Smell", "S125:Sections of code should not be commented out")]
[assembly: SuppressMessage("Major Code Smell", "S3445:Exceptions should not be explicitly rethrown")]
[assembly: SuppressMessage("Major Code Smell", "S3442:\"abstract\" classes should not have \"public\" constructors")]
[assembly: SuppressMessage("Major Code Smell", "S2971:\"IEnumerable\" LINQs should be simplified")]
[assembly: SuppressMessage("Major Code Smell", "S3358:Ternary operators should not be nested")]
[assembly: SuppressMessage("CodeQuality", "IDE0052:Remove unread private members")]
[assembly: SuppressMessage("Design", "CA1012:Abstract types should not have public constructors")]
[assembly: SuppressMessage("Design", "CA1051:Do not declare visible instance fields")]
[assembly: SuppressMessage("Naming", "CA1715:Identifiers should have correct prefix")]
[assembly: SuppressMessage("Design", "CA1054:URI-like parameters should not be strings")]
[assembly: SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope")]
[assembly: SuppressMessage("Reliability", "CA2007:Consider calling ConfigureAwait on the awaited task")]
[assembly: SuppressMessage("Design", "CA1034:Nested types should not be visible")]
[assembly: SuppressMessage("Design", "CA1062:Validate arguments of public methods")]
[assembly: SuppressMessage("Usage", "CA2200:Rethrow to preserve stack details")]
[assembly: SuppressMessage("Performance", "CA1829:Use Length/Count property instead of Count() when available")]
[assembly: SuppressMessage("Usage", "CA1801:Review unused parameters")]
[assembly: SuppressMessage("Security", "CA5394:Do not use insecure randomness")]
[assembly: SuppressMessage("Design", "CA1056:URI-like properties should not be strings")]
[assembly: SuppressMessage("Major Bug", "S2259:Null pointers should not be dereferenced", Justification = "<Pending>", Scope = "member", Target = "~M:DigitalCommercePlatform.UIServices.Commerce.Services.CommerceService.CreateResponseUsingEstimateId(DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail.GetQuotePreviewDetails.Request)~System.Threading.Tasks.Task{DigitalCommercePlatform.UIServices.Commerce.Models.Quote.QuotePreviewModel}")]
[assembly: SuppressMessage("Major Code Smell", "S107:Methods should not have too many parameters", Justification = "<Pending>", Scope = "member", Target = "~M:DigitalCommercePlatform.UIServices.Commerce.Actions.GetRecentOrders.GetOrders.FilteringDto.#ctor(System.String,System.String,System.String,System.Nullable{System.DateTime},System.Nullable{System.DateTime},System.String,System.String,System.String,System.String)")]
[assembly: SuppressMessage("Major Bug", "S2259:Null pointers should not be dereferenced", Justification = "<Pending>", Scope = "member", Target = "~M:DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails.GetOrder.Response.#ctor(DigitalCommercePlatform.UIServices.Commerce.Models.Order.OrderDetailModel)")]
