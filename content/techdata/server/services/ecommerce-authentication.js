const app = require("../server/server");

app.post("/ui-account/v1/login/par", (req, res) => {
  const { continueUrl } = req.body;
  const requestUriString = `http://localhost:3000/?continue_url=${continueUrl}`;
  res.json({
    requestUri: requestUriString,
    expiresIn: 60,
    isError: false,
    errorCode: null,
    errorType: 0,
    errorDescription: null,
    exception: null,
  });
});

app.get("/ui-account/v1/GetUser/AEM", (req, res) => {
  const sessionId = req.cookies["session-id"];

  if (!sessionId) {
    res.status(401).send();
    return;
  }

  setTimeout(() => {
    res.json({
      content: {
        user: {
          id: "516514",
          firstName: "DAYNA",
          lastName: "KARAPHILLIS",
          name: "516514",
          country: "",
          email: "daniel.vogt@techdata.com",
          phone: null,
          customers: ["0038048612", "0009000325", "0009000325"],
          roles: null,
          isHouseAccount: true,
          roleList: [
            {
              entitlement: "CanManageOwnProfile",
              accountId: "",
            },
            {
              entitlement: "CanAccessAccount",
              accountId: "0038048612",
            },
            {
              entitlement: "CanAccessDeveloperCenter",
              accountId: "0038048612",
            },
            {
              entitlement: "CanViewCreditStatement",
              accountId: "0038048612",
            },
            {
              entitlement: "CanDownloadPriceFiles",
              accountId: "0038048612",
            },
            {
              entitlement: "CanViewInvoices",
              accountId: "0038048612",
            },
            {
              entitlement: "CanPlaceOrder",
              accountId: "0038048612",
            },
            {
              entitlement: "AdminUser",
              accountId: "0038048612",
            },
            {
              entitlement: "CanViewOrders",
              accountId: "0038048612",
            },
            {
              entitlement: "hasDCPAccess",
              accountId: "",
            },
            {
              entitlement: "hasRenewalsAccess",
              accountId: "",
            },
            {
              entitlement: "CanAccessRenewals",
              accountId: "",
            },
          ],
          customersV2: [
            {
              number: "0038048612",
              name: "SHI INTERNATIONAL CORP",
              customerNumber: "0038048612",
              customerName: "SHI INTERNATIONAL CORP",
              salesOrg: "0101",
              system: "2",
              dcpAccess: true,
            },
            {
              number: "0009000325",
              name: "SHI INTERNATIONAL CORP.",
              customerNumber: "0009000325",
              customerName: "SHI INTERNATIONAL CORP.",
              salesOrg: "1001",
              system: "3",
              dcpAccess: false,
            },
            {
              number: "0009000325",
              name: null,
              customerNumber: "0009000325",
              customerName: null,
              salesOrg: null,
              system: null,
              dcpAccess: false,
            },
          ],
          activeCustomer: {
            number: "0038048612",
            name: "SHI INTERNATIONAL CORP",
            customerNumber: "0038048612",
            customerName: "SHI INTERNATIONAL CORP",
            salesOrg: "0101",
            system: "2",
            dcpAccess: true,
          },
        },
      },
      error: { code: 0, messages: [], isError: false },
    });
  }, 2000);
});
