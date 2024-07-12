export const mapServiceData = (response) => {
  const mappedResponse = { ...response };
  const responseData = mappedResponse?.data?.content;
  const items = responseData?.items?.map((val) => ({
    ...val,
  }));
  const itemsWithActions = items
    ? items.map((data) => ({
        ...data,
        orderNumber: responseData?.orderNumber,
        customerPO: responseData?.customerPO,
        actions: true,
        currency: responseData?.currency,
        orderEditable: responseData?.orderEditable,
      }))
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
          pageNumber,
        },
      },
    };
  }

  mappedResponse.data.content = {
    items: itemsWithActions,
    totalItems,
    pageCount,
    pageNumber,
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

export function prepareGroupedItems(content) {
  let items = [];
  content.groupedItems.forEach((group) => {
    group.items.forEach((item, index) => {
      items.push({
        ...item,
        ...(index === 0
          ? {
            TDSynnexPO: group.tdSynnexPO,
            manufacturer: group.manufacturer,
          }
          : {}),
      });
    });
  });
  return items;
};