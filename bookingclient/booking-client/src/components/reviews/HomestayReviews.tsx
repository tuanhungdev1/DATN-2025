/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/reviews/HomestayReviews.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  LinearProgress,
  IconButton,
  TextField,
  Rating,
  Chip,
  Stack,
} from "@mui/material";
import {
  Star,
  ThumbsUp,
  MoreVertical,
  Edit,
  Trash2,
  EyeOff,
  MessageSquare,
} from "lucide-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useReview } from "@/hooks/useReview";
import {
  useGetHomestayReviewsQuery,
  useGetHomestayReviewStatsQuery,
} from "@/services/endpoints/review.api";
import type { Review, CreateReview, UpdateReview } from "@/types/review.types";
import { FormTextField } from "../Input";
import { AppButton } from "../button";
import { FormCheckbox } from "../checkbox";

interface HomestayReviewsProps {
  homestayId: number;
  currentUserId?: number;
  isHost?: boolean;
  canReview?: boolean;
  bookingId?: number;
  hostAvatar?: string;
}

// Validation schema
const reviewValidationSchema = Yup.object({
  overallRating: Yup.number()
    .min(1, "Vui lòng chọn đánh giá")
    .required("Bắt buộc"),
  cleanlinessRating: Yup.number()
    .min(1, "Vui lòng chọn đánh giá")
    .required("Bắt buộc"),
  locationRating: Yup.number()
    .min(1, "Vui lòng chọn đánh giá")
    .required("Bắt buộc"),
  valueForMoneyRating: Yup.number()
    .min(1, "Vui lòng chọn đánh giá")
    .required("Bắt buộc"),
  communicationRating: Yup.number()
    .min(1, "Vui lòng chọn đánh giá")
    .required("Bắt buộc"),
  checkInRating: Yup.number()
    .min(1, "Vui lòng chọn đánh giá")
    .required("Bắt buộc"),
  reviewComment: Yup.string().max(1000, "Tối đa 1000 ký tự"),
  isRecommended: Yup.boolean(),
});

// RatingBar Component
const RatingBar: React.FC<{
  label: string;
  count: number;
  total: number;
  rating: number;
}> = ({ count, total, rating }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          minWidth: 60,
          position: "relative",
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          {rating}
        </Typography>
        <Star
          size={14}
          fill="#FFB400"
          color="#FFB400"
          className="ml-0.5"
          style={{
            position: "absolute",
            left: "10px",
            top: 2,
          }}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "rgba(0,0,0,0.08)",
            "& .MuiLinearProgress-bar": {
              bgcolor: "#FFB400",
              borderRadius: 4,
            },
          }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 30 }}>
        {count}
      </Typography>
    </Box>
  );
};

