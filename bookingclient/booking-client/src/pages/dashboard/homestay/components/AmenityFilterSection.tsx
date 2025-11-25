// src/components/homestay/AmenityFilterSection.tsx
import React, { useEffect, useState } from "react";
import { Box, Link, Skeleton } from "@mui/material";
import { useFormikContext } from "formik";
import { FormCheckbox } from "@/components/checkbox";
import { useGetAmenitiesQuery } from "@/services/endpoints/amenity.api";
import type { Amenity } from "@/types/amenity.types";
import type { HomestayFilter } from "@/types/homestay.types";

const AmenityFilterSection: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<HomestayFilter>();

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const { data: amenityData, isLoading } = useGetAmenitiesQuery({
    pageNumber: 1,
    pageSize: 100,
    isActive: true,
  });

  useEffect(() => {
    if (amenityData?.data?.items) {
      const sorted = [...amenityData.data.items].sort(
        (a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0)
      );
      setAmenities(sorted);
    }
  }, [amenityData]);

  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 6);

  const handleAmenityChange = (id: number, checked: boolean) => {
    let currentIds = values.amenityIds || [];
    if (checked) {
      if (!currentIds.includes(id)) {
        currentIds = [...currentIds, id];
      }
    } else {
      currentIds = currentIds.filter((aid) => aid !== id);
    }
    setFieldValue("amenityIds", currentIds);
  };

  return (
    <>
      {isLoading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
          {[...Array(8)].map((_, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
            >
              {/* Checkbox skeleton */}
              <Skeleton
                variant="rectangular"
                width={20}
                height={20}
                sx={{ borderRadius: "2px" }}
              />

              {/* Icon skeleton */}
              <Skeleton variant="circular" width={16} height={16} />

              {/* Text skeleton */}
              <Skeleton variant="text" width={"75%"} height={20} />
            </Box>
          ))}

          {/* "Xem thêm" skeleton */}
          <Skeleton variant="text" width={100} height={20} sx={{ mt: 1 }} />
        </Box>
      ) : (
        <>
          {visibleAmenities.map((amenity) => (
            <FormCheckbox
              key={amenity.id}
              name={`amenity_${amenity.id}`}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {amenity.iconUrl ? (
                    <img
                      src={amenity.iconUrl}
                      alt={amenity.amenityName}
                      style={{ width: 16, height: 16, objectFit: "contain" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#e0e0e0",
                        borderRadius: "2px",
                      }}
                    />
                  )}
                  <span>{amenity.amenityName}</span>
                </Box>
              }
              checked={(values.amenityIds || []).includes(amenity.id)}
              onChange={(e) =>
                handleAmenityChange(amenity.id, e.target.checked)
              }
              sx={{ fontSize: "14px", mb: 1.5 }}
            />
          ))}

          {amenities.length > 6 && !showAllAmenities && (
            <Link
              component="button"
              variant="body2"
              onClick={() => setShowAllAmenities(true)}
              sx={{
                color: "#006CE4",
                textDecoration: "none",
                fontSize: "14px",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Xem thêm ({amenities.length - 6} tiện nghi)
            </Link>
          )}

          {showAllAmenities && (
            <Link
              component="button"
              variant="body2"
              onClick={() => setShowAllAmenities(false)}
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
    </>
  );
};

export default AmenityFilterSection;
