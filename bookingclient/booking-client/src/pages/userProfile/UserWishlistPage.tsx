/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import {
  useGetUserWishlistQuery,
  useClearWishlistMutation,
} from "@/services/endpoints/wishlist.api";
import { useToast } from "@/hooks/useToast";
import { AppButton } from "@/components/button";
import HomestayCard from "@/components/homestayCard/HomestayCard";

const UserWishlistPage = () => {
  const toast = useToast();

  const [openClearDialog, setOpenClearDialog] = useState(false);

  const { data, isLoading, error } = useGetUserWishlistQuery({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    pageNumber: 1,
    pageSize: 100,
  });
  const [clearWishlist, { isLoading: isClearing }] = useClearWishlistMutation();

  const wishlistItems = data?.data?.items || [];
  const totalCount = data?.data?.totalCount || 0;

  const handleClearWishlist = async () => {
    try {
      const result = await clearWishlist().unwrap();
      if (result.success) {
        toast.success("Đã xóa toàn bộ danh sách yêu thích");
        setOpenClearDialog(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Có lỗi xảy ra");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Có lỗi xảy ra khi tải danh sách yêu thích. Vui lòng thử lại sau.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Danh sách yêu thích
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalCount} homestay
          </Typography>
        </Box>

        {wishlistItems.length > 0 && (
          <AppButton
            variant="outlined"
            color="error"
            startIcon={<Trash2 size={18} />}
            onClick={() => setOpenClearDialog(true)}
          >
            Xóa tất cả
          </AppButton>
        )}
      </Box>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có homestay nào trong danh sách yêu thích
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Khám phá và thêm những homestay bạn yêu thích vào đây
          </Typography>
          <AppButton
            variant="contained"
            onClick={() => (window.location.href = "/")}
          >
            Khám phá homestay
          </AppButton>
        </Box>
      ) : (
        <>
          {/* Wishlist Grid */}
          <Grid container spacing={3}>
            {wishlistItems.map((item) => (
              <Grid
                key={item.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <HomestayCard homestay={item.homestay} viewMode="grid" />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Clear Wishlist Dialog */}
      <Dialog
        open={openClearDialog}
        onClose={() => setOpenClearDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xóa toàn bộ danh sách yêu thích?</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa tất cả {totalCount} homestay khỏi danh
            sách yêu thích không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClearDialog(false)}>Hủy</Button>
          <AppButton
            onClick={handleClearWishlist}
            color="error"
            variant="contained"
            disabled={isClearing}
          >
            {isClearing ? "Đang xóa..." : "Xóa tất cả"}
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserWishlistPage;
