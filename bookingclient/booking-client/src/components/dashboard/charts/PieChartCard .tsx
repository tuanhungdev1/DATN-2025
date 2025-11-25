// components/dashboard/charts/PieChartCard.tsx
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartCardProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  height?: number;
  type?: "pie" | "doughnut";
}

export const PieChartCard = ({
  title,
  labels,
  data,
  backgroundColor = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
  ],
  height = 300,
  type = "doughnut",
}: PieChartCardProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor,
        borderColor: backgroundColor.map((color) => color.replace("0.6", "1")),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
      },
    },
  };

  const ChartComponent = type === "pie" ? Pie : Doughnut;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ height, mt: 2 }}>
          <ChartComponent data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};
