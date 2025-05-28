import type { Metadata } from "next"
import { ArrowUpRight, Calendar, Download, Filter, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerLifecycleChart } from "@/components/blocks/customerLifecycle/customer-lifecycle-chart"
import { CustomerMetricsTable } from "@/components/blocks/customerLifecycle/customer-metrics-table"
import { LifecycleStageCard } from "@/components/blocks/customerLifecycle/lifecycle-stage-card"
import { MetricCard } from "@/components/blocks/customerLifecycle/metric-card"
import { useContext, useEffect, useState } from "react"
import { axiosPrivate } from "@/API/axios"
import AuthContext from "@/context/AuthContext"
import { toast } from "sonner"
import { AggregatedMetrics, BreakdownMonthly, CLSList, MetricsValue } from "@/types/lifecycleTypes"
import { useLifeContext } from "@/context/LifecycleContext"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import MetricsLineGraph from "@/components/blocks/customerLifecycle/line-graph-component"
import LifecycleGMVCard from "../../components/blocks/customerLifecycle/LifecycleGMVCard"
import DateRangePicker from "@/components/blocks/customerLifecycle/date-range-picker"
import { BarChartCLS } from "@/components/blocks/customerLifecycle/bar-chart-cls"
import { ConfigSyncCLS } from "@/components/blocks/customerLifecycle/DialogConfigSynx"

export const metadata: Metadata = {
  title: "Customer Lifecycle Analysis",
  description: "Analyze customer behavior across different lifecycle stages",
}

