import { useContext, useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  Users,
  TrendingUp,
  Check,
  X,
  Calendar,
  Building2,
  Mail,
  User,
  Clock,
  Activity,
  BarChart3,
  Users2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosPrivate } from "@/API/axios";
import AuthContext from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTable } from "@/components/dashboard/UserTable";
import { PendingTable } from "@/components/dashboard/PendingTable";
import { PendingDialog } from "@/components/dashboard/PendingDialog";
import { UserDialog } from "@/components/dashboard/UserDialog";
import { Loading } from "@/components/ui/loading";

interface User {
  user_id: number;
  business_id: number;
  role_id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface PendingAccount {
  user_id: number;
  business_id: number;
  role_id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  verify_id: number;
  token: string;
  action?: 'accept' | 'decline';
}

const monthOptions = [
  { value: "1", label: "Tháng trước" },
  { value: "3", label: "3 Tháng trước" },
  { value: "6", label: "6 Tháng trước" },
  { value: "9", label: "9 Tháng trước" },
  { value: "12", label: "12 Tháng trước" },
];

const roleOptions = [
  { value: "all", label: "Tất cả người dùng" },
  { value: "2", label: "Nhóm Data" },
  { value: "3", label: "Nhóm Marketing" },
];

const getRoleName = (roleId: number) => {
  switch (roleId) {
    case 2:
      return "Nhóm Data";
    case 3:
      return "Nhóm Marketing";
    default:
      return null;
  }
};

const getBusinessName = (businessId: number) => {
  return "RetailCorp";
};

const ROWS_PER_PAGE = 7;

const Index = () => {
  const [selectedMonths, setSelectedMonths] = useState("1");
  const [selectedRole, setSelectedRole] = useState("all");
  const [userData, setUserData] = useState({
    users: 0,
    ratio_trend: 0,
    user_data: [] as User[]
  });
  const [pendingAccounts, setPendingAccounts] = useState<PendingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingUsers, setRemovingUsers] = useState<Set<number>>(new Set());
  const { token } = useContext(AuthContext);
  const [selectedAccount, setSelectedAccount] = useState<PendingAccount | null>(null);
  const [selectedVerifiedUser, setSelectedVerifiedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("users");
  const [currentVerifiedPage, setCurrentVerifiedPage] = useState(1);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.post("/user-growth", {
          months: parseInt(selectedMonths),
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [selectedMonths, token]);

  useEffect(() => {
    const fetchPendingAccounts = async () => {
      try {
        const response = await axiosPrivate.get("/waiting-verify-users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPendingAccounts(response.data);
      } catch (error) {
        console.error("Error fetching pending accounts:", error);
      }
    };

    fetchPendingAccounts();
  }, [token]);

  const handleAccept = async (verifyId: number, email: string, reqToken: string) => {
    try {
      setRemovingUsers(prev => new Set(prev).add(verifyId));
      const response = await axiosPrivate.post('/accept-account', {
        verifyId: verifyId,
        email: email,
        reqToken: reqToken
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        // Remove from list after successful acceptance
        setTimeout(() => {
          setPendingAccounts(prev => prev.filter(account => account.verify_id !== verifyId));
          // Close dialog if the accepted user was being viewed
          if (selectedAccount?.verify_id === verifyId) {
            setSelectedAccount(null);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error accepting account:", error);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error(`Invalid input: ${error.response.data.message}`);
            break;
          case 500:
            toast.error(`Server error: ${error.response.data.message}`);
            break;
          default:
            toast.error('An unexpected error occurred');
        }
      } else {
        toast.error('Network error occurred');
      }
    } finally {
      setTimeout(() => {
        setRemovingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(verifyId);
          return newSet;
        });
      }, 500);
    }
  };

  const handleDecline = async (verifyId: number, email: string, user_id: number) => {
    try {
      setRemovingUsers(prev => new Set(prev).add(verifyId));
      const response = await axiosPrivate.post('/decline-account', {
        verifyId: verifyId,
        userId: user_id,
        email: email
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        // Remove from list after successful decline
        setTimeout(() => {
          setPendingAccounts(prev => prev.filter(account => account.verify_id !== verifyId));
          // Close dialog if the declined user was being viewed
          if (selectedAccount?.verify_id === verifyId) {
            setSelectedAccount(null);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error declining account:", error);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error(`Invalid input: ${error.response.data.message}`);
            break;
          case 500:
            toast.error(`Server error: ${error.response.data.message}`);
            break;
          default:
            toast.error('An unexpected error occurred');
        }
      } else {
        toast.error('Network error occurred');
      }
    } finally {
      setTimeout(() => {
        setRemovingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(verifyId);
          return newSet;
        });
      }, 500);
    }
  };

  const filteredUsers = pendingAccounts.filter(user => {
    if (selectedRole === "all") return getRoleName(user.role_id) !== null;
    return user.role_id === parseInt(selectedRole);
  });

  const filteredVerifiedUsers = userData.user_data.filter(user => {
    if (selectedRole === "all") return getRoleName(user.role_id) !== null;
    return user.role_id === parseInt(selectedRole);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardShell>
      {loading && <Loading />}
      <div className="space-y-8 animate-in">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chào mừng trở lại, Admin</h1>
            <p className="text-lg text-muted-foreground">
              Đây là tổng quan về quản lý người dùng hôm nay.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-[200px]">
              <Select
                value={selectedMonths}
                onValueChange={setSelectedMonths}
              >
                <SelectTrigger className="bg-card border-primary/20">
                  <SelectValue placeholder="Chọn khoảng thời gian" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {monthOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="hover:bg-background"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Tổng số người dùng</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : userData.users}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Người dùng đang hoạt động trong hệ thống
              </p>
              <div className="mt-4 h-[60px]">
                <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ width: `${Math.min(100, (userData.users / 1000) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Tỷ lệ tăng trưởng</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : `${userData.ratio_trend.toFixed(2)}%`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {`Tăng trưởng trong ${selectedMonths} ${parseInt(selectedMonths) === 1 ? 'tháng' : 'tháng'}`}
              </p>
              <div className="mt-4 h-[60px] flex items-end">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 mx-[1px] bg-primary/10 rounded-t"
                    style={{
                      height: `${20 + Math.random() * 40}px`,
                    }}
                  >
                    <div
                      className="w-full bg-primary transition-all"
                      style={{
                        height: `${userData.ratio_trend > 0 ? 100 : 0}%`,
                        opacity: 0.5 + (i / 7) * 0.5,
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Đang chờ duyệt</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAccounts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Người dùng đang chờ xác thực
              </p>
              <div className="mt-4 h-[60px]">
                <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ 
                      width: `${Math.min(100, (pendingAccounts.length / 20) * 100)}%`,
                      backgroundColor: pendingAccounts.length > 10 ? 'var(--warning)' : undefined
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl font-bold">Quản lý người dùng</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Quản lý và giám sát tài khoản người dùng
              </p>
            </div>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger className="w-[180px] bg-card border-primary/20">
                <SelectValue placeholder="Lọc theo vai trò" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {roleOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-background"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="users" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="users" className="flex-1 max-w-[200px]">
                  <Users2 className="w-4 h-4 mr-2" />
                  Tất cả người dùng
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1 max-w-[200px]">
                  <Activity className="w-4 h-4 mr-2" />
                  Đang chờ duyệt
                  {pendingAccounts.length > 0 && (
                    <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                      {pendingAccounts.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users">
                <UserTable
                  users={filteredVerifiedUsers}
                  currentPage={currentVerifiedPage}
                  setCurrentPage={setCurrentVerifiedPage}
                  onUserSelect={setSelectedVerifiedUser}
                  getRoleName={getRoleName}
                  formatDate={formatDate}
                />
              </TabsContent>
              
              <TabsContent value="pending">
                <PendingTable
                  users={filteredUsers}
                  currentPage={currentPendingPage}
                  setCurrentPage={setCurrentPendingPage}
                  onUserSelect={setSelectedAccount}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  getRoleName={getRoleName}
                  removingUsers={removingUsers}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <UserDialog
          user={selectedVerifiedUser}
          open={!!selectedVerifiedUser}
          onOpenChange={(open) => !open && setSelectedVerifiedUser(null)}
          getRoleName={getRoleName}
          getBusinessName={getBusinessName}
          formatDate={formatDate}
        />

        <PendingDialog
          user={selectedAccount}
          open={!!selectedAccount}
          onOpenChange={(open) => !open && setSelectedAccount(null)}
          onAccept={handleAccept}
          onDecline={handleDecline}
          getRoleName={getRoleName}
          getBusinessName={getBusinessName}
          formatDate={formatDate}
          removingUsers={removingUsers}
        />
      </div>
    </DashboardShell>
  )
}

export default Index;
