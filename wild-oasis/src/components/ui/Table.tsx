import React, { ReactNode } from "react";

type TableProps = {
  children: ReactNode;
};

type TableHeaderProps = {
  className?: string;
  children: ReactNode;
};

type TableRowProps = {
  className?: string;
  children: ReactNode;
};

type TableCellProps = {
  children?: ReactNode;
  className?: string;
};

type TableBodyProps<T> = {
  data?: T[];
  render: (item: T, index: number) => React.ReactNode;
  actions?: (item: T, index: number) => React.ReactNode;
};

const Table: React.FC<TableProps> & {
  Header: React.FC<TableHeaderProps>;
  Row: React.FC<TableRowProps>;
  Cell: React.FC<TableCellProps>;
  Footer: React.FC<TableProps>;
  Body: <T>(props: TableBodyProps<T>) => React.ReactElement;
} = ({ children }) => {
  return (
    <div role="table" className="component-table">
      {children}
    </div>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({
  children = "",
  className = "",
}) => (
  <div className={`component-table-header ${className}`} role="row">
    {children}
  </div>
);

const TableRow: React.FC<TableRowProps> = ({
  children = "",
  className = "",
}) => (
  <div className={`component-table-row ${className}`} role="row">
    {children}
  </div>
);

const TableCell: React.FC<TableCellProps> = ({ children }) => (
  <div>{children}</div>
);

const TableFooter: React.FC<TableProps> = ({ children }) => (
  <div className="bg-gray-50 flex" role="row">
    {children}
  </div>
);

const TableBody = <T,>({ data, render }: TableBodyProps<T>) => {
  if (!data || data.length <= 0)
    return <p className="text-center">Sorry, there is nothing to display</p>;
  return (
    <div>
      {data.map((item, index) => (
        <span key={index}>{render(item, index)}</span>
      ))}
    </div>
  );
};

Table.Header = TableHeader;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.Footer = TableFooter;
Table.Body = TableBody;

export default Table;
