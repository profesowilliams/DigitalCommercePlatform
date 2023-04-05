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
  headCells
}) {
  const rows = dataTable
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const EnhancedTableHead = (props) => {
    const { onSelectAllClick, numSelected, rowCount } = props;
    return (
      <TableHead className={'cmp-flyout-table__header'}>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
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
            <TableCell key={headCell.id} align={'left'} padding={'normal'}>
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
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
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
                    {row.id}
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