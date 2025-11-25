/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import type {
  CreateHomestay,
  Homestay,
  HomestayFilter,
  UpdateHomestay,
  ApproveHomestay,
  UpdateHomestayAvailabilityCalendars,
  UpdateHomestayImages,
  UpdateHomestayAmenities,
} from "@/types/homestay.types";
import type { UpdateHomestayRules } from "@/types/rule.type";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const homestayApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // Get all homestays with filtering

    // Get homestay by slug
    getHomestayBySlug: builder.query<ApiResponse<Homestay>, string>({
      query: (slug) => `/homestay/slug/${slug}`,
      providesTags: ["Homestay"],
    }),
    getHomestays: builder.query<
      ApiResponse<PagedResult<Homestay>>,
      HomestayFilter
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.city) params.append("city", filters.city);
        if (filters.country) params.append("country", filters.country);
        if (filters.province) params.append("province", filters.province);
        if (filters.type) params.append("type", filters.type);
        if (filters.isActive !== undefined)
          params.append("isActive", String(filters.isActive));
        if (filters.isApproved !== undefined)
          params.append("isApproved", String(filters.isApproved));
        if (filters.isFeatured !== undefined)
          params.append("isFeatured", String(filters.isFeatured));
        if (filters.isInstantBook !== undefined)
          params.append("isInstantBook", String(filters.isInstantBook));

        if (filters.minPrice !== undefined)
          params.append("minPrice", String(filters.minPrice));
        if (filters.maxPrice !== undefined)
          params.append("maxPrice", String(filters.maxPrice));
        if (filters.hasWeekendPrice !== undefined)
          params.append("hasWeekendPrice", String(filters.hasWeekendPrice));
        if (filters.hasWeeklyDiscount !== undefined)
          params.append("hasWeeklyDiscount", String(filters.hasWeeklyDiscount));
        if (filters.hasMonthlyDiscount !== undefined)
          params.append(
            "hasMonthlyDiscount",
            String(filters.hasMonthlyDiscount)
          );

        if (filters.minGuests !== undefined)
          params.append("minGuests", String(filters.minGuests));
        if (filters.minChildren !== undefined)
          params.append("minChildren", String(filters.minChildren));
        if (filters.minBedrooms !== undefined)
          params.append("minBedrooms", String(filters.minBedrooms));
        if (filters.minBathrooms !== undefined)
          params.append("minBathrooms", String(filters.minBathrooms));
        if (filters.minBeds !== undefined)
          params.append("minBeds", String(filters.minBeds));
        if (filters.minRooms !== undefined)
          params.append("minRooms", String(filters.minRooms));

        if (filters.latitude !== undefined)
          params.append("latitude", String(filters.latitude));
        if (filters.longitude !== undefined)
          params.append("longitude", String(filters.longitude));
        if (filters.radiusInKm !== undefined)
          params.append("radiusInKm", String(filters.radiusInKm));

        if (filters.hasParking !== undefined)
          params.append("hasParking", String(filters.hasParking));
        if (filters.isPetFriendly !== undefined)
          params.append("isPetFriendly", String(filters.isPetFriendly));
        if (filters.hasPrivatePool !== undefined)
          params.append("hasPrivatePool", String(filters.hasPrivatePool));

        if (filters.ownerId !== undefined)
          params.append("ownerId", String(filters.ownerId));
        if (filters.propertyTypeId !== undefined)
          params.append("propertyTypeId", String(filters.propertyTypeId));

        if (filters.checkInDate)
          params.append("checkInDate", filters.checkInDate);
        if (filters.checkOutDate)
          params.append("checkOutDate", filters.checkOutDate);

        if (filters.propertyTypeIds && filters.propertyTypeIds.length > 0) {
          for (let i = 0; i < filters.propertyTypeIds.length; i++) {
            params.append(
              "propertyTypeIds",
              filters.propertyTypeIds[i].toString()
            );
          }
        }

        // Amenity IDs
        if (filters.amenityIds && filters.amenityIds.length > 0) {
          for (let i = 0; i < filters.amenityIds.length; i++) {
            params.append("amenityIds", filters.amenityIds[i].toString());
          }
        }

        if (filters.createdFrom)
          params.append("createdFrom", filters.createdFrom);
        if (filters.createdTo) params.append("createdTo", filters.createdTo);
        if (filters.approvedFrom)
          params.append("approvedFrom", filters.approvedFrom);
        if (filters.approvedTo) params.append("approvedTo", filters.approvedTo);

        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortDirection)
          params.append("sortDirection", filters.sortDirection);
        if (filters.minRating !== undefined)
          params.append("minRating", String(filters.minRating));
        if (filters.adults !== undefined)
          params.append("adults", String(filters.adults));
        if (filters.children !== undefined)
          params.append("children", String(filters.children));
        if (filters.rooms !== undefined)
          params.append("rooms", String(filters.rooms));
        if (filters.pets !== undefined)
          params.append("pets", String(filters.pets));

        params.append("pageNumber", String(filters.pageNumber || 1));
        params.append("pageSize", String(filters.pageSize || 10));

        return `/homestay?${params.toString()}`;
      },
      providesTags: ["Homestay"],
    }),

    // Get homestays of current host (my homestays)
    getMyHomestays: builder.query<
      ApiResponse<PagedResult<Homestay>>,
      HomestayFilter
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        // Các filter chung (giống getHomestays)
        if (filters.search) params.append("search", filters.search);
        if (filters.city) params.append("city", filters.city);
        if (filters.country) params.append("country", filters.country);
        if (filters.province) params.append("province", filters.province);
        if (filters.type) params.append("type", filters.type);
        if (filters.isActive !== undefined)
          params.append("isActive", String(filters.isActive));
        if (filters.isApproved !== undefined)
          params.append("isApproved", String(filters.isApproved));
        if (filters.isFeatured !== undefined)
          params.append("isFeatured", String(filters.isFeatured));
        if (filters.isInstantBook !== undefined)
          params.append("isInstantBook", String(filters.isInstantBook));

        if (filters.minPrice !== undefined)
          params.append("minPrice", String(filters.minPrice));
        if (filters.maxPrice !== undefined)
          params.append("maxPrice", String(filters.maxPrice));
        if (filters.minGuests !== undefined)
          params.append("minGuests", String(filters.minGuests));
        if (filters.minBedrooms !== undefined)
          params.append("minBedrooms", String(filters.minBedrooms));

        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortDirection)
          params.append("sortDirection", filters.sortDirection);

        params.append("pageNumber", String(filters.pageNumber || 1));
        params.append("pageSize", String(filters.pageSize || 10));

        return `/homestay/my-homestays?${params.toString()}`;
      },
      providesTags: ["Homestay"],
    }),

    // Get homestay by ID
    getHomestayById: builder.query<ApiResponse<Homestay>, number>({
      query: (id) => `/homestay/${id}`,
      providesTags: ["Homestay"],
    }),

    // Create homestay
    createHomestay: builder.mutation<ApiResponse<Homestay>, CreateHomestay>({
      queryFn: async (data) => {
        try {
          console.log(data);
          const formData = new FormData();

          // Thêm các trường text
          formData.append("homestayTitle", data.homestayTitle);
          if (data.homestayDescription) {
            formData.append("homestayDescription", data.homestayDescription);
          }
          if (data.slug) {
            formData.append("slug", data.slug);
          }
          formData.append("fullAddress", data.fullAddress);
          formData.append("city", data.city);
          formData.append("province", data.province);
          formData.append("country", data.country);
          if (
            data.areaInSquareMeters !== undefined &&
            data.areaInSquareMeters !== null
          ) {
            formData.append(
              "areaInSquareMeters",
              String(data.areaInSquareMeters)
            );
          }
          if (
            data.numberOfFloors !== undefined &&
            data.numberOfFloors !== null
          ) {
            formData.append("numberOfFloors", String(data.numberOfFloors));
          }
          if (data.postalCode) formData.append("postalCode", data.postalCode);
          formData.append("latitude", String(data.latitude));
          formData.append("longitude", String(data.longitude));
          formData.append("numberOfRooms", String(data.numberOfRooms));
          formData.append("numberOfBathrooms", String(data.numberOfBathrooms));
          formData.append("numberOfBeds", String(data.numberOfBeds));
          formData.append("maximumGuests", String(data.maximumGuests));
          formData.append("maximumChildren", String(data.maximumChildren));
          formData.append("numberOfBedrooms", String(data.numberOfBedrooms));
          formData.append("numberOfBathrooms", String(data.numberOfBathrooms));
          formData.append("numberOfBeds", String(data.numberOfBeds));
          formData.append("baseNightlyPrice", String(data.baseNightlyPrice));
          if (data.weekendPrice !== undefined && data.weekendPrice !== null)
            formData.append("weekendPrice", String(data.weekendPrice));
          if (data.weeklyDiscount !== undefined && data.weeklyDiscount !== null)
            formData.append("weeklyDiscount", String(data.weeklyDiscount));
          if (
            data.monthlyDiscount !== undefined &&
            data.monthlyDiscount !== null
          )
            formData.append("monthlyDiscount", String(data.monthlyDiscount));
          formData.append("minimumNights", String(data.minimumNights));
          formData.append("maximumNights", String(data.maximumNights));
          formData.append("checkInTime", data.checkInTime);
          formData.append("checkOutTime", data.checkOutTime);
          formData.append("isInstantBook", String(data.isInstantBook));
          formData.append("ownerId", String(data.ownerId));
          formData.append("propertyTypeId", String(data.propertyTypeId));
          formData.append("hasParking", String(data.hasParking));
          formData.append("isPetFriendly", String(data.isPetFriendly));
          formData.append("hasPrivatePool", String(data.hasPrivatePool));
          if (data.searchKeywords) {
            formData.append("searchKeywords", data.searchKeywords);
          }
          formData.append("availableRooms", String(data.availableRooms));
          formData.append(
            "isFreeCancellation",
            String(data.isFreeCancellation)
          );
          formData.append(
            "isPrepaymentRequired",
            String(data.isPrepaymentRequired)
          );
          formData.append("roomsAtThisPrice", String(data.roomsAtThisPrice));

          if (
            data.freeCancellationDays !== undefined &&
            data.freeCancellationDays !== null
          ) {
            formData.append(
              "freeCancellationDays",
              String(data.freeCancellationDays)
            );
          }

          // Thêm hình ảnh
          data.images.forEach((image, index) => {
            if (image.imageFile) {
              formData.append(`images[${index}].imageFile`, image.imageFile);
            }
            if (image.imageTitle) {
              formData.append(`images[${index}].imageTitle`, image.imageTitle);
            }
            if (image.imageDescription) {
              formData.append(
                `images[${index}].imageDescription`,
                image.imageDescription
              );
            }
            formData.append(
              `images[${index}].displayOrder`,
              String(image.displayOrder || 0)
            );
            formData.append(
              `images[${index}].isPrimaryImage`,
              String(image.isPrimaryImage || false)
            );
            if (image.roomType) {
              formData.append(`images[${index}].roomType`, image.roomType);
            }
          });

          // Thêm tiện nghi
          data.amenities?.forEach((amenity, index) => {
            formData.append(
              `amenities[${index}].amenityId`,
              String(amenity.amenityId)
            );
            if (amenity.customNote) {
              formData.append(
                `amenities[${index}].customNote`,
                amenity.customNote
              );
            }
          });

          // Thêm quy tắc
          data.rules?.forEach((rule, index) => {
            formData.append(`rules[${index}].ruleId`, String(rule.ruleId));
            if (rule.customNote) {
              formData.append(`rules[${index}].customNote`, rule.customNote);
            }
          });

          console.log("availabilityCalendars:", data.availabilityCalendars);

          // Thêm Availability Calendars
          data.availabilityCalendars?.forEach((calendar, index) => {
            formData.append(
              `availabilityCalendars[${index}].availableDate`,
              calendar.availableDate
            );
            formData.append(
              `availabilityCalendars[${index}].isAvailable`,
              String(calendar.isAvailable ?? true)
            );
            if (
              calendar.customPrice !== undefined &&
              calendar.customPrice !== null
            ) {
              formData.append(
                `availabilityCalendars[${index}].customPrice`,
                String(calendar.customPrice)
              );
            }
            if (
              calendar.minimumNights !== undefined &&
              calendar.minimumNights !== null
            ) {
              formData.append(
                `availabilityCalendars[${index}].minimumNights`,
                String(calendar.minimumNights)
              );
            }
            formData.append(
              `availabilityCalendars[${index}].isBlocked`,
              String(calendar.isBlocked ?? false)
            );
            if (calendar.blockReason) {
              formData.append(
                `availabilityCalendars[${index}].blockReason`,
                calendar.blockReason
              );
            }
          });

          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/homestay`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json();
            return {
              error: {
                status: response.status,
                data: error,
              },
            };
          }

          const responseData = await response.json();
          return { data: responseData };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: error?.message || "Tạo homestay thất bại",
            },
          };
        }
      },
      invalidatesTags: ["Homestay"],
    }),

    // Update homestay
    updateHomestay: builder.mutation<
      ApiResponse<Homestay>,
      { id: number; data: UpdateHomestay }
    >({
      queryFn: async ({ id, data }) => {
        try {
          const formData = new FormData();

          // 🏠 Thông tin cơ bản
          if (data.homestayTitle)
            formData.append("homestayTitle", data.homestayTitle);
          if (data.homestayDescription)
            formData.append("homestayDescription", data.homestayDescription);
          if (data.slug) formData.append("slug", data.slug);

          if (data.fullAddress)
            formData.append("fullAddress", data.fullAddress);
          if (data.city) formData.append("city", data.city);
          if (data.province) formData.append("province", data.province);
          if (data.country) formData.append("country", data.country);
          if (data.postalCode) formData.append("postalCode", data.postalCode);

          if (data.latitude !== undefined)
            formData.append("latitude", String(data.latitude));
          if (data.longitude !== undefined)
            formData.append("longitude", String(data.longitude));

          if (data.searchKeywords)
            formData.append("searchKeywords", data.searchKeywords);

          // 📐 Diện tích & cấu trúc
          if (data.areaInSquareMeters !== undefined)
            formData.append(
              "areaInSquareMeters",
              String(data.areaInSquareMeters)
            );
          if (data.numberOfFloors !== undefined)
            formData.append("numberOfFloors", String(data.numberOfFloors));
          if (data.numberOfRooms !== undefined)
            formData.append("numberOfRooms", String(data.numberOfRooms));
          if (data.numberOfBedrooms !== undefined)
            formData.append("numberOfBedrooms", String(data.numberOfBedrooms));
          if (data.numberOfBathrooms !== undefined)
            formData.append(
              "numberOfBathrooms",
              String(data.numberOfBathrooms)
            );
          if (data.numberOfBeds !== undefined)
            formData.append("numberOfBeds", String(data.numberOfBeds));

          // 👨‍👩‍👧‍👦 Giới hạn khách
          if (data.maximumGuests !== undefined)
            formData.append("maximumGuests", String(data.maximumGuests));
          if (data.maximumChildren !== undefined)
            formData.append("maximumChildren", String(data.maximumChildren));

          // 💰 Giá & giảm giá
          if (data.baseNightlyPrice !== undefined)
            formData.append("baseNightlyPrice", String(data.baseNightlyPrice));
          if (data.weekendPrice !== undefined)
            formData.append("weekendPrice", String(data.weekendPrice));
          if (data.weeklyDiscount !== undefined)
            formData.append("weeklyDiscount", String(data.weeklyDiscount));
          if (data.monthlyDiscount !== undefined)
            formData.append("monthlyDiscount", String(data.monthlyDiscount));

          // ⏱️ Thời gian lưu trú
          if (data.minimumNights !== undefined)
            formData.append("minimumNights", String(data.minimumNights));
          if (data.maximumNights !== undefined)
            formData.append("maximumNights", String(data.maximumNights));

          // 🕓 Check-in/out
          if (data.checkInTime)
            formData.append("checkInTime", data.checkInTime);
          if (data.checkOutTime)
            formData.append("checkOutTime", data.checkOutTime);

          // ⚙️ Chính sách đặt phòng
          if (data.isInstantBook !== undefined)
            formData.append("isInstantBook", String(data.isInstantBook));

          // 💳 Chính sách thanh toán & hủy
          if (data.isFreeCancellation !== undefined)
            formData.append(
              "isFreeCancellation",
              String(data.isFreeCancellation)
            );
          if (data.freeCancellationDays !== undefined)
            formData.append(
              "freeCancellationDays",
              String(data.freeCancellationDays)
            );
          if (data.isPrepaymentRequired !== undefined)
            formData.append(
              "isPrepaymentRequired",
              String(data.isPrepaymentRequired)
            );

          // 🏘️ Thông tin phòng
          if (data.availableRooms !== undefined)
            formData.append("availableRooms", String(data.availableRooms));
          if (data.roomsAtThisPrice !== undefined)
            formData.append("roomsAtThisPrice", String(data.roomsAtThisPrice));

          // 🚗 Tiện nghi
          if (data.hasParking !== undefined)
            formData.append("hasParking", String(data.hasParking));
          if (data.isPetFriendly !== undefined)
            formData.append("isPetFriendly", String(data.isPetFriendly));
          if (data.hasPrivatePool !== undefined)
            formData.append("hasPrivatePool", String(data.hasPrivatePool));

          // 🧍 Chủ sở hữu & loại hình
          if (data.ownerId !== undefined)
            formData.append("ownerId", String(data.ownerId));
          if (data.propertyTypeId !== undefined)
            formData.append("propertyTypeId", String(data.propertyTypeId));

          // 🛰️ Gửi request
          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/homestay/${id}`,
            {
              method: "PUT",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json();
            return {
              error: {
                status: response.status,
                data: error,
              },
            };
          }

          const responseData = await response.json();
          return { data: responseData };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: error?.message || "Cập nhật homestay thất bại",
            },
          };
        }
      },
      invalidatesTags: ["Homestay"],
    }),

    // Delete homestay
    deleteHomestay: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/homestay/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Homestay"],
    }),

    // Activate homestay
    activateHomestay: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/homestay/${id}/activate`,
        method: "PUT",
      }),
      invalidatesTags: ["Homestay"],
    }),

    // Deactivate homestay
    deactivateHomestay: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/homestay/${id}/deactivate`,
        method: "PUT",
      }),
      invalidatesTags: ["Homestay"],
    }),

    // Set active status
    setActiveStatus: builder.mutation<
      ApiResponse<object>,
      { id: number; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/homestay/${id}/status`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: ["Homestay"],
    }),

    updateHomestayImages: builder.mutation<
      ApiResponse<object>,
      { id: number; data: UpdateHomestayImages }
    >({
      queryFn: async ({ id, data }) => {
        try {
          console.log(
            "Received data in updateHomestayImages:",
            JSON.stringify(data, null, 2)
          );

          const formData = new FormData();

          // Kiểm tra và xử lý keepImageIds
          const keepImageIds = Array.isArray(data?.keepImageIds)
            ? data.keepImageIds
            : [];
          console.log("keepImageIds:", keepImageIds);
          keepImageIds.forEach((id, index) => {
            formData.append(`keepImageIds[${index}]`, String(id));
          });

          // Kiểm tra và xử lý newImages
          const newImages = Array.isArray(data?.newImages)
            ? data.newImages
            : [];
          console.log("newImages:", newImages);
          newImages.forEach((image, index) => {
            if (image?.imageFile) {
              formData.append(`newImages[${index}].imageFile`, image.imageFile);
            } else {
              console.warn(`newImages[${index}].imageFile is undefined`);
            }
            if (image?.imageTitle) {
              formData.append(
                `newImages[${index}].imageTitle`,
                image.imageTitle
              );
            }
            if (image?.imageDescription) {
              formData.append(
                `newImages[${index}].imageDescription`,
                image.imageDescription
              );
            }
            formData.append(
              `newImages[${index}].displayOrder`,
              String(image?.displayOrder || 0)
            );
            formData.append(
              `newImages[${index}].isPrimaryImage`,
              String(image?.isPrimaryImage || false)
            );
            if (image?.roomType) {
              formData.append(`newImages[${index}].roomType`, image.roomType);
            }
          });

          // Kiểm tra và xử lý updateExistingImages
          const updateExistingImages = Array.isArray(data?.updateExistingImages)
            ? data.updateExistingImages
            : [];
          console.log("updateExistingImages:", updateExistingImages);
          updateExistingImages.forEach((image, index) => {
            if (image?.imageId) {
              formData.append(
                `updateExistingImages[${index}].imageId`,
                String(image.imageId)
              );
            } else {
              console.warn(
                `updateExistingImages[${index}].imageId is undefined`
              );
            }
            if (image?.imageTitle) {
              formData.append(
                `updateExistingImages[${index}].imageTitle`,
                image.imageTitle
              );
            }
            if (image?.imageDescription) {
              formData.append(
                `updateExistingImages[${index}].imageDescription`,
                image.imageDescription
              );
            }
            if (image?.displayOrder !== undefined) {
              formData.append(
                `updateExistingImages[${index}].displayOrder`,
                String(image.displayOrder)
              );
            }
            if (image?.isPrimaryImage !== undefined) {
              formData.append(
                `updateExistingImages[${index}].isPrimaryImage`,
                String(image.isPrimaryImage)
              );
            }
            if (image?.roomType) {
              formData.append(
                `updateExistingImages[${index}].roomType`,
                image.roomType
              );
            }
          });

          console.log("FormData entries:", Array.from(formData.entries()));

          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/homestay/${id}/images`,
            {
              method: "PUT",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json();
            console.error("API response error:", error);
            return {
              error: {
                status: response.status,
                data: error,
              },
            };
          }

          const responseData = await response.json();
          return { data: responseData };
        } catch (error: any) {
          console.error("Error in updateHomestayImages:", error);
          return {
            error: {
              status: 500,
              data: error?.message || "Cập nhật hình ảnh homestay thất bại",
            },
          };
        }
      },
      invalidatesTags: ["Homestay"],
    }),

    // Update homestay amenities
    updateHomestayAmenities: builder.mutation<
      ApiResponse<object>,
      { id: number; data: UpdateHomestayAmenities }
    >({
      queryFn: async ({ id, data }) => {
        try {
          const formData = new FormData();

          // Append keepAmenityIds
          const keepAmenityIds = Array.isArray(data.keepAmenityIds)
            ? data.keepAmenityIds
            : [];
          keepAmenityIds.forEach((id, index) => {
            formData.append(`keepAmenityIds[${index}]`, String(id));
          });

          // Append newAmenities
          const newAmenities = Array.isArray(data.newAmenities)
            ? data.newAmenities
            : [];
          newAmenities.forEach((amenity, index) => {
            formData.append(
              `newAmenities[${index}].amenityId`,
              String(amenity.amenityId)
            );
            if (amenity.customNote) {
              formData.append(
                `newAmenities[${index}].customNote`,
                amenity.customNote
              );
            }
          });

          // Append updateExistingAmenities
          const updateExistingAmenities = Array.isArray(
            data.updateExistingAmenities
          )
            ? data.updateExistingAmenities
            : [];
          updateExistingAmenities.forEach((amenity, index) => {
            formData.append(
              `updateExistingAmenities[${index}].amenityId`,
              String(amenity.amenityId)
            );
            if (amenity.customNote) {
              formData.append(
                `updateExistingAmenities[${index}].customNote`,
                amenity.customNote
              );
            }
          });

          console.log("FormData entries:", Array.from(formData.entries()));

          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/homestay/${id}/amenities`,
            {
              method: "PUT",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json();
            console.error("API response error:", error);
            return {
              error: {
                status: response.status,
                data: error,
              },
            };
          }

          const responseData = await response.json();
          return { data: responseData };
        } catch (error: any) {
          console.error("Error in updateHomestayAmenities:", error);
          return {
            error: {
              status: 500,
              data: error?.message || "Cập nhật tiện nghi homestay thất bại",
            },
          };
        }
      },
      invalidatesTags: ["Homestay"],
    }),

    // Update homestay rules
    updateHomestayRules: builder.mutation<
      ApiResponse<object>,
      { id: number; data: UpdateHomestayRules }
    >({
      queryFn: async ({ id, data }) => {
        try {
          const formData = new FormData();

          // KeepRuleIds
          const keepIds = Array.isArray(data.keepRuleIds)
            ? data.keepRuleIds
            : [];
          keepIds.forEach((id, i) =>
            formData.append(`keepRuleIds[${i}]`, String(id))
          );

          // NewRules
          const newRules = Array.isArray(data.newRules) ? data.newRules : [];
          newRules.forEach((r, i) => {
            formData.append(`newRules[${i}].ruleId`, String(r.ruleId));
            if (r.customNote)
              formData.append(`newRules[${i}].customNote`, r.customNote);
          });

          // UpdateExistingRules
          const updateRules = Array.isArray(data.updateExistingRules)
            ? data.updateExistingRules
            : [];
          updateRules.forEach((r, i) => {
            formData.append(
              `updateExistingRules[${i}].ruleId`,
              String(r.ruleId)
            );
            if (r.customNote)
              formData.append(
                `updateExistingRules[${i}].customNote`,
                r.customNote
              );
          });

          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/homestay/${id}/rules`,
            {
              method: "PUT",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json();
            return { error: { status: response.status, data: error } };
          }

          const result = await response.json();
          return { data: result };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: error?.message || "Cập nhật quy tắc thất bại",
            },
          };
        }
      },
      invalidatesTags: ["Homestay"],
    }),

    approveHomestay: builder.mutation<
      ApiResponse<Homestay>,
      { id: number; data: ApproveHomestay }
    >({
      query: ({ id, data }) => ({
        url: `/homestay/${id}/approve`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Homestay"],
    }),

    // Reject homestay
    rejectHomestay: builder.mutation<
      ApiResponse<Homestay>,
      { id: number; rejectionReason: string }
    >({
      query: ({ id, rejectionReason }) => ({
        url: `/homestay/${id}/reject`,
        method: "PUT",
        body: { rejectionReason },
      }),
      invalidatesTags: ["Homestay"],
    }),

    // Endpoint mới: Update availability calendars
    updateAvailabilityCalendars: builder.mutation<
      ApiResponse<object>,
      { id: number; data: UpdateHomestayAvailabilityCalendars }
    >({
      query: ({ id, data }) => ({
        url: `/homestay/${id}/availability-calendars`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Homestay"],
    }),

    // Endpoint mới: Get pending approvals
    getPendingApprovals: builder.query<ApiResponse<Homestay[]>, void>({
      query: () => `/homestay/pending-approvals`,
      providesTags: ["Homestay"],
    }),

    // Endpoint mới: Count pending approvals
    countPendingApprovals: builder.query<ApiResponse<number>, void>({
      query: () => `/homestay/pending-approvals/count`,
      providesTags: ["Homestay"],
    }),

    // Endpoint mới: Set featured status
    setFeaturedStatus: builder.mutation<
      ApiResponse<object>,
      { id: number; isFeatured: boolean }
    >({
      query: ({ id, isFeatured }) => ({
        url: `/homestay/${id}/featured`,
        method: "PUT",
        body: { isFeatured },
      }),
      invalidatesTags: ["Homestay"],
    }),
  }),
});

export const {
  useGetHomestaysQuery,
  useGetHomestayBySlugQuery,
  useGetHomestayByIdQuery,
  useCreateHomestayMutation,
  useUpdateHomestayMutation,
  useDeleteHomestayMutation,
  useActivateHomestayMutation,
  useDeactivateHomestayMutation,
  useSetActiveStatusMutation,
  useUpdateHomestayImagesMutation,
  useUpdateHomestayAmenitiesMutation,
  useUpdateHomestayRulesMutation,
  useApproveHomestayMutation,
  useRejectHomestayMutation,
  useUpdateAvailabilityCalendarsMutation,
  useGetPendingApprovalsQuery,
  useCountPendingApprovalsQuery,
  useSetFeaturedStatusMutation,
  useGetMyHomestaysQuery,
} = homestayApi;
