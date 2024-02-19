import React from 'react';
import { useOrderTrackingStore } from '../store/OrderTrackingStore';
import Toaster from '../../Widgets/Toaster';
import ToolTip from '../../BaseGrid/ToolTip';
import OrderTrackingGridPagination from '../Pagination/OrderTrackingGridPagination';

const MainGridFooter = ({
  analyticsCategories,
  onQueryChanged,
  onCloseToaster,
  customPaginationRef,
  isLoading,
  paginationLabels,
}) => {
  const toolTipData = useOrderTrackingStore((st) => st.toolTipData);

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
        closeEnabled={true}
      />
      <ToolTip toolTipData={toolTipData} />
      <div className="grid-subheader-pagination">
        <OrderTrackingGridPagination
          ref={customPaginationRef}
          onQueryChanged={onQueryChanged}
          disabled={isLoading}
          paginationAnalyticsLabel={analyticsCategories.pagination}
          resultsLabel={paginationLabels.results}
          ofLabel={paginationLabels.of}
        />
      </div>
    </>
  );
};
export default MainGridFooter;
