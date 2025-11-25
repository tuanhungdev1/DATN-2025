// src/pages/admin/ReviewManagement/AdminReviewDetailDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Avatar,
  Divider,
  Rating,
  Chip,
  Paper,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { AppButton } from "@/components/button";
import type { Review } from "@/types/review.types";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  X,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  User,
} from "lucide-react";

interface AdminReviewDetailDialogProps {
  open: boolean;
  review: Review | null;
  onClose: () => void;
  onAddHostResponse?: (reviewId: number, response: string) => Promise<void>;
  onUpdateHostResponse?: (reviewId: number, response: string) => Promise<void>;
  onDeleteHostResponse?: (reviewId: number) => Promise<void>;
  isAdmin?: boolean;
}

export const AdminReviewDetailDialog: React.FC<
  AdminReviewDetailDialogProps
> = ({
  open,
  review,
  onClose,
  onAddHostResponse,
  onUpdateHostResponse,
  onDeleteHostResponse,
  isAdmin = true,
}) => {
  const [showResponseInput, setShowResponseInput] = useState(false);
  const [hostResponse, setHostResponse] = useState("");
  const [isEditingResponse, setIsEditingResponse] = useState(false);
  const [responseAnchorEl, setResponseAnchorEl] = useState<null | HTMLElement>(
    null
  );

  if (!review) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmitResponse = async () => {
    if (!hostResponse.trim()) return;

    try {
      if (isEditingResponse && onUpdateHostResponse) {
        await onUpdateHostResponse(review.id, hostResponse);
      } else if (onAddHostResponse) {
        await onAddHostResponse(review.id, hostResponse);
      }
      setHostResponse("");
      setShowResponseInput(false);
      setIsEditingResponse(false);
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const handleEditResponse = () => {
    setHostResponse(review.hostResponse || "");
    setIsEditingResponse(true);
    setShowResponseInput(true);
    setResponseAnchorEl(null);
  };

  const handleDeleteResponse = async () => {
    if (confirm("Bạn có chắc muốn xóa phản hồi này?") && onDeleteHostResponse) {
      try {
        await onDeleteHostResponse(review.id);
        setResponseAnchorEl(null);
      } catch (error) {
        console.error("Error deleting response:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setHostResponse("");
    setIsEditingResponse(false);
    setShowResponseInput(false);
  };

  const ratingCategories = [
    { label: "Độ sạch sẽ", value: review.cleanlinessRating },
    { label: "Vị trí", value: review.locationRating },
    { label: "Giá trị tiền bạc", value: review.valueForMoneyRating },
    { label: "Giao tiếp", value: review.communicationRating },
    { label: "Nhận phòng", value: review.checkInRating },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Chi tiết đánh giá
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Review Info Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Avatar
                src={review.reviewerAvatar || undefined}
                sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
              >
                {review.reviewerName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 0.5,
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {review.reviewerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {review.reviewerId}
                    </Typography>
                  </Box>
                  <Chip
                    label={review.isVisible ? "Công khai" : "Ẩn"}
                    size="small"
                    color={review.isVisible ? "success" : "default"}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Calendar size={14} />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(review.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Homestay Info */}
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <MapPin size={16} color="#666" />
                <Typography variant="body2" fontWeight={600}>
                  {review.homestayTitle}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <User size={16} color="#666" />
                <Typography variant="body2" color="text.secondary">
                  Chủ nhà: {review.revieweeName} (ID: {review.revieweeId})
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Overall Rating */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
              Đánh giá tổng thể
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                bgcolor: "primary.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "primary.100",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Star size={32} fill="#FFB400" color="#FFB400" />
                <Typography variant="h4" fontWeight={700}>
                  {review.overallRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / 5.0
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Rating
                  value={review.overallRating}
                  readOnly
                  size="large"
                  precision={0.5}
                />
                {review.isRecommended && (
                  <Chip
                    label="Được giới thiệu"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ mt: 1, fontWeight: 600 }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Detailed Ratings */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
              Đánh giá chi tiết
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
              }}
            >
              {ratingCategories.map((category) => (
                <Paper
                  key={category.label}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {category.label}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    <Rating
                      value={category.value}
                      readOnly
                      size="small"
                      precision={0.5}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {category.value.toFixed(1)}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Review Comment */}
          {review.reviewComment && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                Nhận xét
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}
                >
                  {review.reviewComment}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Helpful Count */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.5,
              bgcolor: "grey.50",
              borderRadius: 1,
              width: "fit-content",
            }}
          >
            <ThumbsUp size={16} />
            <Typography variant="body2" fontWeight={600}>
              {review.helpfulCount} người thấy hữu ích
            </Typography>
          </Box>

          <Divider />

          {/* Host Response Section */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MessageSquare size={20} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Phản hồi từ chủ nhà
                </Typography>
              </Box>
              {!review.hostResponse && !showResponseInput && isAdmin && (
                <AppButton
                  size="small"
                  variant="outlined"
                  onClick={() => setShowResponseInput(true)}
                  startIcon={<MessageSquare size={16} />}
                >
                  Thêm phản hồi
                </AppButton>
              )}
            </Box>

            {/* Existing Host Response */}
            {review.hostResponse && !showResponseInput && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: "primary.50",
                  borderRadius: 2,
                  border: "2px solid",
                  borderColor: "primary.200",
                  position: "relative",
                }}
              >
                {isAdmin && (
                  <IconButton
                    size="small"
                    onClick={(e) => setResponseAnchorEl(e.currentTarget)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                )}

                <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "secondary.main",
                    }}
                  >
                    H
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {review.revieweeName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.hostRespondedAt &&
                        formatDate(review.hostRespondedAt)}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ pl: 6.5, lineHeight: 1.8, whiteSpace: "pre-wrap" }}
                >
                  {review.hostResponse}
                </Typography>

                {/* Response Menu */}
                <Menu
                  anchorEl={responseAnchorEl}
                  open={Boolean(responseAnchorEl)}
                  onClose={() => setResponseAnchorEl(null)}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleEditResponse}>
                    <Edit size={16} style={{ marginRight: 8 }} />
                    Chỉnh sửa
                  </MenuItem>
                  <MenuItem onClick={handleDeleteResponse}>
                    <Trash2 size={16} style={{ marginRight: 8 }} />
                    Xóa phản hồi
                  </MenuItem>
                </Menu>
              </Paper>
            )}

            {/* Response Input */}
            {showResponseInput && (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder={
                    isEditingResponse
                      ? "Chỉnh sửa phản hồi của bạn..."
                      : "Viết phản hồi cho đánh giá này..."
                  }
                  value={hostResponse}
                  onChange={(e) => setHostResponse(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "flex-end",
                    mt: 1.5,
                  }}
                >
                  <AppButton
                    variant="outlined"
                    size="small"
                    onClick={handleCancelEdit}
                  >
                    Hủy
                  </AppButton>
                  <AppButton
                    size="small"
                    onClick={handleSubmitResponse}
                    disabled={!hostResponse.trim()}
                  >
                    {isEditingResponse ? "Cập nhật" : "Gửi phản hồi"}
                  </AppButton>
                </Box>
              </Box>
            )}

            {/* No Response Message */}
            {!review.hostResponse && !showResponseInput && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px dashed",
                  borderColor: "grey.300",
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Chưa có phản hồi từ chủ nhà
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Metadata */}
          <Box
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              <strong>Booking ID:</strong> {review.bookingId} •{" "}
              <strong>Review ID:</strong> {review.id}
            </Typography>
            <br />
            <Typography variant="caption" color="text.secondary">
              <strong>Cập nhật lần cuối:</strong> {formatDate(review.updatedAt)}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <AppButton variant="outlined" onClick={onClose} fullWidth>
          Đóng
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
