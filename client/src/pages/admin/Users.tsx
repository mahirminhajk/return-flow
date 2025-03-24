import { useAdminGetAllUsers } from "@/api/apiHooks/adminApiHooks";
import AppPagination from "@/components/app/appPagination";
import UserTable from "@/components/tables/userTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ITEMS_PER_PAGE } from "@/config";
import { ROUTES } from "@/config/routes";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Users() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, isSuccess, error } = useAdminGetAllUsers({
    page: currentPage.toString(),
    limit: ITEMS_PER_PAGE.toString(),
    search,
  });

  useEffect(() => {
    if (isError) {
      const customError = error as Error & { type?: string };
      if (customError.type === "UNAUTHORIZED") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Session expired. Please login again.",
        });
        navigate(ROUTES.ADMIN_LOGIN, { replace: true });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch transactions",
        });
      }
    }

    if (isSuccess && data?.data?.transactions?.length !== 0) {
      setMaxPage(data?.data?.pagination?.totalPages);
      setCurrentPage(data?.data?.pagination?.page);
    }
  }, [isError, isSuccess, data, error]);

  //* pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage === 1) return;

    setCurrentPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage === maxPage) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // get the value from the input field
    const searchValue = e.currentTarget.search.value;
    // set the search state to the value
    setSearch(searchValue);
  };

  return (
    <div className="w-full px-4">
      <div className="grid w-full gap-2 grid-cols-[6fr_1fr]">
        {/* Input Field */}
        <form onSubmit={handleSearchSubmit}>
          <Input
            disabled={isLoading}
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search Users"
            className="w-full"
          />
        </form>
        {/* Create Button */}
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          onClick={() => {
            navigate(ROUTES.ADMIN_CREATE_USER);
          }}
        >
          <div className="flex items-center justify-center">
            <Plus scale={20} />
            <span className="ml-1">Create</span>
          </div>
        </Button>
      </div>
      <UserTable
        data={data?.data?.users}
        isLoading={isLoading}
        isError={isError}
        isEmpty={data?.data?.users?.length === 0}
        errorMess={(error as unknown as Error)?.message as string}
      >
        <AppPagination
          currentPage={currentPage}
          maxPage={maxPage}
          handlePageChange={handlePageChange}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
        />
      </UserTable>
    </div>
  );
}

export default Users;
