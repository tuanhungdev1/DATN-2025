// components/common/UserProfileSkeleton.tsx
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";

const UserProfileSkeleton = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Header: Title + Edit link */}
      <Box
        mb={3}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h3">
          <Skeleton width={180} />
        </Typography>
        <Skeleton width={60} height={32} />
      </Box>

      {/* Card 1: Thông tin cơ bản */}
      <Card sx={{ mb: 3, borderRadius: "4px" }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            <Skeleton width={120} />
          </Typography>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                <Typography variant="body2" color="text.secondary">
                  <Skeleton width={80} />
                </Typography>
                <Typography variant="body1">
                  <Skeleton width="80%" />
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Card 2: Thông tin bổ sung */}
      <Card sx={{ mb: 3, borderRadius: "4px" }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            <Skeleton width={140} />
          </Typography>
          <Grid container spacing={2}>
            {/* Giới tính */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <Skeleton width={60} />
              </Typography>
              <Skeleton width={80} height={32} variant="rounded" />
            </Grid>
            {/* Ngày sinh */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <Skeleton width={70} />
              </Typography>
              <Skeleton width={100} />
            </Grid>
            {/* Địa chỉ */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                <Skeleton width={60} />
              </Typography>
              <Skeleton width="100%" />
            </Grid>
            {/* Mã bưu điện */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                <Skeleton width={90} />
              </Typography>
              <Skeleton width={70} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Card 3: Trạng thái tài khoản */}
      <Card sx={{ mb: 3, borderRadius: "4px" }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            <Skeleton width={150} />
          </Typography>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                <Typography variant="body2" color="text.secondary">
                  <Skeleton width={i % 2 === 0 ? 100 : 120} />
                </Typography>
                <Skeleton width={90} height={32} variant="rounded" />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Card 4: Vai trò */}
      <Card sx={{ borderRadius: "4px" }}>
        <CardContent>
          <Typography variant="h6">
            <Skeleton width={60} />
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            {[1, 2].map((i) => (
              <Skeleton key={i} width={70} height={32} variant="rounded" />
            ))}
            <Skeleton width={100} height={20} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfileSkeleton;
