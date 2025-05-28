<<<<<<< HEAD
"use client"

import { useContext, useEffect, useState } from "react"
import {
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, getYear } from "date-fns"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { LineChartCard, BarChartCard, PieChartCard } from "@/components/dashboard/ChartDashboard"
import { DashboardShell } from "@/components/layout/DashboardShell"
import DateRangePicker from "@/components/blocks/customerLifecycle/date-range-picker"
import { axiosPrivate } from "@/API/axios"
import { useLifeContext } from "@/context/LifecycleContext"
import AuthContext from "@/context/AuthContext"
import { QuickInsightsCard } from "@/components/dashboard/QuickInsightCard"
import { MonthlyDetailDropdown } from "@/components/dashboard/DropdownSelect"

export interface dashboardDataInterface {
  period: {
    start_date: string,
    end_date: string,
  },
  values: {
    gmv: number,
    orders: number,
    unique_customers: number,
    aov: number,
    avg_bill_per_user: number,
    arpu: number,
    orders_per_day: number,
    orders_per_day_per_store: number,
  },
  changes: {
    gmv: number,
    orders: number,
    unique_customers: number,
    aov: number,
    avg_bill_per_user: number,
    arpu: number,
    orders_per_day: number,
    orders_per_day_per_store: number,
  },
}

export interface rawDataInterface {
  success: boolean,
  data: {
    "metrics": dashboardDataInterface[],
    "is_monthly_breakdown": boolean,
    "time_window": {
      "start_date": string,
      "end_date": string
    }
  }
}

