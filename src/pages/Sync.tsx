"use client"

import { DashboardShell } from "@/components/layout/DashboardShell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Database,
  Box,
  ArrowRight,
  Server,
  Upload,
  CloudUpload,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react"
import ConnectionDialog from "@/components/blocks/connectDB/connectDialog"
import { useSegmentToggle } from "@/context/SegmentToggleContext"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSegmentData } from "@/context/SegmentDataContext"
import ConnectionCard from "@/components/blocks/Connection/ConnectionCard"
import { toast } from "sonner"

const sources = [
  {
    title: "Database",
    description: "Kết nối trực tiếp đến cơ sở dữ liệu của bạn",
    icon: Database,
    sources: ["PostgreSQL"],
    status: "có sẵn",
  },
]

const comingSoonSources = [
  {
    title: "Cloud Storage",
    description: "Nhập dữ liệu từ dịch vụ lưu trữ đám mây",
    icon: CloudUpload,
    sources: ["Amazon S3", "Google Cloud Storage", "Azure Blob Storage"],
    status: "sắp ra mắt",
  },
  {
    title: "File Upload",
    description: "Tải lên các tập tin từ máy tính của bạn",
    icon: Upload,
    sources: ["CSV", "Excel", "JSON"],
    status: "sắp ra mắt",
  },
]

export default function ImportData() {
  const { setConnectionDialog, connectionDialog } = useSegmentToggle()
  const { CONNECTION_STORAGE_KEY } = useSegmentData()
  const [activeTab, setActiveTab] = useState("all")
  const [recentConnections, setRecentConnections] = useState<any[]>([])

  useEffect(() => {
    // Get connection string from localStorage
    const connectionUrl = localStorage.getItem(CONNECTION_STORAGE_KEY)

    if (connectionUrl) {
      try {
        // Parse the connection URL
        const url = new URL(connectionUrl)

        // Extract connection details
        const username = url.username
        const hostname = url.hostname
        const port = url.port
        const database = url.pathname.replace("/", "")

        // Create a connection object
        const connection = {
          name: database || "Database",
          type: "PostgreSQL",
          status: "connected",
          lastSync: "Recently connected",
          host: hostname,
          port: port,
          username: username,
          database: database,
          tables: undefined,
          records: undefined,
        }

        setRecentConnections([connection])
      } catch (error) {
        console.error("Lỗi khi phân tích URL kết nối:", error)
        setRecentConnections([])
      }
    } else {
      setRecentConnections([])
    }
  }, [CONNECTION_STORAGE_KEY])

  const renderConnectionDialog = () => {
    setConnectionDialog(!connectionDialog)
  }

  useEffect(()=>{
    toast.success('Đã được kết nối với dữ liệu')
  },[recentConnections])

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Nguồn dữ liệu
            </h1>
            <p className="text-muted-foreground mt-1">Kết nối dữ liệu của bạn để ánh xạ vào mô hình của hệ thống</p>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <Layers className="h-4 w-4" />
                Tất cả các nguồn
              </TabsTrigger>
              <TabsTrigger value="connected" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Đã kết nối
              </TabsTrigger>
              <TabsTrigger value="coming-soon" className="gap-2">
                <Clock className="h-4 w-4" />
                Sắp ra mắt
              </TabsTrigger>
            </TabsList>
            <Button onClick={() => renderConnectionDialog()} className="gap-2">
              <Database className="h-4 w-4" />
              Kết nối cơ sở dữ liệu
            </Button>
          </div>

          <TabsContent value="all" className="space-y-6">
            {recentConnections.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Nguồn dữ liệu được kết nối
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentConnections.map((connection, index) => (
                    <ConnectionCard connection={connection} index={index} />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Nguồn dữ liệu có sẵn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sources.map((source) => (
                  <Card
                    key={source.title}
                    className="relative group hover:shadow-md transition-shadow border-primary/10"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full z-0"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-md bg-primary/10">
                          <source.icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{source.title}</CardTitle>
                      </div>
                      <CardDescription>{source.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-2">
                        {source.sources.map((item) => (
                          <Button
                            onClick={() => {
                              if (item === "PostgreSQL") {
                                renderConnectionDialog()
                              }
                            }}
                            key={item}
                            variant="outline"
                            className="w-full justify-between group/btn hover:border-primary"
                          >
                            <div className="flex items-center gap-2">
                              <Server className="w-4 h-4 text-primary" />
                              {item}
                            </div>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {comingSoonSources.map((source) => (
                  <Card
                    key={source.title}
                    className="relative group hover:shadow-md transition-shadow border-muted bg-muted/20"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-muted/30 rounded-bl-full z-0"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-md bg-muted/30">
                          <source.icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg text-muted-foreground">{source.title}</CardTitle>
                          <Badge variant="outline" className="ml-2 text-xs">
                            Sắp ra mắt
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-muted-foreground/80">{source.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-2">
                        {source.sources.map((item) => (
                          <Button
                            key={item}
                            variant="outline"
                            disabled
                            className="w-full justify-between opacity-60 cursor-not-allowed"
                          >
                            <div className="flex items-center gap-2">
                              <Box className="w-4 h-4" />
                              {item}
                            </div>
                            <Clock className="w-4 h-4" />
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connected">
            {recentConnections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentConnections.map((connection, index) => (
                  <Card key={index} className="border-green-100 bg-green-50/30 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-base">{connection.name}</CardTitle>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          Đang hoạt động
                        </Badge>
                      </div>
                      <CardDescription>Cơ sở dữ liệu {connection.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground">Host</p>
                          <p className="font-medium truncate max-w-[180px]">{connection.host}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground">Database</p>
                          <p className="font-medium">{connection.database}</p>
                        </div>
                        {connection.port && (
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground">Port</p>
                            <p className="font-medium">{connection.port}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {connection.lastSync}
                      </p>
                      {/* <Button variant="ghost" size="sm" className="h-7 gap-1">
                        Manage
                        <ArrowRight className="h-3 w-3" />
                      </Button> */}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Không có nguồn dữ liệu được kết nối</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Bạn chưa kết nối bất kỳ nguồn dữ liệu nào. Nhấp vào nút "Kết nối cơ sở dữ liệu" để bắt đầu.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="coming-soon">
            <div className="space-y-6">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Sắp ra mắt</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Các nguồn dữ liệu này hiện đang được phát triển và sẽ sớm có sẵn. Hãy theo dõi để cập nhật!
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comingSoonSources.map((source) => (
                  <Card
                    key={source.title}
                    className="relative group hover:shadow-md transition-shadow border-muted bg-muted/20"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-muted/30 rounded-bl-full z-0"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-md bg-muted/30">
                          <source.icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg text-muted-foreground">{source.title}</CardTitle>
                          <Badge variant="outline" className="ml-2 text-xs">
                            Sắp ra mắt
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-muted-foreground/80">{source.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-2">
                        {source.sources.map((item) => (
                          <Button
                            key={item}
                            variant="outline"
                            disabled
                            className="w-full justify-between opacity-60 cursor-not-allowed"
                          >
                            <div className="flex items-center gap-2">
                              <Box className="w-4 h-4" />
                              {item}
                            </div>
                            <Clock className="w-4 h-4" />
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <ConnectionDialog />
    </DashboardShell>
  )
}
