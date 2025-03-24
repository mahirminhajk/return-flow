import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export const SkeletonLoaderForCard = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-full" />
  </div>
);

export const SkeletonLoaderForTable = () => (
  <>
    <TableRow>
      <TableCell colSpan={5} className="p-4">
        <div className="h-8">
          <Skeleton className="h-full" />
        </div>
      </TableCell>
    </TableRow>
  </>
);
