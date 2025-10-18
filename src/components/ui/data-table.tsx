import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { 
  ChevronUp, 
  ChevronDown, 
  Search,
  Filter,
  Download,
  Plus
} from 'lucide-react';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  search?: {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
  };
  filters?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
  };
  actions?: {
    primary?: {
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
    };
    secondary?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
    }>;
  };
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  className?: string;
  tableClassName?: string;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc';
  };
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyState,
  search,
  filters,
  pagination,
  actions,
  title,
  subtitle,
  showHeader = true,
  className = '',
  tableClassName = '',
  onSort,
  sortConfig
}: DataTableProps<T>) {
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.pageSize : 0;
  const endIndex = pagination ? startIndex + pagination.pageSize : data.length;
  const currentData = pagination ? data.slice(startIndex, endIndex) : data;

  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const direction = sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort(key, direction);
  };

  const generatePageNumbers = () => {
    if (!pagination) return [];
    
    const pages = [];
    const maxVisiblePages = 5;
    const { currentPage, totalPages } = pagination;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('ellipsis-start');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('ellipsis-end');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      {(search || filters) && (
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            {search && (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={search.placeholder || 'Search...'}
                    value={search.value}
                    onChange={(e) => search.onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
            {filters && (
              <div className="flex items-center space-x-2">
                {filters}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Card className="overflow-hidden">
            {/* Table Header with Controls */}
            {showHeader && (
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {title && (
                      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    )}
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                      {data.length} total
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    {pagination?.onPageSizeChange && (
                      <>
                        <Label htmlFor="items-per-page" className="text-sm text-gray-600">
                          Show:
                        </Label>
                        <select
                          id="items-per-page"
                          value={pagination.pageSize}
                          onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {(pagination.pageSizeOptions || [10, 20, 50, 100]).map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </>
                    )}
                    {actions?.secondary?.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant || 'outline'}
                        size="sm"
                        onClick={action.onClick}
                      >
                        {action.icon && <span className="mr-2">{action.icon}</span>}
                        {action.label}
                      </Button>
                    ))}
                    {actions?.primary && (
                      <Button
                        onClick={actions.primary.onClick}
                        variant={actions.primary.variant || 'default'}
                        className={actions.primary.variant === 'default' ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm' : ''}
                      >
                        {actions.primary.icon && <span className="mr-2">{actions.primary.icon}</span>}
                        {actions.primary.label}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Table Content */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">Loading data...</p>
                  </div>
                </div>
              ) : (
                <table className={`w-full ${tableClassName}`}>
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                            column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                          } ${column.headerClassName || ''}`}
                          style={{ width: column.width }}
                          onClick={() => column.sortable && handleSort(column.key)}
                        >
                          <div className="flex items-center space-x-1">
                            <span>{column.title}</span>
                            {column.sortable && (
                              <div className="flex flex-col">
                                <ChevronUp 
                                  className={`w-3 h-3 ${
                                    sortConfig?.key === column.key && sortConfig?.direction === 'asc' 
                                      ? 'text-gray-900' 
                                      : 'text-gray-400'
                                  }`} 
                                />
                                <ChevronDown 
                                  className={`w-3 h-3 -mt-1 ${
                                    sortConfig?.key === column.key && sortConfig?.direction === 'desc' 
                                      ? 'text-gray-900' 
                                      : 'text-gray-400'
                                  }`} 
                                />
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            {emptyState?.icon && (
                              <div className="mb-4">{emptyState.icon}</div>
                            )}
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {emptyState?.title || 'No data found'}
                            </h3>
                            <p className="text-gray-500 mb-4">
                              {emptyState?.description || 'There is no data to display.'}
                            </p>
                            {emptyState?.action && (
                              <Button onClick={emptyState.action.onClick} className="mt-2">
                                {emptyState.action.label}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentData.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          {columns.map((column) => (
                            <td
                              key={column.key}
                              className={`px-6 py-4 ${column.className || ''}`}
                            >
                              {column.render
                                ? column.render(
                                    column.dataIndex ? record[column.dataIndex] : record[column.key],
                                    record,
                                    index
                                  )
                                : column.dataIndex
                                ? record[column.dataIndex]
                                : record[column.key]
                              }
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Enhanced Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-700">
                    <span>
                      Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                      <span className="font-semibold">{Math.min(endIndex, data.length)}</span> of{' '}
                      <span className="font-semibold">{data.length}</span> results
                    </span>
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
                          className={pagination.currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {generatePageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => pagination.onPageChange(page as number)}
                              isActive={pagination.currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                          className={pagination.currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
