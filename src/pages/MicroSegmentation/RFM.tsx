"use client"

import { useContext, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RfmTreemap } from "@/components/blocks/RFM/rfm-treemap"
import { RfmSegmentTable } from "@/components/blocks/RFM/rfm-segment-table"
import { Badge } from "@/components/ui/badge"
import { axiosPrivate } from "@/API/axios"
import AuthContext from "@/context/AuthContext"
import { format } from "date-fns"
import { useLifeContext } from "@/context/LifecycleContext"
import DateRangePicker from "@/components/blocks/customerLifecycle/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { SyncSettingsDialog } from "@/components/blocks/RFM/DialogChooseSegmentSynx"
import { translateLabelToVietnamese } from "@/utils/segmentFunctionHelper"
import { translateSegmentName } from "@/utils/rfmFunctionHelper"

export interface segment_stats_interface {
  "segment": string,
  "count": number,
  "percentage": number
}

export interface rfm_scores_interface {
  "customer_id": string,
  "business_id": number,
  "recency_value": number,
  "frequency_value": number,
  "monetary_value": number,
  "r_score": number,
  "f_score": number,
  "m_score": number,
  "segment": string,
  "last_updated": string
}

export interface RFMInterface {
  "analyzed_customers": number,
  "period": {
    "start_date": string,
    "end_date": string
  },
  "segment_stats": segment_stats_interface[],
  "rfm_scores": rfm_scores_interface[]
}

export default function RFM() {
  const { token } = useContext(AuthContext)
  const [rfmData, setRfmData] = useState<RFMInterface>()
  const { startDate, endDate } = useLifeContext();
  const [dialogOpen, setDialogOpen] = useState(false)

  // useEffect(() => {
  //   console.log('rfm: ', rfmData);
  //   console.log('segment stats: ', rfmData?.segment_stats);
  // }, [rfmData])

  const fetchDataRfm = async () => {
    try {
      await axiosPrivate.post('/rfm/analyze-period',
        { start_date: format(startDate, "yyyy-MM-dd"), end_date: format(endDate, "yyyy-MM-dd") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRfmData(res.data?.data);
        })
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchDataRfm()
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Phân khúc RFM</h1>
          <p className="text-muted-foreground">Phân khúc khách hàng dựa trên thời gian gần nhất mua hàng, tần suất mua hàng và giá trị tiền tệ (Recency, Frequency, Monetary)</p>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="bg-primary" size="icon" onClick={() => {
                  setDialogOpen(true)
                }}>
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

      {rfmData ? <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rfmData?.analyzed_customers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{translateSegmentName("Champions")}</CardTitle>
              <Badge className="bg-teal-800 text-white">
                {rfmData?.segment_stats.find(item => item.segment === "Champions")?.percentage}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {rfmData?.segment_stats.find(item => item.segment === "Champions")?.count}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{translateSegmentName("At Risk")}</CardTitle>
              <Badge className="bg-red-500 text-white">
                {rfmData?.segment_stats.find(item => item.segment === "At Risk")?.percentage}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {rfmData?.segment_stats.find(item => item.segment === "At Risk")?.count}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{translateSegmentName("Hibernating")}</CardTitle>
              <Badge className="bg-cyan-600 text-white">
                {rfmData?.segment_stats.find(item => item.segment === "Hibernating")?.percentage}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rfmData?.segment_stats.find(item => item.segment === "Hibernating")?.count}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Phân khúc RFM</CardTitle>
            <CardDescription>
              RFM là viết tắt của Recency (Thời gian gần nhất mua hàng), Frequency (Tần suất mua hàng) và Monetary value (Giá trị tiền tệ), mỗi yếu tố này đại diện cho một đặc điểm quan trọng của khách hàng: số ngày kể từ lần mua hàng gần nhất, tổng số đơn hàng và giá trị vòng đời (Lifetime Value).
              Khách hàng sẽ được phân thành 5 nhóm cho mỗi chỉ số và được hiển thị trên bản đồ bên dưới, mỗi nhóm tương ứng với một trong mười phân khúc khách hàng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="treemap" className="space-y-4">
              <TabsList>
                <TabsTrigger value="treemap">Treemap</TabsTrigger>
                <TabsTrigger value="table">Bảng thông tin</TabsTrigger>
              </TabsList>
              <TabsContent value="treemap" className="space-y-4">
                {rfmData?.segment_stats.length > 0 &&
                  <RfmTreemap
                    rawData = {rfmData}
                    rfmData={rfmData?.segment_stats}
                  />}
              </TabsContent>
              <TabsContent value="table">
                {startDate && endDate && <RfmSegmentTable startDate={format(startDate, "yyyy-MM-dd")} endDate={format(endDate, "yyyy-MM-dd")}/>}
              </TabsContent>
            </Tabs>
          </CardContent>
          <SyncSettingsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} inputData={rfmData} selectBefore={null}/>
        </Card>
      </div> : (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-card-foreground"></div>
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>)}
    </div>
  )
}
