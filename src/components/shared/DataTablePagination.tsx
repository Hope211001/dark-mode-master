import { Pagination } from "@/components/Pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const DataTablePagination = (props: PaginationProps) => {
  return <Pagination {...props} />;
};
