"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import type { AnalyticsDashboardData } from "@/types/analytics.types"

interface AnalyticsDashboardProps {
  data: AnalyticsDashboardData
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  // Кольори для графіків
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  // Форматування часу прослуховування
  const formatListeningTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${hours}г ${minutes}хв`
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Перегляди сторінок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalPageViews}</div>
            <p className="text-xs text-muted-foreground">За останні 30 днів</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Унікальні відвідувачі</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">За останні 30 днів</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Прослуховування треків</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.trackPlays}</div>
            <p className="text-xs text-muted-foreground">За останні 30 днів</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Час прослуховування радіо</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatListeningTime(data.radioListeningTime)}</div>
            <p className="text-xs text-muted-foreground">За останні 30 днів</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Перегляди за днями</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.pageViewsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getDate()}.${date.getMonth() + 1}`
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} переглядів`, "Перегляди"]}
                  labelFormatter={(label) => {
                    const date = new Date(label)
                    return date.toLocaleDateString("uk-UA")
                  }}
                />
                <Bar dataKey="count" fill="#8884d8" name="Перегляди" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Розподіл за пристроями</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.deviceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="device"
                    label={({ device, percent }) => `${device}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.deviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name, props) => [`${value} переглядів`, props.payload.device]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Розподіл за країнами</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.countryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="country"
                    label={({ country, percent }) => `${country}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.countryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name, props) => [`${value} переглядів`, props.payload.country]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

