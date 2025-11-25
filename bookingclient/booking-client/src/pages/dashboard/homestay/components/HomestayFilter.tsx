/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// src/components/homestay/HomestayFilter.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Slider,
  Chip,
  Stack,
  Link,
  Rating,
  Skeleton,
} from "@mui/material";
import { useFormikContext } from "formik";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";

import type { HomestayFilter } from "@/types/homestay.types";
import { AppButton } from "@/components/button";
import { FormTextField } from "@/components/Input";
import { FormCheckbox } from "@/components/checkbox";
import { useGetPropertyTypesQuery } from "@/services/endpoints/propertyType.api";
import type { PropertyType } from "@/types/propertyType.types";
import type { Amenity } from "@/types/amenity.types";
import { useGetAmenitiesQuery } from "@/services/endpoints/amenity.api";
import AmenityFilterSection from "./AmenityFilterSection";
import { useLocation, useSearchParams } from "react-router-dom";

interface HomestayFilterProps {
  onReset?: () => void;
}

const HomestayFilterComponent: React.FC<HomestayFilterProps> = ({
  onReset,
}) => {
  const { values, setFieldValue, resetForm } =
    useFormikContext<HomestayFilter>();

  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [showAllPropertyTypes, setShowAllPropertyTypes] = useState(false);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const hasSyncedFromUrl = useRef(false);
  // Fetch all PropertyTypes
  const { data: propertyTypeData, isLoading } = useGetPropertyTypesQuery({
    pageNumber: 1,
    pageSize: 100,
    isActive: true,
  });

  const { data: amenityData } = useGetAmenitiesQuery({
    pageNumber: 1,
    pageSize: 100,
    isActive: true,
  });

  useEffect(() => {
    if (amenityData?.data?.items) {
      setAmenities(amenityData.data.items);
    }
  }, [amenityData]);

  useEffect(() => {
    if (propertyTypeData?.data?.items) {
      setPropertyTypes(propertyTypeData.data.items);
    }
  }, [propertyTypeData]);

  useEffect(() => {
    if (hasSyncedFromUrl.current) {
      return;
    }
    if (propertyTypes.length === 0) {
      return;
    }

    const propertyTypeIdParam = searchParams.get("propertyTypeId");
    if (!propertyTypeIdParam) {
      return;
    }

    const id = Number(propertyTypeIdParam);
    const exists = propertyTypes.find((pt) => pt.id === id);

    if (exists && !(values.propertyTypeIds || []).includes(id)) {
      setFieldValue("propertyTypeIds", [...(values.propertyTypeIds || []), id]);
      hasSyncedFromUrl.current = true;
    }
  }, [propertyTypes]);

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setFieldValue("minPrice", min);
    setFieldValue("maxPrice", max);
  };

  const handleReset = () => {
    resetForm();
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("propertyTypeId");
    setSearchParams(newParams);

    onReset?.();
  };

  const priceMarks = [
    { value: 0, label: "0đ" },
    { value: 5000000, label: "5tr" },
    { value: 10000000, label: "10tr" },
  ];

  const visiblePropertyTypes = showAllPropertyTypes
    ? propertyTypes
    : propertyTypes.slice(0, 5);

  const handlePropertyTypeChange = (id: number, checked: boolean) => {
    let currentIds = values.propertyTypeIds || [];
    if (checked) {
      if (!currentIds.includes(id)) {
        currentIds = [...currentIds, id];
      }
    } else {
      currentIds = currentIds.filter((pid) => pid !== id);
    }
    setFieldValue("propertyTypeIds", currentIds);
  };

  const handleRatingChange = (rating: number | null) => {
    setFieldValue("minRating", rating);
  };

  return (
    <Box
      sx={{
        overflowY: "auto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600} fontSize="14px">
          Bộ lọc tìm kiếm
        </Typography>
        <AppButton
          variant="text"
          size="small"
          onClick={handleReset}
          color="error"
          sx={{ fontSize: "14px" }}
        >
          Đặt lại
        </AppButton>
      </Box>

      {/* Location Search */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderBottomWidth: "0px",
          p: 2,
        }}
      >
        <Typography fontWeight={600} fontSize="14px" mb={1}>
          Địa điểm
        </Typography>
        <FormTextField
          name="city"
          label="Thành phố"
          placeholder="VD: Hà Nội, TP.HCM"
        />
        <Box sx={{ mt: 1.5 }}>
          <FormTextField
            name="province"
            label="Tỉnh/Thành phố"
            placeholder="VD: Quảng Ninh"
          />
        </Box>
      </Box>

      {/* Price Range */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderBottomWidth: "0px",
          p: 2,
        }}
      >
        <Typography fontWeight={600} fontSize="14px" mb={1}>
          Khoảng giá
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={[values.minPrice || 0, values.maxPrice || 10000000]}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={10000000}
            step={100000}
            marks={priceMarks}
            valueLabelFormat={(value) => `${(value / 1000000).toFixed(1)}tr`}
            sx={{ fontSize: "14px", color: "#006ce4" }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" fontSize="14px">
              Từ: {((values.minPrice || 0) / 1000000).toFixed(1)} triệu
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize="14px">
              Đến: {((values.maxPrice || 10000000) / 1000000).toFixed(1)} triệu
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Rating Filter - PHẦN MỚI */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderBottomWidth: "0px",
          p: 2,
        }}
      >
        <Typography fontWeight={600} fontSize="14px" mb={1.5}>
          Đánh giá
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Box
              key={rating}
              onClick={() =>
                handleRatingChange(values.minRating === rating ? null : rating)
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid",
                borderColor:
                  values.minRating === rating ? "#006ce4" : "#e0e0e0",
                backgroundColor:
                  values.minRating === rating ? "#f0f7ff" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "#006ce4",
                  backgroundColor: "#f0f7ff",
                },
              }}
            >
              <Rating
                value={rating}
                readOnly
                size="small"
                icon={<StarIcon fontSize="inherit" sx={{ color: "#FFB800" }} />}
                emptyIcon={
                  <StarBorderIcon
                    fontSize="inherit"
                    sx={{ color: "#FFB800" }}
                  />
                }
              />
              <Typography variant="body2" fontSize="14px">
                {rating === 5 && "Xuất sắc"}
                {rating === 4 && "Rất tốt"}
                {rating === 3 && "Tốt"}
                {rating === 2 && "Khá"}
                {rating === 1 && "Trung bình"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Property Type Filter */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderBottomWidth: "0px",
          p: 2,
        }}
      >
        <Typography fontWeight={600} fontSize="14px" mb={1}>
          Loại hình
        </Typography>
        {isLoading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {[...Array(8)].map((_, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Skeleton
                  variant="rectangular"
                  width={20}
                  height={20}
                  sx={{ borderRadius: "2px" }}
                />
                <Skeleton variant="text" width={"100%"} height={24} />
              </Box>
            ))}
            <Skeleton variant="text" width={120} height={20} sx={{ mt: 1 }} />
          </Box>
        ) : (
          <>
            {visiblePropertyTypes.map((propertyType) => (
              <FormCheckbox
                key={propertyType.id}
                name={`propertyType_${propertyType.id}`}
                label={propertyType.typeName}
                checked={(values.propertyTypeIds || []).includes(
                  propertyType.id
                )}
                onChange={(e) =>
                  handlePropertyTypeChange(propertyType.id, e.target.checked)
                }
                sx={{ fontSize: "14px", mb: 1.5 }}
              />
            ))}
            {propertyTypes.length > 5 && !showAllPropertyTypes && (
              <Link
                component="button"
                variant="body2"
                onClick={() => setShowAllPropertyTypes(true)}
                sx={{
                  color: "#006CE4",
                  textDecoration: "none",
                  fontSize: "14px",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Xem thêm ({propertyTypes.length - 5} loại hình)
              </Link>
            )}
            {showAllPropertyTypes && (
              <Link
                component="button"
                variant="body2"
                onClick={() => setShowAllPropertyTypes(false)}
                sx={{
                  color: "#006CE4",
                  textDecoration: "none",
                  fontSize: "14px",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Thu gọn
              </Link>
            )}
          </>
        )}
      </Box>

      {/* Capacity - PHẦN MỚI */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderBottomWidth: "0px",
          p: 2,
        }}
      >
        <Typography fontWeight={600} fontSize="14px" mb={1}>
          Sức chứa
        </Typography>
        <FormTextField
          name="minGuests"
          label="Số khách tối thiểu"
          type="number"
          placeholder="VD: 2"
        />
        <Box sx={{ mt: 1.5 }}>
          <FormTextField
            name="minChildren"
            label="Số trẻ em tối thiểu"
            type="number"
            placeholder="VD: 1"
          />
        </Box>
      </Box>

      {/* Rooms */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderBottomWidth: "0px",
          p: 2,
        }}
      >
        <Typography fontWeight={600} fontSize="14px" mb={1}>
          Phòng
        </Typography>
        <FormTextField
          name="minBedrooms"
          label="Số phòng ngủ tối thiểu"
          type="number"
          placeholder="VD: 1"
        />
        <Box sx={{ mt: 1.5 }}>
          <FormTextField
            name="minBathrooms"
            label="Số phòng tắm tối thiểu"
            type="number"
            placeholder="VD: 1"
          />
        </Box>
        <Box sx={{ mt: 1.5 }}>
          <FormTextField
            name="minBeds"
            label="Số giường tối thiểu"
            type="number"
            placeholder="VD: 2"
          />
        </Box>
        <Box sx={{ mt: 1.5 }}>
          <FormTextField
            name="minRooms"
            label="Tổng số phòng tối thiểu"
            type="number"
            placeholder="VD: 3"
          />
        </Box>
      </Box>

      {/* Amenities */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderBottomWidth: "0px",
          p: 2,
        }}
      >
        <Typography fontWeight={600} fontSize="14px" mb={1}>
          Tiện nghi
        </Typography>

        {/* Lấy dữ liệu từ API */}
        <AmenityFilterSection />
      </Box>

      {/* Features */}
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          p: 2,
        }}
      >
        <Typography fontWeight={600} fontSize="14px" mb={1}>
          Đặc điểm
        </Typography>
        <FormCheckbox
          name="isInstantBook"
          label="Đặt ngay"
          sx={{ fontSize: "14px", mb: 1.5 }}
        />
        <FormCheckbox
          name="isFeatured"
          label="Nổi bật"
          sx={{ fontSize: "14px", mb: 1.5 }}
        />
        <FormCheckbox
          name="hasWeekendPrice"
          label="Có giá cuối tuần"
          sx={{ fontSize: "14px", mb: 1.5 }}
        />
        <FormCheckbox
          name="hasWeeklyDiscount"
          label="Giảm giá theo tuần"
          sx={{ fontSize: "14px", mb: 1.5 }}
        />
        <FormCheckbox
          name="hasMonthlyDiscount"
          label="Giảm giá theo tháng"
          sx={{ fontSize: "14px" }}
        />
      </Box>

      {/* Active Filters Summary */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" fontWeight={600} mb={1} fontSize="14px">
          Đang áp dụng:
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {values.search && (
            <Chip
              label={`Tìm: ${values.search}`}
              size="small"
              onDelete={() => setFieldValue("search", "")}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.city && (
            <Chip
              label={`Thành phố: ${values.city}`}
              size="small"
              onDelete={() => setFieldValue("city", "")}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.province && (
            <Chip
              label={`Tỉnh: ${values.province}`}
              size="small"
              onDelete={() => setFieldValue("province", "")}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.minPrice !== undefined && values.minPrice > 0 && (
            <Chip
              label={`Giá từ: ${(values.minPrice / 1000000).toFixed(1)}tr`}
              size="small"
              onDelete={() => setFieldValue("minPrice", 0)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.maxPrice !== undefined && values.maxPrice < 10000000 && (
            <Chip
              label={`Giá đến: ${(values.maxPrice / 1000000).toFixed(1)}tr`}
              size="small"
              onDelete={() => setFieldValue("maxPrice", 10000000)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.minRating && (
            <Chip
              label={`Đánh giá: ${values.minRating}⭐ trở lên`}
              size="small"
              onDelete={() => setFieldValue("minRating", undefined)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.minGuests !== undefined && (
            <Chip
              label={`Số khách: ${values.minGuests}`}
              size="small"
              onDelete={() => setFieldValue("minGuests", undefined)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.minChildren !== undefined && (
            <Chip
              label={`Trẻ em: ${values.minChildren}`}
              size="small"
              onDelete={() => setFieldValue("minChildren", undefined)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.minBedrooms !== undefined && (
            <Chip
              label={`Phòng ngủ: ${values.minBedrooms}`}
              size="small"
              onDelete={() => setFieldValue("minBedrooms", undefined)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.minBathrooms !== undefined && (
            <Chip
              label={`Phòng tắm: ${values.minBathrooms}`}
              size="small"
              onDelete={() => setFieldValue("minBathrooms", undefined)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.minBeds !== undefined && (
            <Chip
              label={`Giường: ${values.minBeds}`}
              size="small"
              onDelete={() => setFieldValue("minBeds", undefined)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.minRooms !== undefined && (
            <Chip
              label={`Tổng số phòng: ${values.minRooms}`}
              size="small"
              onDelete={() => setFieldValue("minRooms", undefined)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.hasParking && (
            <Chip
              label="Có chỗ đậu xe"
              size="small"
              onDelete={() => setFieldValue("hasParking", false)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.isPetFriendly && (
            <Chip
              label="Cho phép thú cưng"
              size="small"
              onDelete={() => setFieldValue("isPetFriendly", false)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.hasPrivatePool && (
            <Chip
              label="Có hồ bơi riêng"
              size="small"
              onDelete={() => setFieldValue("hasPrivatePool", false)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.isInstantBook && (
            <Chip
              label="Đặt ngay"
              size="small"
              onDelete={() => setFieldValue("isInstantBook", false)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.isFeatured && (
            <Chip
              label="Nổi bật"
              size="small"
              onDelete={() => setFieldValue("isFeatured", false)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.hasWeekendPrice && (
            <Chip
              label="Có giá cuối tuần"
              size="small"
              onDelete={() => setFieldValue("hasWeekendPrice", false)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.hasWeeklyDiscount && (
            <Chip
              label="Giảm giá theo tuần"
              size="small"
              onDelete={() => setFieldValue("hasWeeklyDiscount", false)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {values.hasMonthlyDiscount && (
            <Chip
              label="Giảm giá theo tháng"
              size="small"
              onDelete={() => setFieldValue("hasMonthlyDiscount", false)}
              sx={{ fontSize: "12px" }}
            />
          )}
          {(values.propertyTypeIds || []).map((id) => {
            const propertyType = propertyTypes.find((pt) => pt.id === id);
            return propertyType ? (
              <Chip
                key={id}
                label={`Loại: ${propertyType.typeName}`}
                size="small"
                onDelete={() => handlePropertyTypeChange(id, false)}
                sx={{ fontSize: "12px" }}
              />
            ) : null;
          })}

          {/* Amenity Chips */}
          {(values.amenityIds || []).map((id) => {
            const amenity = amenities.find((a) => a.id === id);
            return amenity ? (
              <Chip
                key={id}
                label={amenity.amenityName}
                size="small"
                onDelete={() => {
                  const newIds = (values.amenityIds || []).filter(
                    (aid) => aid !== id
                  );
                  setFieldValue("amenityIds", newIds);
                }}
                sx={{ fontSize: "12px" }}
              />
            ) : null;
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default HomestayFilterComponent;
