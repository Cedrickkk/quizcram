import PaginationLink from '@/components/pagination-link';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { PaginatedData } from '@/types';

interface PaginationFooterProps<T> {
  data: PaginatedData<T>;
}

export function PaginationFooter<T>({ data }: PaginationFooterProps<T>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground text-xs">
        Showing {data?.data?.length} of {data?.total}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="w-full text-xs font-medium">
          Page {data?.current_page} of {data?.last_page}
        </div>
        <Pagination>
          <PaginationContent>
            {data?.links.map((link, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink link={link} className="text-xs" />
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
