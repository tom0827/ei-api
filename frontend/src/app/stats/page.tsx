"use client";
import { CartesianGrid, XAxis, Line, LineChart } from "recharts";
import { useDataContext } from "./_contexts/data-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  today: {
    label: "Today",
    color: "var(--primary)",
  },
  average: {
    label: "Average",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export default function StatsPage() {   
  const { data, loading, error, refetch } = useDataContext();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("Data:", data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Minutes</CardTitle>
        <CardDescription>
          Your exercise minutes are ahead of where you normally are.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full md:h-[200px]">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 16,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="createdAt"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <Line
              type="monotone"
              dataKey="soulEggs"
              strokeWidth={2}
              stroke="var(--color-today)"
              dot={{
                fill: "var(--color-today)",
              }}
              activeDot={{
                r: 5,
              }}
            />
            {/* <Line
              type="monotone"
              strokeWidth={2}
              dataKey="average"
              stroke="var(--color-average)"
              strokeOpacity={0.5}
              dot={{
                fill: "var(--color-average)",
                opacity: 0.5,
              }}
              activeDot={{
                r: 5,
              }}
            /> */}
            <ChartTooltip content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}