import { ReactNode } from "react";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function TransactionsTableLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead className="hidden md:table-cell lg:table-cell">
            Label
          </TableHead>
          <TableHead>CR/DR</TableHead>
          <TableHead className="md:text-right lg:text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </>
  );
}

export default TransactionsTableLayout;
