"use client";
import { CartesianGrid, XAxis, Line, LineChart, TooltipProps } from "recharts";
import { useDataContext } from "./_contexts/data-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Stats } from "./_types/stats";

const chartConfig = {
  today: {
    label: "Today",
    color: "var(--primary)",
  },
  average: {
    label: "Average",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function CustomToolTip({ active, payload, label }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null;
  const data: Stats = payload[0]["payload"];
  return (
    <div className="p-2 bg-popover rounded shadow">
      <div className="font-semibold mb-1">{label}</div>
      <div>Soul Eggs: {new Date(data.createdAt).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</div>
      <div>Prestiges: {data.prestiges}</div>
    </div>
  );
}

export default function StatsPage() {
  const { data, loading, error, refetch } = useDataContext();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mx-auto max-w-4xl w-full">
      <Card>
        <CardHeader>
          <CardTitle>Soul Egg Progression</CardTitle>
          {/* <CardDescription>
          Your exercise minutes are ahead of where you normally are.
        </CardDescription> */}
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
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  });
                }}
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
                dataKey="runningAvg"
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
              <ChartTooltip content={<CustomToolTip />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
