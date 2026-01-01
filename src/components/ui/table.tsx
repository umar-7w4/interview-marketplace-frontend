import React from "react";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}
export function Table({ children, className = "", ...props }: TableProps) {
  return (
    <table
      className={`min-w-full text-base text-gray-200 ${className}`} // <-- text-sm is here
      {...props}
    >
      {children}
    </table>
  );
}

interface TableHeadProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}
export function TableHead({
  children,
  className = "",
  ...props
}: TableHeadProps) {
  return (
    <thead className={`bg-[#2c304d] text-gray-200 ${className}`} {...props}>
      {children}
    </thead>
  );
}

interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}
export function TableBody({
  children,
  className = "",
  ...props
}: TableBodyProps) {
  return (
    <tbody
      className={`bg-[#1e2239] divide-y divide-gray-600 ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
export function TableRow({
  children,
  className = "",
  ...props
}: TableRowProps) {
  return (
    <tr
      className={`hover:bg-[#2c304d]/30 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {}
export function TableCell({
  children,
  className = "",
  ...props
}: TableCellProps) {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-base ${className}`} // <-- text-sm is here
      {...props}
    >
      {children}
    </td>
  );
}
