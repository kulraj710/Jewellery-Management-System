import React from 'react';
import { useTable } from 'react-table';
import "../../styles/legacy/productTable.css"


const CustomTable = ({ data, columns } : any) => {
  // Initialize the table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()} style={{ borderCollapse: 'collapse', width: '100%' }} id="product-table-invoice">
      <thead>
        {headerGroups.map((headerGroup : any) => {
          const { key: headerKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
          return (
            <tr key={headerKey} {...headerGroupProps}>
              {headerGroup.headers.map((column : any) => {
                const { key: columnKey, ...columnProps } = column.getHeaderProps();
                return (
                  <th
                    key={columnKey}
                    {...columnProps}
                    style={{
                      border: '1px solid black',
                      padding: '1mm',
                      textAlign: 'center',
                    }}
                  >
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          const { key: rowKey, ...rowProps } = row.getRowProps();
          return (
            <tr key={rowKey} {...rowProps} id='lastCell'>
              {row.cells.map(cell => {
                const { key: cellKey, ...cellProps } = cell.getCellProps();
                return (
                  <td
                    key={cellKey}
                    {...cellProps}
                    style={{
                      // border: '1px solid green',
                      borderBottom: 'none',
                      padding: '1mm 0.9mm 1mm 0.9mm',
                      textAlign: 'center',
                      // verticalAlign : 'top'
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const ProductTable = ({sec4} : any) => {

    // Modify the `data` to include serial numbers starting from 1
    const modifiedData = sec4.map((item: any, index: number) => ({
      ...item,
      sno: index + 1,  // Assign serial number starting from 1
    }));

    const columns = [
    {
      Header: 'SNo',
      accessor: 'sno',
    },
    {
      Header: 'Product Description',
      accessor: 'pd',
    },
    {
      Header: 'HSN Code',
      accessor: 'hsn',
    },
    {
      Header: 'Pcs', 
      accessor: 'pcs',
    },
    {
      Header: 'Gr Wt',
      accessor: 'gr',
    },
    {
      Header: 'Net Wt',
      accessor: 'net',
    },
    {
      Header: 'Rate',
      accessor: 'rate',
    },
    {
      Header: 'Amount',
      accessor: 'amt',
    },
    {
      Header: 'Lbr Amt',
      accessor: 'lbr',
    },
    {
      Header: 'HUID Amt',
      accessor : 'huid'
    },
    {
      Header : 'O.Chrg',
      accessor : 'ochrg'
    },
    {
      Header: 'Total Amount',
      accessor: 'tval',
    },
  ];

  return (
    <div className='tableContainer'>
      {/* <div className='table'> */}
        <CustomTable data={modifiedData} columns={columns}/>
        {/* </div> */}
  </div>
  )
};

export default ProductTable;