export default function CustomerLifecyclePage() {
  const sortOrder = ["new", "early", "mature", "loyal"];
  const { startDate, endDate } = useLifeContext();
  const [isOpenSyncDialog, setIsOpenSyncDialog] = useState(false)
  const { token } = useContext(AuthContext);
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  const [cusLifeList, setCusLifeList] = useState<CLSList>({});
  const [dataMonthly, setDataMonthly] = useState<Object[]>([]);
  const [dataGMV, setDataGMV] = useState<Object[]>([]);

  // useEffect(() => {
  //   console.log(cusLifeList)
  // }, [cusLifeList])

  const monthMap = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
    5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
    9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
  };

  const formatCustomerData = (inputData: BreakdownMonthly[]): any[] => {
    const result = inputData.map((values, index) => {
      const endDateRaw = values?.period?.end_date || "";
      const endDate = new Date(endDateRaw);
      const month = endDate.getMonth() + 1;
      const year = endDate.getFullYear();

      const isValidDate = !isNaN(endDate.getTime());

      return {
        month: isValidDate ? `${monthMap[month]} ${year}` : "Invalid Date",
        new: values?.stages.New.customer_count || 0,
        early: values?.stages["Early-life"].customer_count || 0,
        mature: values?.stages.Mature.customer_count || 0,
        loyal: values?.stages.Loyal.customer_count || 0,
      };
    });

    //console.log('result: ', result);
    return result;
  };


  const formatGMVData = (inputData: Object) => {
    const result = Object.entries(inputData).map(([title, values]) => {
      const startDateRaw = values?.period?.start_date || "";
      const startDate = new Date(startDateRaw);
      const month = startDate.getMonth() + 1;
      const year = startDate.getFullYear();

      const isValidDate = !isNaN(startDate.getTime());

      return {
        month: isValidDate ? `${monthMap[month]} ${year}` : "Invalid Date",
        GMV: values?.values?.["gmv"] || 0,
        Orders: values?.values?.["orders"] || 0,
        Customers: values?.values?.["customer_count"] || 0,
      };
    });

    return result;
  };

  // useEffect(() => {
  //   console.log('datamonthly: ', dataMonthly);
  // }, [dataMonthly])

  // useEffect(()=>{
  //   console.log('gmv: ', dataGMV);
  //   console.log('fetch list: ', cusLifeList);
  // },[dataGMV, cusLifeList])

  const fetchLineGraphTotalData = async () => {
    try {
      await axiosPrivate.post('/customer-lifecycle/stage-breakdown',
        { start_date: format(startDate, "yyyy-MM-dd"), end_date: format(endDate, "yyyy-MM-dd") },
        header
      )
        .then(async (res) => {
          if (res.status === 200) {
            //console.log('check cls breakdown before format: ', res.data.data.monthly_breakdown);
            const formatData = await formatCustomerData(res.data.data.monthly_breakdown)
            //console.log('format data: ', await formatCustomerData(res.data.data.monthly_breakdown));
            setDataMonthly(formatData)
          }
        })
    } catch (error) {
      console.log(error);
      toast.error('no data at this time')
    }
  }

  const fetchSegmentList = async () => {
    // console.log(format(date, "yyyy-MM-dd"), timeRange)
    const segments = [
      { key: 'new', url: '/customer-lifecycle/new-customers' },
      { key: 'early', url: '/customer-lifecycle/early-life-customers' },
      { key: 'mature', url: '/customer-lifecycle/mature-customers' },
      { key: 'loyal', url: '/customer-lifecycle/loyal-customers' },
    ];

    try {
      await Promise.all(
        segments.map(async ({ key, url }) => {
          try {
            const res = await axiosPrivate.post(
              url,
              { start_date: format(startDate, "yyyy-MM-dd"), end_date: format(endDate, "yyyy-MM-dd") },
              header
            );

            if (res.status === 200) {
              const data = res.data.data;
              //console.log('data after fetch: ',data);
              setDataGMV((prev) => ({
                ...prev,
                [key]: formatGMVData(data.metrics)
              }));

              setCusLifeList((prev) => ({
                ...prev,
                [key]: {
                  name: data.segment,
                  metrics: data.metrics,
                  customers: data.customers,
                  aggregated_metrics: data.aggregated_metrics,
                  time_window: data.time_window,
                },
              }));
            }
          } catch (err) {
            console.log(err);
            toast.error('no data at this time');
          }
        })
      );
    } catch (error) {
      toast.error('no data at this time');
    }
  };

  useEffect(() => {
    fetchSegmentList();
    fetchLineGraphTotalData();
  }, [startDate, endDate]);

  const excludedKeysEarly = ['unique_customers', 'avg_bill_per_user', 'orders_per_day', 'gmv', 'aov', 'arpu', 'orders', 'orders_per_day', 'orders_per_day_per_store'];
  const excludedKeys = ['unique_customers', 'avg_bill_per_user', 'orders_per_day', 'gmv', 'aov', 'arpu', 'orders', 'orders_per_day', 'orders_per_day_per_store'];

  const getMetricsWithoutKeys = (metricValueList: any, excluded: string[]) => {
    return Object.entries(metricValueList)
      .filter(([key]) => !excluded.includes(key))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as any);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 md:gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Phân Tích Vòng Đời Khách Hàng</h1>
            <p className="text-muted-foreground">
              Theo dõi hành vi và số liệu của khách hàng trong các giai đoạn vòng đời khác nhau
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DateRangePicker />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled={!cusLifeList} variant="outline" className="bg-primary" size="icon" onClick={() => { setIsOpenSyncDialog(true) }}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Nhấp để đồng bộ dữ liệu
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {dataGMV && cusLifeList && dataMonthly ? <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="table">Bảng thông tin</TabsTrigger>
            <TabsTrigger value="metrics">Tăng trưởng số liệu</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Customer Lifecycle Distribution</CardTitle>
                  <CardDescription>Distribution of customers across lifecycle stages</CardDescription>
                </CardHeader>
                {dataMonthly.length > 0 && <CardContent className="px-2">
                  <CustomerLifecycleChart data={dataMonthly} className="aspect-[2/1]" />
                </CardContent>}
              </Card>
              <Card>
                <CardHeader className="h-1/5">
                  <CardTitle>Customer Segment Performance</CardTitle>
                  <CardDescription>Normalized metrics (0-100%) by segment</CardDescription>
                </CardHeader>
                <CardContent className="h-4/5">
                  {Object.entries(cusLifeList).length > 0 &&
                    <BarChartCLS data={cusLifeList} />
                  }
                </CardContent>
              </Card>
            </div>


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {cusLifeList && Object.entries(cusLifeList)
                .sort(([keyA], [keyB]) => {
                  return sortOrder.indexOf(keyA) - sortOrder.indexOf(keyB);
                })
                .map(([key, value], index) => {
                  //console.log(key, ' name: ', value?.name, ' combine metric: ', value?.aggregated_metrics);
                  //console.log('check function: ',getMetricsWithoutKeys(cusLifeList?.new.aggregated_metrics, excludedKeys))

                  return (
                    <LifecycleStageCard
                      key={index}
                      title={value.name}
                      count={value.metrics.customer_count}
                      metrics={getMetricsWithoutKeys(value?.aggregated_metrics, key === 'early' ? excludedKeysEarly : excludedKeys)}
                      color={key}
                    />
                  )
                }
                )}
            </div>
          </TabsContent>
          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Detailed breakdown of customer segments and their behavior</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(cusLifeList).length > 0 && <CustomerMetricsTable tableData={cusLifeList} />}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Metrics</CardTitle>
                <CardDescription>Key performance indicators across all lifecycle stages</CardDescription>
              </CardHeader>
              <CardContent>
                <LifecycleGMVCard GMVData={dataGMV} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs> : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-card-foreground"></div>
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        )}
      </main>
      <ConfigSyncCLS open={isOpenSyncDialog} onClose={() => { setIsOpenSyncDialog(false)}} data={cusLifeList} />
    </div>
  )
}
