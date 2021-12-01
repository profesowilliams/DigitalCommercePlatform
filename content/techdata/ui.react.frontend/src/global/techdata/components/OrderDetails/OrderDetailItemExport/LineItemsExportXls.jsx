import React, { useState } from "react";
import { useLineItemExport } from "./hooks/useOrderDetailExport";

const LineItemsExportXls = ({ columnList = [], onPayloadChange }) => {
    const {checkboxList,selectAllState,updateCheckboxList,switchSelectAll, itemsSelected} = useLineItemExport(columnList);
    return (
        <>
            <p className="cmp-export-xls-subtitle">Select columns to include in the XLS</p>
            <div className="cmp-column-checkbox-info">
                <p className="cmp-column-checkbox-info__deselect" onClick={switchSelectAll}>{selectAllState}</p>
                <p className="selected">{itemsSelected()} selected</p>
            </div>
            <div className="cmp-column-checkbox-export">
                {checkboxList && checkboxList.map((column) => (
                    <div key={column.columnKey} className="cmp-column-checkbox-export__checkbox">
                        <label htmlFor={column.columnKey} value={column.columnKey}>
                            <input type="checkbox" onChange={updateCheckboxList} id={column?.columnKey} checked={column.checked} />
                            <span className="checkbox"></span>
                            <span className="columnLabel">{column.columnLabel}</span>

                        </label>
                    </div>
                ))}
            </div>
        </>

    );
};
export default LineItemsExportXls;