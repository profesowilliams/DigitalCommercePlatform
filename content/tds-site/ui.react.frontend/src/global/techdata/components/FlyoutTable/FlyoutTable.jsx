import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';

export default function FlyoutTable({
  dataTable,
  selected,
  handleClick,
  handleSelectAllClick,
  headCells,
  checkboxEnabled,
}) {
  const rows = dataTable;
  const isSelected = (row) => {
    return selected.indexOf(row.id) !== -1;
  };

  const EnhancedTableHead = (props) => {
    const { onSelectAllClick, numSelected, rowCount } = props;
    return (
      <TableHead className={'cmp-flyout-table'}>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={checkboxEnabled ? onSelectAllClick : undefined}
              disabled={!checkboxEnabled}
              inputProps={{
                'aria-label': 'select all',
              }}
              sx={{
                color: '#262626',
                '&.Mui-checked': {
                  color: '#005758',
                },
                '&.MuiCheckbox-indeterminate': {
                  color: '#005758',
                },
              }}
            />
          </TableCell>
          {headCells?.map((headCell) => (
            <TableCell
              className={'cmp-flyout-table__header-headCell'}
              key={headCell.id}
              align={'left'}
              padding={'normal'}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };
  return (
    <Box className={'cmp-flyout-table'} sx={{ width: '100%' }}>
      <TableContainer>
        <Table
          sx={{ width: '100%' }}
          aria-labelledby="tableTitle"
          size={'small'}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={rows.length}
          />
          <TableBody>
            {rows?.map((row, index) => {
              const isItemSelected = isSelected(row);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  onClick={(event) => {
                    checkboxEnabled ? handleClick(event, row.id) : undefined;
                  }}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={index}
                  selected={isItemSelected}
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      padding={'normal'}
                      disabled={!checkboxEnabled}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                      sx={{
                        color: '#262626',
                        '&.Mui-checked': {
                          color: '#005758',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="normal"
                    sx={{ color: '#006FBA' }}
                  >
                    {row.id || row.Id}
                  </TableCell>
                  {headCells?.slice(1)?.map((headCell, id) => (
                    <TableCell key={id} align="left" sx={{ color: '#000000' }}>
                      {row[headCell.id]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}