// ReviewStatistics Component
const ReviewStatistics: React.FC<{ homestayId: number }> = ({ homestayId }) => {
  const { data: statsData, isLoading } =
    useGetHomestayReviewStatsQuery(homestayId);
  const stats = statsData?.data;

  if (isLoading || !stats) return null;

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 4, bgcolor: "grey.50", borderRadius: 2 }}
    >
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Box sx={{ flex: "0 0 auto" }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
            <Typography variant="h2" fontWeight={700}>
              {stats.averageOverallRating.toFixed(1)}
            </Typography>
            <Star size={32} fill="#FFB400" color="#FFB400" />
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {stats.totalReviews} đánh giá
          </Typography>
          <Typography variant="body2" color="success.main" fontWeight={500}>
            {stats.recommendationPercentage}% khách hàng giới thiệu
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Phân bổ đánh giá
          </Typography>
          {[5, 4, 3, 2, 1].map((rating) => (
            <RatingBar
              key={rating}
              label={`${rating} sao`}
              count={stats.ratingDistribution[rating] || 0}
              total={stats.totalReviews}
              rating={rating}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

// ReviewItem Component
const ReviewItem: React.FC<{
  review: Review;
  currentUserId?: number;
  isHost?: boolean;
  hostAvatar?: string;
  onEdit: (review: Review) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  onMarkHelpful: (id: number) => void;
  onAddHostResponse: (id: number, response: string) => void;
  onUpdateHostResponse: (id: number, response: string) => void;
  onDeleteHostResponse: (id: number) => void;
}> = ({
  review,
  currentUserId,
  isHost,
  hostAvatar,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMarkHelpful,
  onAddHostResponse,
  onUpdateHostResponse,
  onDeleteHostResponse,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showResponseInput, setShowResponseInput] = useState(false);
  const [hostResponse, setHostResponse] = useState("");

  const [responseAnchorEl, setResponseAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [isEditingResponse, setIsEditingResponse] = useState(false);

  const isReviewOwner = review.reviewerId === currentUserId;
  const canManage = isReviewOwner || isHost;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSubmitResponse = () => {
    if (hostResponse.trim()) {
      if (isEditingResponse) {
        onUpdateHostResponse(review.id, hostResponse);
        setIsEditingResponse(false);
      } else {
        onAddHostResponse(review.id, hostResponse);
      }
      setHostResponse("");
      setShowResponseInput(false);
    }
  };

  const handleEditResponse = () => {
    setHostResponse(review.hostResponse || "");
    setIsEditingResponse(true);
    setShowResponseInput(true);
    setResponseAnchorEl(null);
  };

  const handleDeleteResponse = () => {
    if (confirm("Bạn có chắc muốn xóa phản hồi này?")) {
      onDeleteHostResponse(review.id);
      setResponseAnchorEl(null);
    }
  };

  const handleCancelEdit = () => {
    setHostResponse("");
    setIsEditingResponse(false);
    setShowResponseInput(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, mb: 2, border: "1px solid", borderColor: "divider" }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Avatar
            src={review.reviewerAvatar || undefined}
            sx={{ width: 48, height: 48, bgcolor: "primary.main" }}
          >
            {review.reviewerName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {review.reviewerName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(review.createdAt)}
            </Typography>
          </Box>
        </Box>

        {canManage && (
          <>
            <IconButton
              size="small"
              sx={{
                width: "40px",
                height: "40px",
              }}
              onClick={handleMenuOpen}
            >
              <MoreVertical size={18} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {isReviewOwner && (
                <>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      onEdit(review);
                    }}
                  >
                    <Edit size={16} style={{ marginRight: 8 }} />
                    Chỉnh sửa
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      onDelete(review.id);
                    }}
                  >
                    <Trash2 size={16} style={{ marginRight: 8 }} />
                    Xóa
                  </MenuItem>
                </>
              )}
              {isHost && (
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onToggleVisibility(review.id);
                  }}
                >
                  <EyeOff size={16} style={{ marginRight: 8 }} />
                  {review.isVisible ? "Ẩn đánh giá" : "Hiện đánh giá"}
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </Box>

      {/* Rating */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Rating value={review.overallRating} readOnly size="small" />
        <Typography variant="body2" fontWeight={600}>
          {review.overallRating.toFixed(1)}
        </Typography>
        {review.isRecommended && (
          <Chip
            label="Được giới thiệu"
            size="small"
            color="success"
            variant="outlined"
          />
        )}
      </Box>

      {/* Detailed Ratings */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 1.5,
          mb: 2,
        }}
      >
        {[
          { label: "Độ sạch sẽ", value: review.cleanlinessRating },
          { label: "Vị trí", value: review.locationRating },
          { label: "Giá trị", value: review.valueForMoneyRating },
          { label: "Giao tiếp", value: review.communicationRating },
          { label: "Nhận phòng", value: review.checkInRating },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ minWidth: 80 }}
            >
              {item.label}:
            </Typography>
            <Rating value={item.value} readOnly size="small" />
          </Box>
        ))}
      </Box>

      {/* Comment */}
      {review.reviewComment && (
        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
          {review.reviewComment}
        </Typography>
      )}

      {/* Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          onClick={() => onMarkHelpful(review.id)}
          sx={{
            gap: 0.5,
            display: "flex",
            opacity: "0.6",
            py: 0.5,
            cursor: "pointer",
            "&:hover": { opacity: 1 },
          }}
        >
          <ThumbsUp size={16} />
          <Typography variant="caption">{review.helpfulCount}</Typography>
        </Box>

        {isHost && !review.hostResponse && (
          <Box
            onClick={() => setShowResponseInput(!showResponseInput)}
            sx={{
              gap: 0.5,
              display: "flex",
              cursor: "pointer",
              opacity: "0.6",
              ":hover": {
                opacity: 1,
              },
            }}
          >
            <MessageSquare size={16} />
            <Typography variant="caption">Phản hồi</Typography>
          </Box>
        )}
      </Box>

      {/* Host Response Input */}
      {showResponseInput && (
        <Box
          sx={{
            mt: 2,
            pl: 6,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }} // ✅ SỬA
        >
          <TextField
            fullWidth
            size="small"
            placeholder={
              isEditingResponse
                ? "Chỉnh sửa phản hồi..."
                : "Viết phản hồi của bạn..."
            } // ✅ SỬA
            value={hostResponse}
            onChange={(e) => setHostResponse(e.target.value)}
            multiline
            rows={3}
          />
          {/* ✅ THÊM box buttons */}
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
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
              {isEditingResponse ? "Cập nhật" : "Gửi"}
            </AppButton>
          </Box>
        </Box>
      )}

      {/* Host Response */}
      {review.hostResponse && (
        <Box
          sx={{
            mt: 2,
            pl: 6,
            pt: 2,
            borderLeft: "3px solid",
            borderColor: "primary.main",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mb: 1,
              justifyContent: "space-between",
            }}
          >
            {" "}
            {/* ✅ THÊM justifyContent */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {" "}
              {/* ✅ THÊM wrap */}
              <Avatar
                src={hostAvatar || undefined}
                sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
              >
                H
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  Phản hồi từ chủ nhà
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {review.hostRespondedAt && formatDate(review.hostRespondedAt)}
                </Typography>
              </Box>
            </Box>
            {isHost && (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => setResponseAnchorEl(e.currentTarget)}
                  sx={{ width: "32px", height: "32px" }}
                >
                  <MoreVertical size={16} />
                </IconButton>
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
              </>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ pl: 5 }}>
            {review.hostResponse}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// ReviewDialog Component
const ReviewDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  review: Review | null;
  onSubmit: (values: CreateReview | UpdateReview) => void;
  bookingId?: number;
}> = ({ open, onClose, review, onSubmit, bookingId }) => {
  const isEdit = Boolean(review);

  const initialValues = {
    overallRating: review?.overallRating || 0,
    cleanlinessRating: review?.cleanlinessRating || 0,
    locationRating: review?.locationRating || 0,
    valueForMoneyRating: review?.valueForMoneyRating || 0,
    communicationRating: review?.communicationRating || 0,
    checkInRating: review?.checkInRating || 0,
    reviewComment: review?.reviewComment || "",
    isRecommended: review?.isRecommended || false,
    bookingId: bookingId || 0,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          {isEdit ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
        </Typography>
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={reviewValidationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <>
            <DialogContent dividers>
              <Stack spacing={3}>
                {/* Overall Rating */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Đánh giá tổng thể *
                  </Typography>
                  <Rating
                    value={values.overallRating}
                    onChange={(_, value) =>
                      setFieldValue("overallRating", value)
                    }
                    size="large"
                    sx={{ fontSize: 48, "& .MuiRating-icon": { mr: 0.1 } }}
                  />
                  {touched.overallRating && errors.overallRating && (
                    <Typography variant="caption" color="error">
                      {errors.overallRating}
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Detailed Ratings */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    fontWeight={600}
                    mb={2}
                  >
                    Đánh giá chi tiết
                  </Typography>
                  {[
                    { name: "cleanlinessRating" as const, label: "Độ sạch sẽ" },
                    { name: "locationRating" as const, label: "Vị trí" },
                    {
                      name: "valueForMoneyRating" as const,
                      label: "Giá trị tiền bạc",
                    },
                    {
                      name: "communicationRating" as const,
                      label: "Giao tiếp",
                    },
                    { name: "checkInRating" as const, label: "Nhận phòng" },
                  ].map((item) => (
                    <Box
                      key={item.name}
                      sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                    >
                      <Typography variant="body2" sx={{ minWidth: 150 }}>
                        {item.label}:
                      </Typography>
                      <Rating
                        value={values[item.name]}
                        onChange={(_, value) => setFieldValue(item.name, value)}
                        sx={{ fontSize: 48, "& .MuiRating-icon": { mr: 0.1 } }}
                      />
                    </Box>
                  ))}
                </Box>

                <Divider />

                {/* Comment */}
                <Box>
                  <FormTextField
                    name="reviewComment"
                    label="Nhận xét của bạn"
                    placeholder="Chia sẻ trải nghiệm của bạn tại đây..."
                    multiline
                    rows={4}
                  />
                </Box>

                {/* Recommendation */}
                <Box>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <FormCheckbox
                      name="isRecommended"
                      label={"Tôi giới thiệu homestay này"}
                    />
                  </label>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <AppButton variant="outlined" onClick={onClose}>
                Hủy
              </AppButton>
              <AppButton onClick={() => handleSubmit()}>
                {isEdit ? "Cập nhật" : "Gửi đánh giá"}
              </AppButton>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

// Main Component
const HomestayReviews: React.FC<HomestayReviewsProps> = ({
  homestayId,
  currentUserId,
  isHost = false,
  canReview = false,
  bookingId,
  hostAvatar,
}) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const { data: reviewsData, isLoading } = useGetHomestayReviewsQuery({
    homestayId,
    filter: {
      pageNumber,
      pageSize: 5,
      sortBy: "CreatedAt",
      sortDirection: "desc",
    },
  });

  const {
    createReview,
    updateReview,
    deleteReview,
    addHostResponse,
    markAsHelpful,
    toggleHelpful,
    toggleVisibility,
    updateHostResponse,
    deleteHostResponse,
  } = useReview();

  const reviews = reviewsData?.data?.items || [];
  const totalCount = reviewsData?.data?.totalCount || 0;
  const hasMore = pageNumber * 5 < totalCount;

  const handleLoadMore = () => {
    setPageNumber((prev) => prev + 1);
  };

  const handleCreateReview = () => {
    setEditingReview(null);
    setDialogOpen(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setDialogOpen(true);
  };

  const handleSubmitReview = async (values: CreateReview | UpdateReview) => {
    try {
      if (editingReview) {
        await updateReview(editingReview.id, values as UpdateReview);
      } else {
        await createReview(values as CreateReview);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      try {
        await deleteReview(id);
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const handleToggleVisibility = async (id: number) => {
    try {
      await toggleVisibility(id);
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleMarkHelpful = async (id: number) => {
    try {
      await markAsHelpful(id);
    } catch (error) {
      console.error("Error marking helpful:", error);
    }
  };

  const handleToggleHelpful = async (id: number) => {
    try {
      await toggleHelpful(id);
    } catch (error) {
      console.error("Error toggling helpful:", error);
    }
  };

  const handleAddHostResponse = async (id: number, response: string) => {
    try {
      await addHostResponse(id, { hostResponse: response });
    } catch (error) {
      console.error("Error adding host response:", error);
    }
  };

  const handleUpdateHostResponse = async (id: number, response: string) => {
    try {
      await updateHostResponse(id, { hostResponse: response });
    } catch (error) {
      console.error("Error updating host response:", error);
    }
  };

  const handleDeleteHostResponse = async (id: number) => {
    try {
      await deleteHostResponse(id);
    } catch (error) {
      console.error("Error deleting host response:", error);
    }
  };

  if (isLoading && pageNumber === 1) {
    return <Box sx={{ p: 3 }}>Đang tải...</Box>;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        maxWidth: 1200,
        mx: "auto",
        bgcolor: "white",
        p: 3,
        borderRadius: "12px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Đánh giá từ khách hàng
        </Typography>
        {canReview && (
          <AppButton onClick={handleCreateReview}>Viết đánh giá</AppButton>
        )}
      </Box>

      {/* Statistics */}
      <ReviewStatistics homestayId={homestayId} />

      {/* Reviews List */}
      <Box>
        <Typography variant="h6" fontWeight={600} mb={2}>
          {totalCount} đánh giá
        </Typography>

        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            currentUserId={currentUserId}
            isHost={isHost}
            hostAvatar={hostAvatar}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
            onToggleVisibility={handleToggleVisibility}
            onMarkHelpful={handleToggleHelpful}
            onAddHostResponse={handleAddHostResponse}
            onUpdateHostResponse={handleUpdateHostResponse} // ✅ THÊM
            onDeleteHostResponse={handleDeleteHostResponse} // ✅ THÊM
          />
        ))}

        {/* Load More Button */}
        {hasMore && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <AppButton variant="outlined" onClick={handleLoadMore}>
              Xem thêm đánh giá
            </AppButton>
          </Box>
        )}
      </Box>

      {/* Review Dialog */}
      <ReviewDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        review={editingReview}
        onSubmit={handleSubmitReview}
        bookingId={bookingId}
      />
    </Paper>
  );
};

export default HomestayReviews;
