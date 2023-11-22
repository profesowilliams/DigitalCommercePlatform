export const isLocalDevelopment = window.origin === 'http://localhost:8080';

export const mapServiceData = (response) => {
  const mappedResponse = { ...response };
  const responseData = mappedResponse?.data?.content;
  const items = responseData?.items?.map((val) => ({
    ...val,
  }));
  const itemsWithActions = items
    ? items.map((data) => ({ ...data, orderNumber: responseData?.orderNumber, customerPO: responseData?.customerPO, actions: true }))
    : [];
  const totalItems = mappedResponse?.data?.content?.totalItems ?? items?.length;
  const pageCount = mappedResponse?.data?.content?.pageCount ?? 1;
  const pageNumber = mappedResponse?.data?.content?.pageNumber ?? 0;

  if (mappedResponse.status !== 200 && !mappedResponse.data) {
    return {
      data: {
        content: {
          items: null,
          totalItems,
          pageCount,
          pageNumber
        },
      },
    };
  }

  mappedResponse.data.content = {
    items: itemsWithActions,
    totalItems,
    pageCount,
    pageNumber
  };
  return mappedResponse;
};

export const addCurrencyToColumns = (list, userData) => {
  const activeCustomer = userData?.activeCustomer;
  const defaultCurrency = activeCustomer?.defaultCurrency || '';
  const replace = '{currency-code}';

  return list.map((column) => {
    if (column.headerName.indexOf(replace) >= 0) {
      column.headerName = column.headerName.replace(replace, defaultCurrency);
    }
    return column;
  });
};