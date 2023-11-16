import React from 'react';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import Toaster from '../../Widgets/Toaster';
import ToolTip from '../../BaseGrid/ToolTip';
import OrderTrackingGridPagination from '../Pagination/OrderTrackingGridPagination';

const MainGridFooter = ({
  analyticsCategories,
  onQueryChanged,
  onCloseToaster,
  toolTipData,
  customPaginationRef,
  isLoading,
  paginationLabels,
}) => {
  return (
    <>
      <Toaster
        classname="toaster-modal-otg"
        onClose={onCloseToaster}
        store={useOrderTrackingStore}
        message={{
          successSubmission: 'successSubmission',
          failedSubmission: 'failedSubmission',
        }}
      />
      <ToolTip toolTipData={toolTipData} />
      <OrderTrackingGridPagination
        ref={customPaginationRef}
        onQueryChanged={onQueryChanged}
        disabled={isLoading}
        paginationAnalyticsLabel={analyticsCategories.pagination}
        resultsLabel={paginationLabels.results}
        ofLabel={paginationLabels.of}
      />
    </>
  );
};
export default MainGridFooter;
