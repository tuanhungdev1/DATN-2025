// components/dashboard/StatCard.tsx
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react"; // Thay TrendingFlat bằng ArrowRightLeft

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive?: boolean; // Tự động suy ra từ value
  };
  color?: "primary" | "success" | "error" | "warning" | "info";
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "primary",
}: StatCardProps) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0)
      return (
        <TrendingUp size={16} strokeWidth={2} className="text-green-600" />
      );
    if (trend.value < 0)
      return (
        <TrendingDown size={16} strokeWidth={2} className="text-red-600" />
      );
    return (
      <ArrowRightLeft size={16} strokeWidth={2} className="text-gray-500" />
    );
  };

  const getTrendColor = (): "success" | "error" | "default" => {
    if (!trend) return "default";
    if (trend.value > 0) return "success";
    if (trend.value < 0) return "error";
    return "default";
  };

  const trendLabel = trend
    ? `${trend.value > 0 ? "+" : ""}${trend.value.toFixed(1)}%`
    : "";

  return (
    <Card
      sx={{
        height: "100%",
        borderLeft: `4px solid`,
        borderLeftColor: `${color}.main`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                backgroundColor: `${color}.50`,
                color: `${color}.main`,
                p: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {trend && (
          <Chip
            icon={getTrendIcon() || undefined}
            label={trendLabel}
            size="small"
            color={getTrendColor()}
            variant="outlined"
            sx={{
              "& .MuiChip-icon": {
                marginLeft: "8px",
                marginRight: "-4px",
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};
