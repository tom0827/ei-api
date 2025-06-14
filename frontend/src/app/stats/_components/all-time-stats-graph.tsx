import { CartesianGrid, XAxis, Line, LineChart, TooltipProps } from "recharts";
import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartConfig,
} from "@/components/ui/chart";
import { Stats } from "../_types/stats";
import { formatLargeNumber } from "@/app/_shared/number-format";
import { formatDate } from "@/app/_shared/date-format";

const chartConfig = {
  today: {
    label: "Today",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const CustomToolTip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (!active || !payload || !payload.length) return null;
  const data: Stats = payload[0]["payload"];
  return (
    <div className="p-2 bg-popover rounded shadow">
      <div className="font-semibold mb-1">
        {formatDate(data.createdAt)}
      </div>
      <div>Soul Eggs: {formatLargeNumber(data.soulEggs)}</div>
      <div>Prophecy Eggs: {data.prophecyEggs}</div>
      <div>Prestiges: {data.prestiges}</div>
    </div>
  );
};

interface StatsPageProps {
  data: Stats[];
}

const AllTimeStatsGraph = ({ data }: StatsPageProps) => {
  console.log(data);
  return (
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
            strokeWidth={1}
            stroke="var(--color-today)"
            dot={{
              r: 2,
              fill: "var(--color-today)",
            }}
            activeDot={{
              r: 6,
            }}
          />
          <ChartTooltip content={<CustomToolTip />} />
        </LineChart>
      </ChartContainer>
    </CardContent>
  );
};

export default AllTimeStatsGraph;
