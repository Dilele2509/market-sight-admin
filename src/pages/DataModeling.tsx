"use client"

import { DashboardShell } from "@/components/layout/DashboardShell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect, useContext } from "react"
import { axiosPrivate } from "@/API/axios"
import AuthContext from "@/context/AuthContext"
import { AlertCircle, Database, FileCode, Loader2, Table2, TableProperties, Terminal, Wand2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import CodeMirror from "@uiw/react-codemirror"
import { sql } from "@codemirror/lang-sql"
import { useSegmentData } from "@/context/SegmentDataContext"
import { useSegmentToggle } from "@/context/SegmentToggleContext"
import { formatCellValue } from "@/components/blocks/segmentation/DefinitionTab/InforSetupState/PreviewDialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function DataModeling() {
  const { token } = useContext(AuthContext)
  const [tables, setTables] = useState<any>({})
  const [selectedTable, setSelectedTable] = useState<any>({})
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState("visual")

  const { CONNECTION_EXPIRY_KEY, CONNECTION_STORAGE_KEY, setError } = useSegmentData()
  const { setLoading, loading } = useSegmentToggle()

  const generateSchemaPattern = (tableName: string) => {
    return tableName ? `SELECT * FROM ${tableName} LIMIT 5;` : ""
  }

  useEffect(() => {
    axiosPrivate
      .get("/data/tables", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message)
          setTables(response.data.data)
          const firstTableName = Object.keys(response.data.data)[0]
          setSelectedTable({
            table: firstTableName,
            fields: response.data.data[firstTableName],
          })
          setQuery(generateSchemaPattern(firstTableName))
        } else {
          toast.error(response.data.message)
        }
      })
      .catch((error) => {
        console.error(error)
        toast.error(error)
      })
  }, [])

  const handleExecuteQuery = async () => {
    if (!selectedTable || !query) {
      toast.error("Please select a table and enter a query")
      return
    }

    if (!CONNECTION_EXPIRY_KEY) {
      toast.error("Please provide all database connection details")
      return
    }

    const connectionUrl = localStorage.getItem(CONNECTION_STORAGE_KEY)
    if (!connectionUrl) {
      toast.error("No database connection found")
      return
    }

    const url = new URL(connectionUrl)
    const username = url.username
    const password = url.password
    const host = url.hostname
    const port = url.port
    const database = url.pathname.replace("/", "")

    setLoading(true)
    setError(null)

    try {
      const requestData = {
        table: selectedTable.table,
        query,
        connection_details: {
          host,
          port,
          database,
          username,
          password,
        },
      }

      const response = await axiosPrivate.post(`/data/query`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setResults({
          data: response.data.data,
          columns: response.data.columns,
          row_count: response.data.row_count,
        })

        if (response.data.inserted_count > 0) {
          toast.success(
            `Query executed successfully! Retrieved ${response.data.row_count} rows and inserted ${response.data.inserted_count} rows into data warehouse.`,
          )
        } else {
          toast.warning(
            `Query executed successfully! Retrieved ${response.data.row_count} rows but could not insert into data warehouse.`,
          )
        }
      } else {
        setError("Query executed but returned no results")
        toast.warning("Query returned no results")
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to execute query"
      setError(errorMessage)
      toast.error(`Lỗi truy vấn: ${errorMessage}`)
      console.error("Thực hiện truy vấn không thành công:", err)
    } finally {
      setLoading(false)
    }
  }

  // Sample queries for common operations
  const sampleQueries = {
    customers: "SELECT customer_id, first_name, last_name, email, registration_date FROM customers LIMIT 10;",
    orders: "SELECT order_id, customer_id, order_date, total_amount FROM orders ORDER BY order_date DESC LIMIT 10;",
    products: "SELECT product_id, product_name, category, price FROM products ORDER BY category, price LIMIT 10;",
    orderItems:
      "SELECT oi.order_id, p.product_name, oi.quantity, oi.price FROM order_items oi JOIN products p ON oi.product_id = p.product_id LIMIT 10;",
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Mô hình hóa dữ liệu
          </h1>
          <p className="text-muted-foreground mt-1">
            Chuyển đổi và ánh xạ dữ liệu kinh doanh của bạn để tạo ra những hiểu biết rõ ràng và có thể sử dụng cho nhiều hành động.
          </p>
        </div>

        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 font-medium">Về Mô hình hóa dữ liệu</AlertTitle>
          <AlertDescription className="text-blue-700">
            Công cụ này giúp bạn ánh xạ dữ liệu kinh doanh của mình qua 4 bảng mặc định (khách hàng, đơn hàng, sản phẩm, mục đơn hàng) để làm cho dữ liệu của bạn trở nên rõ ràng và dễ áp dụng hơn. Sử dụng các truy vấn PostgreSQL để chuyển đổi và kết nối dữ liệu của bạn, nhằm cải thiện phân đoạn và phân tích.
          </AlertDescription>
        </Alert>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <TableProperties className="h-5 w-5 text-primary" />
              Schema Explorer
            </CardTitle>
            <CardDescription>
              Xem và phân tích cấu trúc dữ liệu của bạn để xây dựng các mô hình phân khúc hiệu quả
            </CardDescription>
          </CardHeader>

          <Separator className="mb-4" />

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid grid-cols-2 w-[300px]">
                  <TabsTrigger value="visual" className="flex items-center gap-2">
                    <Table2 className="h-4 w-4" />
                    Visual Schema
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    SQL Query
                  </TabsTrigger>
                </TabsList>

                <div className="w-[300px]">
                  <Select
                    defaultValue={tables && selectedTable > 0 ? selectedTable : ""}
                    onValueChange={(value) => {
                      const table = tables[value]
                      if (table) {
                        setSelectedTable({
                          table: value,
                          fields: table,
                        })
                        setQuery(generateSchemaPattern(value))
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue
                        placeholder={
                          tables && Object.keys(tables).length > 0 ? Object.keys(tables)[0] : "Select a table"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {tables &&
                        Object.entries(tables).map(([tableName]) => (
                          <SelectItem key={tableName} value={tableName} className="flex items-center hover:bg-background hover:cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Table className="h-4 w-4 text-muted-foreground" />
                              {tableName}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-2">
                <TabsContent value="visual">
                  <Card className="border border-border bg-card shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Table2 className="h-4 w-4 text-primary" />
                        Bảng: {selectedTable.table}
                      </CardTitle>
                      <CardDescription>Khám phá cấu trúc và kiểu dữ liệu của bảng này</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">Tên trường</TableHead>
                              <TableHead className="font-semibold">Kiểu dữ liệu</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedTable && selectedTable.fields ? (
                              Object.entries(selectedTable.fields).map(([fieldName, fieldType]) => (
                                <TableRow key={fieldName} className="hover:bg-muted/30">
                                  <TableCell className="font-medium">{String(fieldName)}</TableCell>
                                  <TableCell>
                                    <Badge className="w-fit px-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
                                      {String(fieldType)}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                                  Không có trường nào có sẵn
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="bg-muted/30 py-2 px-4 text-sm text-muted-foreground border-t">
                      {selectedTable && selectedTable.fields
                        ? `${Object.keys(selectedTable.fields).length} trường có sẵn trong bảng này`
                        : "Không có trường nào có sẵn"}
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="code">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <Card className="border border-border bg-card shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-primary" />
                            Trình soạn thảo truy vấn SQL
                          </CardTitle>
                          <CardDescription>Viết các truy vấn PostgreSQL để chuyển đổi và ánh xạ dữ liệu của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="p-4 bg-muted/30">
                            <div className="rounded-lg overflow-hidden border border-border">
                              <CodeMirror
                                value={query}
                                height="300px"
                                extensions={[sql()]}
                                theme="dark"
                                onChange={(value) => setQuery(value)}
                              />
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setQuery(sampleQueries.customers)}
                                  className="text-xs"
                                >
                                  Customers
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setQuery(sampleQueries.orders)}
                                  className="text-xs"
                                >
                                  Orders
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setQuery(sampleQueries.products)}
                                  className="text-xs"
                                >
                                  Products
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setQuery(sampleQueries.orderItems)}
                                  className="text-xs"
                                >
                                  Order Items
                                </Button>
                              </div>
                              <Button onClick={handleExecuteQuery} disabled={loading} className="gap-2">
                                {loading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Đang thực hiện...
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="h-4 w-4" />
                                    Thực hiện truy vấn
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <Card className="border border-border bg-card shadow-sm h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <TableProperties className="h-4 w-4 text-primary" />
                            Các trường có sẵn
                          </CardTitle>
                          <CardDescription>Các trường bạn có thể sử dụng trong truy vấn của mình</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {selectedTable?.fields ? (
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(selectedTable.fields).map(([field, type]) => (
                                <div
                                  key={field}
                                  className="border border-border rounded-md px-3 py-1.5 text-sm flex flex-col"
                                  title={`${String(type)}`}
                                >
                                  <span className="font-medium">{field}</span>
                                  <span className="text-xs text-muted-foreground">{String(type)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">Không có trường nào có sẵn</div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {results?.data && (
                    <Card className="mt-4 border border-border bg-card shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Table2 className="h-4 w-4 text-primary" />
                          Kết quả truy vấn
                        </CardTitle>
                        <CardDescription>Dữ liệu trả về từ truy vấn của bạn</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="max-h-[440px] overflow-auto">
                          <Table className="w-full text-sm">
                            <TableHeader>
                              <TableRow className="bg-muted/50">
                                {results.columns.map((column: string) => (
                                  <TableHead key={column} className="font-semibold px-4 py-2 text-left">
                                    {column}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {results.data.map((row: any, rowIndex: number) => (
                                <TableRow key={rowIndex} className="hover:bg-muted/30">
                                  {results.columns.map((column: string) => (
                                    <TableCell key={`${rowIndex}-${column}`} className="px-4 py-2">
                                      {formatCellValue(row[column])}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/30 py-2 px-4 text-sm text-muted-foreground border-t">
                        Tổng số hàng: {results.row_count}
                      </CardFooter>
                    </Card>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
