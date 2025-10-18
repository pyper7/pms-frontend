import { useState, useMemo } from 'react';

export interface UseDataTableOptions<T> {
  data: T[];
  searchFields?: (keyof T)[];
  initialPageSize?: number;
  initialSortField?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
}

export interface UseDataTableReturn<T> {
  // Filtered and sorted data
  filteredData: T[];
  
  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  
  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  currentData: T[];
  
  // Sorting
  sortField: keyof T | null;
  sortDirection: 'asc' | 'desc';
  setSort: (field: keyof T, direction: 'asc' | 'desc') => void;
  handleSort: (field: keyof T) => void;
  
  // Statistics
  totalItems: number;
  filteredItems: number;
}

export function useDataTable<T extends Record<string, any>>({
  data,
  searchFields = [],
  initialPageSize = 10,
  initialSortField,
  initialSortDirection = 'asc'
}: UseDataTableOptions<T>): UseDataTableReturn<T> {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortField, setSortField] = useState<keyof T | null>(initialSortField || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm || searchFields.length === 0) {
      return data;
    }

    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(term);
      })
    );
  }, [data, searchTerm, searchFields]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortField) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Sort handlers
  const setSort = (field: keyof T, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'asc');
    }
  };

  // Reset pagination when search changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Reset pagination when page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    filteredData: sortedData,
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    totalPages,
    startIndex,
    endIndex,
    currentData,
    sortField,
    sortDirection,
    setSort,
    handleSort,
    totalItems: data.length,
    filteredItems: sortedData.length
  };
}

export default useDataTable;
