export type ITransaction = {
  _id: string;
  type: "CREDIT" | "DEBIT";
  description: string;
  amount: number;
  label: string;
  createdAt: Date;
  status: "PENDING" | "ACCEPTED";
};
