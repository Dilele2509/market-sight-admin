import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { User } from "@/types/user";

interface UserTableProps {
  users: User[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onUserSelect: (user: User) => void;
  getRoleName: (roleId: number) => string | null;
  formatDate: (date: string) => string;
}

const ROWS_PER_PAGE = 7;

export function UserTable({
  users,
  currentPage,
  setCurrentPage,
  onUserSelect,
  getRoleName,
  formatDate
}: UserTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .slice(
              (currentPage - 1) * ROWS_PER_PAGE,
              currentPage * ROWS_PER_PAGE
            )
            .map((user, index) => (
              <TableRow
                key={user.user_id}
                className="transition-colors hover:bg-background cursor-pointer"
                onClick={() => onUserSelect(user)}
              >
                <TableCell className="font-medium">
                  {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
                </TableCell>
                <TableCell className="truncate">{user.first_name}</TableCell>
                <TableCell className="truncate">{user.last_name}</TableCell>
                <TableCell className="truncate">{user.email}</TableCell>
                <TableCell>{getRoleName(user.role_id)}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {Math.ceil(users.length / ROWS_PER_PAGE) > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from(
              { length: Math.ceil(users.length / ROWS_PER_PAGE) },
              (_, i) => i + 1
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(
                  Math.min(Math.ceil(users.length / ROWS_PER_PAGE), currentPage + 1)
                )}
                className={
                  currentPage === Math.ceil(users.length / ROWS_PER_PAGE)
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 