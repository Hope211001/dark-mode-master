import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const DataTablePagination = ({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  loading = false,
}: PaginationProps) => {
  // Ne pas afficher si une seule page ou pas de données
  if (totalPages <= 0) return null;

  return (
    <div className="p-4 border-t flex items-center justify-between bg-secondary/5">
      <div className="text-sm text-muted-foreground">
        Total : <b>{totalCount}</b> résultats
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>

          <div className="text-sm font-medium min-w-[80px] text-center">
            Page {currentPage} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};