/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chip } from "@mui/material";

interface GenderChipProps {
  gender: number; // 0, 1, 2
}

const GenderChip = ({ gender }: GenderChipProps) => {
  // Bản đồ giới tính
  const genderMap: Record<
    number,
    {
      label: string;
      color: "primary" | "secondary" | "success" | "error" | "warning" | "info";
    }
  > = {
    0: { label: "Nam", color: "primary" },
    1: { label: "Nữ", color: "secondary" },
    2: { label: "Khác", color: "info" },
  };

  const genderInfo = genderMap[gender] || {
    label: "Không xác định",
    color: "default",
  };

  return (
    <Chip
      label={genderInfo.label}
      color={genderInfo.color as any}
      variant="outlined"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default GenderChip;