export default function Dashboard() {
  const { startDate, endDate } = useLifeContext();
  const { token } = useContext(AuthContext)
  const [rawData, setRawData] = useState<rawDataInterface>()
  const [dashboardData, setDashboardData] = useState<dashboardDataInterface>()

  // The 8 specific metrics to display
  const metricsToShow = [
    "gmv",
    "orders",
    "unique_customers",
    "aov",
    "avg_bill_per_user",
    "arpu",
    "orders_per_day",
    "orders_per_day_per_store",
  ]

  // Metrics with smaller values that should use the right y-axis
  const smallValueMetrics = ["orders", "unique_customers", "orders_per_day", "orders_per_day_per_store"]

  const fetchDataDashboard = async () => {
    try {
      const res = await axiosPrivate.post('/customer-lifecycle/topline-metrics',
        { start_date: format(startDate, "yyyy-MM-dd"), end_date: format(endDate, "yyyy-MM-dd") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log('check: ', res.data);
      setRawData(res.data);
      if (res.data?.data?.is_monthly_breakdown && Array.isArray(res.data?.data?.metrics)) {
        const metrics = res.data?.data?.metrics
        const lastElement = metrics[metrics.length - 1]
        //console.log('last: ', lastElement)
        setDashboardData(lastElement)
      } else if (!res.data?.data?.is_monthly_breakdown && Array.isArray(res.data?.data?.metrics)) {
        const metrics = res.data?.data?.metrics
        setDashboardData(metrics[0])
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  }

=======
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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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

>>>>>>> 82912c6 (update admin)
  useEffect(() => {
    // console.log("startDate:", startDate);
    // console.log("endDate:", endDate);
    fetchDataDashboard()
  }, [startDate, endDate])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

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
<<<<<<< HEAD
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 bg-background px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Tổng quan hoạt động</h1>
          </div>
        </header>
        <div className="w-full flex items-center justify-end pr-6"><DateRangePicker /></div>

        <main className="flex-1 p-4 md:p-6">
          {dashboardData ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* GMV Card */}
            <MetricCard
              title="Tổng giá trị hàng hóa"
              value={dashboardData?.values?.gmv}
              change={dashboardData?.changes?.gmv}
              icon={<DollarSignIcon />}
              isCurrency={true}
            />

            {/* Orders Card */}
            <MetricCard
              title="Tổng số lượng đơn hàng"
              value={dashboardData?.values?.orders}
              change={dashboardData?.changes?.orders}
              icon={<ShoppingCartIcon />}
              isCurrency={false}
              precision={0}
            />

            {/* Unique Customers Card */}
            <MetricCard
              title="Khách hàng thực tế"
              value={dashboardData?.values?.unique_customers}
              change={dashboardData?.changes?.unique_customers}
              icon={<UsersIcon />}
              isCurrency={false}
              precision={0}
            />

            {/* AOV Card */}
            <MetricCard
              title="Giá trị đơn hàng trung bình"
              value={dashboardData?.values?.aov}
              change={dashboardData?.changes?.aov}
              icon={<CreditCardIcon />}
              isCurrency={true}
            />
          </div> : (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-card-foreground"></div>
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>)}

          <div className="mt-6">
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <label className="font-bold">Tổng quan</label>
                <div className="flex items-center gap-4">
                  {rawData && <MonthlyDetailDropdown
                    data={rawData?.data?.metrics}
                    currentData={dashboardData}
                    resetCurrentData={setDashboardData} />}
                  <label className="font-medium text-sm flex items-center gap-1">Từ ngày: <p className="text-red-600 mr-2">{dashboardData?.period?.start_date}</p> đến ngày: <p className="text-red-600">{dashboardData?.period?.end_date}</p></label>
                </div>
              </div>

              {dashboardData ? <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* Avg Bill Per User Card */}
                  <MetricCard
                    title="Mức chi tiêu trung bình mỗi khách hàng"
                    value={dashboardData.values.avg_bill_per_user}
                    change={dashboardData.changes.avg_bill_per_user}
                    icon={<TrendingDownIcon />}
                    isCurrency={true}
                  />

                  {/* ARPU Card */}
                  <MetricCard
                    title="Doanh thu bình quân trên mỗi khách hàng"
                    value={dashboardData.values.arpu}
                    change={dashboardData.changes.arpu}
                    icon={<TrendingUpIcon />}
                    isCurrency={true}
                  />

                  {/* Orders Per Day Card */}
                  <MetricCard
                    title="Tổng hơn hàng mỗi ngày"
                    value={dashboardData.values.orders_per_day}
                    change={dashboardData.changes.orders_per_day}
                    icon={<ShoppingCartIcon />}
                    isCurrency={false}
                  />

                  <MetricCard
                    title="Hiệu suất đặt hàng hàng ngày theo cửa hàng"
                    value={dashboardData.values.orders_per_day_per_store}
                    change={dashboardData.changes.orders_per_day_per_store}
                    icon={<ShoppingBagIcon />}
                    isCurrency={false}
                  />
                </div>

                {/* GMV Trend Chart */}
                <LineChartCard
                  title="Business Performance Metrics"
                  description="Monthly comparison of all key business metrics"
                  data={rawData?.data?.metrics}
                  dataKeys={metricsToShow}
                  smallValueKeys={smallValueMetrics}
                  xAxisDataKey="month"
                  height={500}
                  valueFormatter={(value) =>
                    typeof value === "number" ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value
                  }
                />

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Orders vs Customers Chart */}
                  <BarChartCard
                    title="Orders vs Customers"
                    description="Monthly comparison for the period"
                    data={rawData?.data?.metrics}
                    barKeys={["orders", "unique_customers"]}
                    xAxisDataKey="name"
                    height={300}
                  />

                  {/* AOV Distribution Chart */}
                  <PieChartCard
                    title="AOV Distribution"
                    description={`Order value distribution for period`}
                    data={rawData?.data?.metrics}
                    dataKey="value"
                    nameKey="name"
                    height={300}
                    valueFormatter={(value) => `${value} orders`}
                  />
                </div>
              </div> : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-card-foreground"></div>
                  <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
                </div>)}
            </div>
          </div>

          {dashboardData ? <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full lg:col-span-2">
              <CardHeader>
                <CardTitle>Hiệu suất tổng hợp</CardTitle>
                <CardDescription>So sánh các số liệu chính với tháng trước đó</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* GMV Performance */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">GMV</p>
                      <p className="text-xs text-muted-foreground">Tổng giá trị hàng hóa</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{formatCurrency(dashboardData.values.gmv)}</span>
                      <span
                        className={`text-xs ${dashboardData.changes.gmv >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {dashboardData.changes.gmv > 0 ? "+" : ""}
                        {dashboardData.changes.gmv.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Orders Performance */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Đơn hàng</p>
                      <p className="text-xs text-muted-foreground">Tổng số lượng đơn hàng</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{dashboardData.values.orders}</span>
                      <span
                        className={`text-xs ${dashboardData.changes.orders >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {dashboardData.changes.orders > 0 ? "+" : ""}
                        {dashboardData.changes.orders.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Customers Performance */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Khách hàng</p>
                      <p className="text-xs text-muted-foreground">Tổng số khách hàng thực tế</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{dashboardData.values.unique_customers}</span>
                      <span
                        className={`text-xs ${dashboardData.changes.unique_customers >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {dashboardData.changes.unique_customers > 0 ? "+" : ""}
                        {dashboardData.changes.unique_customers.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* AOV Performance */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">AOV</p>
                      <p className="text-xs text-muted-foreground">Giá trị đơn hàng trung bình</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{formatCurrency(dashboardData.values.aov)}</span>
                      <span
                        className={`text-xs ${dashboardData.changes.aov >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {dashboardData.changes.aov > 0 ? "+" : ""}
                        {dashboardData.changes.aov.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <QuickInsightsCard data={dashboardData} />
          </div> : (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-card-foreground"></div>
              <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
            </div>)}
        </main>
=======
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
>>>>>>> 82912c6 (update admin)
      </div>
    </DashboardShell>
  )
}
