// src/pages/admin/UserManagement/components/UserStats.tsx
import React from "react";
import { Card, CardContent, Grid, Typography, Box } from "@mui/material";
import type { UserProfile } from "@/types/user.types";

interface UserStatsProps {
  users: UserProfile[];
  totalCount: number;
}

export const UserStats: React.FC<UserStatsProps> = ({ users, totalCount }) => {
  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;
  const lockedCount = users.filter((u) => u.isLocked).length;

  const stats = [
    {
      title: "Total Users",
      value: totalCount,
      icon: "👥",
      color: "primary.main",
    },
    {
      title: "Active Users",
      value: activeCount,
      icon: "✅",
      color: "success.main",
    },
    {
      title: "Inactive Users",
      value: inactiveCount,
      icon: "❌",
      color: "error.main",
    },
    {
      title: "Locked Users",
      value: lockedCount,
      icon: "🔒",
      color: "warning.main",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ fontSize: 40, color: stat.color }}>{stat.icon}</Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
