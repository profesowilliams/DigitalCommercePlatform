import React from 'react';
import { useOrderTrackingStore } from '../../OrdersTrackingCommon/Store/OrderTrackingStore';
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
      <div className="grid-subheader-pagination-right">
        <OrderTrackingGridPagination
          ref={customPaginationRef}
          onQueryChanged={onQueryChanged}
          disabled={isLoading}
          paginationLabels={paginationLabels}
        />
      </div>
    </>
  );
};
export default MainGridFooter;
