/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Chip } from "@mui/material";

interface RoleChipsProps {
  roles: string[];
}

const RoleChips = ({ roles }: RoleChipsProps) => {
  // Bản đồ chuyển đổi vai trò → nhãn tiếng Việt + màu sắc
  const roleMap: Record<
    string,
    {
      label: string;
      color: "primary" | "secondary" | "success" | "error" | "warning" | "info";
    }
  > = {
    Admin: { label: "Quản trị viên", color: "error" },
    Host: { label: "Chủ nhà", color: "primary" },
    User: { label: "Người dùng", color: "success" },
    Guest: { label: "Khách", color: "info" },
  };

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {roles.map((role) => {
        const roleInfo = roleMap[role] || { label: role, color: "default" };
        return (
          <Chip
            key={role}
            label={roleInfo.label}
            color={roleInfo.color as any}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        );
      })}
    </Box>
  );
};

export default RoleChips;
