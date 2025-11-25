/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/user/HomestayListPage.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { GridView, ViewList } from "@mui/icons-material";
import { Formik, Form } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";

import type { Homestay, HomestayFilter } from "@/types/homestay.types";
import { AppButton } from "@/components/button";
import { useGetHomestaysQuery } from "@/services/endpoints/homestay.api";
import HomestayFilterComponent from "./components/HomestayFilter";
import HomestayCard from "@/components/homestayCard/HomestayCard";
import MobileFilterDrawer from "./components/MobileFilterDrawer";
import { Home, MapIcon, Search as SearchIcon } from "lucide-react";
import { AppBreadcrumbs } from "@/components/breadcrumb";
import { FormSelectField } from "@/components/select";
import SearchComponent, {
  type SearchData,
} from "@/components/searchBox/SearchComponent";
import HomestayMapViewDialog from "@/components/googleMap/HomestayMapViewDialog";
import { HomestayCardSkeleton } from "@/components/homestayCard";

const sortOptions = [
  { value: "newest", label: "Mới nhất", sortBy: "newest", direction: "desc" },
  { value: "oldest", label: "Cũ nhất", sortBy: "oldest", direction: "asc" },
  {
    value: "price_asc",
    label: "Giá: Thấp đến cao",
    sortBy: "price",
    direction: "asc",
  },
  {
    value: "price_desc",
    label: "Giá: Cao đến thấp",
    sortBy: "price",
    direction: "desc",
  },
  {
    value: "rating",
    label: "Đánh giá cao nhất",
    sortBy: "rating",
    direction: "desc",
  },
  {
    value: "popular",
    label: "Phổ biến nhất",
    sortBy: "popular",
    direction: "desc",
  },
  {
    value: "area_desc",
    label: "Diện tích lớn nhất",
    sortBy: "area",
    direction: "desc",
  },
  {
    value: "guests_desc",
    label: "Sức chứa nhiều nhất",
    sortBy: "guests",
    direction: "desc",
  },
  {
    value: "featured",
    label: "Nổi bật",
    sortBy: "featured",
    direction: "desc",
  },
];

const HomestayListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [showMapView, setShowMapView] = useState(false);

  // Initial filter values từ URL params
  const initialFilters: HomestayFilter = {
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    province: searchParams.get("province") || "",
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    minGuests: searchParams.get("minGuests")
      ? Number(searchParams.get("minGuests"))
      : undefined,
    minChildren: searchParams.get("minChildren")
      ? Number(searchParams.get("minChildren"))
      : undefined,
    minBedrooms: searchParams.get("minBedrooms")
      ? Number(searchParams.get("minBedrooms"))
      : undefined,
    minBathrooms: searchParams.get("minBathrooms")
      ? Number(searchParams.get("minBathrooms"))
      : undefined,
    minBeds: searchParams.get("minBeds")
      ? Number(searchParams.get("minBeds"))
      : undefined,
    minRooms: searchParams.get("minRooms")
      ? Number(searchParams.get("minRooms"))
      : undefined,
    hasParking: searchParams.get("hasParking") === "true" || undefined,
    isPetFriendly: searchParams.get("isPetFriendly") === "true" || undefined,
    hasPrivatePool: searchParams.get("hasPrivatePool") === "true" || undefined,
    isInstantBook: searchParams.get("isInstantBook") === "true" || undefined,
    isFeatured: searchParams.get("isFeatured") === "true" || undefined,
    hasWeekendPrice:
      searchParams.get("hasWeekendPrice") === "true" || undefined,
    hasWeeklyDiscount:
      searchParams.get("hasWeeklyDiscount") === "true" || undefined,
    hasMonthlyDiscount:
      searchParams.get("hasMonthlyDiscount") === "true" || undefined,
    checkInDate: searchParams.get("checkInDate") || undefined,
    checkOutDate: searchParams.get("checkOutDate") || undefined,
    sortBy: (searchParams.get("sortBy") as any) || "newest",
    sortDirection:
      (searchParams.get("sortDirection") as "asc" | "desc") || "desc",
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 12,
    isActive: true,
    isApproved: true,
    propertyTypeId: Number(searchParams.get("propertyTypeId")) || undefined,
    adults: searchParams.get("adults")
      ? Number(searchParams.get("adults"))
      : undefined,
    children: searchParams.get("children")
      ? Number(searchParams.get("children"))
      : undefined,
    rooms: searchParams.get("rooms")
      ? Number(searchParams.get("rooms"))
      : undefined,
    pets: searchParams.get("pets") === "true" || undefined,
    propertyTypeIds: searchParams.get("propertyTypeIds")
      ? searchParams.get("propertyTypeIds")!.split(",").map(Number)
      : [],
  };

  const [currentFilters, setCurrentFilters] =
    useState<HomestayFilter>(initialFilters);

  // Fetch data
  const { data, isLoading, isFetching, error } =
    useGetHomestaysQuery(currentFilters);
  const [mapFilters, setMapFilters] = useState<HomestayFilter>(currentFilters);
  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteHomestays");
    if (savedFavorites) {
      setFavoriteIds(JSON.parse(savedFavorites));
    }
  }, []);

  // Update URL params khi filter thay đổi
  useEffect(() => {
    const params = new URLSearchParams(searchParams); // LẤY TỪ URL ĐANG CÓ

    Object.entries(currentFilters).forEach(([key, value]) => {
      // XỬ LÝ RIÊNG CHO propertyTypeIds
      if (key === "propertyTypeIds") {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(","));
        } else {
          params.delete(key); // Xóa nếu mảng rỗng
        }
      } else if (
        value !== undefined &&
        value !== "" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        params.set(key, String(value));
      } else if (Array.isArray(value)) {
        // Xóa các params khác là mảng rỗng
        params.delete(key);
      }
    });

    // ĐẢM BẢO giữ lại adults, children, rooms, pets nếu có
    // (vì chúng có thể không nằm trong currentFilters)
    const guestParams = ["adults", "children", "rooms", "pets"];
    guestParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value !== null) {
        params.set(param, value);
      }
    });

    setSearchParams(params, { replace: true });
  }, [currentFilters, searchParams, setSearchParams]);

  // Handle search from SearchComponent
  const handleSearchComponentSubmit = (searchData: SearchData) => {
    setCurrentFilters((prev) => ({
      ...prev,
      search: searchData.destination,
      checkInDate: searchData.checkInDate,
      checkOutDate: searchData.checkOutDate,
      minGuests: searchData.adults + searchData.children,
      minChildren: searchData.children > 0 ? searchData.children : undefined,
      minRooms: searchData.rooms > 1 ? searchData.rooms : undefined,
      isPetFriendly: searchData.pets ? true : undefined,
      pageNumber: 1,

      // Thêm các param cho SearchComponent (filter)
      adults: searchData.adults,
      children: searchData.children,
      rooms: searchData.rooms,
      pets: searchData.pets,
    }));
  };

  const handleFilterSubmit = (values: HomestayFilter) => {
    // Tích hợp propertyType_X thành mảng propertyTypeIds
    const propertyTypeIds: number[] = [];
    Object.entries(values).forEach(([key, value]) => {
      if (key.startsWith("propertyType_") && value === true) {
        const id = Number(key.replace("propertyType_", ""));
        propertyTypeIds.push(id);
      }
    });

    const amenityIds: number[] = [];
    Object.entries(values).forEach(([key, value]) => {
      if (key.startsWith("amenity_") && value === true) {
        const id = Number(key.replace("amenity_", ""));
        amenityIds.push(id);
      }
    });

    const filtersToApply = {
      ...values,
      propertyTypeIds: propertyTypeIds,
      amenityIds: amenityIds,
      pageNumber: 1,
    };
    setCurrentFilters(filtersToApply);
    console.log("Filters to apply:", filtersToApply);
  };

  const handleSortChange = (sortValue: string) => {
    const selectedOption = sortOptions.find((opt) => opt.value === sortValue);
    if (selectedOption) {
      setCurrentFilters((prev) => ({
        ...prev,
        sortBy: selectedOption.sortBy as any,
        sortDirection: selectedOption.direction as "asc" | "desc",
        pageNumber: 1,
      }));
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentFilters((prev) => ({
      ...prev,
      pageNumber: page,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: "grid" | "list" | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleFavoriteToggle = (homestayId: number) => {
    setFavoriteIds((prev) => {
      const newFavorites = prev.includes(homestayId)
        ? prev.filter((id) => id !== homestayId)
        : [...prev, homestayId];

      localStorage.setItem("favoriteHomestays", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const handleResetFilters = () => {
    setCurrentFilters({
      ...initialFilters,
      search: "",
      city: "",
      province: "",
      minPrice: undefined,
      maxPrice: undefined,
      minGuests: undefined,
      minChildren: undefined,
      minBedrooms: undefined,
      minBathrooms: undefined,
      minBeds: undefined,
      minRooms: undefined,
      propertyTypeIds: [],
      hasParking: undefined,
      isPetFriendly: undefined,
      hasPrivatePool: undefined,
      isInstantBook: undefined,
      propertyTypeId: undefined,
      isFeatured: undefined,
      hasWeekendPrice: undefined,
      hasWeeklyDiscount: undefined,
      hasMonthlyDiscount: undefined,
      checkInDate: undefined,
      checkOutDate: undefined,
      pageNumber: 1,
    });
  };

  // Đếm số filter đang active
  const countActiveFilters = (filters: HomestayFilter): number => {
    let count = 0;

    if (filters.search) count++;
    if (filters.city) count++;
    if (filters.province) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.minGuests) count++;
    if (filters.minBedrooms) count++;
    if (filters.minBathrooms) count++;
    if (filters.minBeds) count++;
    if (filters.hasParking) count++;
    if (filters.isPetFriendly) count++;
    if (filters.hasPrivatePool) count++;
    if (filters.isInstantBook) count++;
    if (filters.isFeatured) count++;
    if (filters.checkInDate) count++;
    if (filters.checkOutDate) count++;

    return count;
  };

  const handleMapFilterChange = (newFilters: HomestayFilter) => {
    setMapFilters(newFilters);
    setCurrentFilters(newFilters);
  };

  const homestays = data?.data?.items || [];
  const totalCount = data?.data?.totalCount || 0;
  const totalPages = data?.data?.totalPages || 0;

  const breadcrumbItems = [
    {
      label: "Trang chủ",
      path: "/",
      icon: <Home size={14} />,
    },
    {
      label: "Tìm kiếm homestay",
      icon: <SearchIcon size={14} />,
    },
  ];

  return (
    <Box sx={{ backgroundColor: "white", py: 4 }}>
      <Container maxWidth="lg">
        <Box mb={2}>
          <AppBreadcrumbs items={breadcrumbItems} />
        </Box>

        {/* Search Component */}
        <Box sx={{ mb: 4 }}>
          <SearchComponent
            variant="filter"
            onSearch={handleSearchComponentSubmit}
          />
        </Box>

        <Formik
          initialValues={currentFilters}
          onSubmit={handleFilterSubmit}
          enableReinitialize
          validateOnChange={false} // Tắt validate khi gõ
          validateOnBlur={true} // Chỉ validate khi rời field
        >
          {({ values, submitForm }) => (
            <Form>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* Left Sidebar - Filters */}
                <Grid
                  size={{
                    xs: 12,
                    md: 3,
                  }}
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  <Box
                    sx={{
                      position: "sticky",
                      height: "100%",
                      top: 80,
                    }}
                  >
                    <HomestayFilterComponent onReset={handleResetFilters} />
                    <Box sx={{ pt: 2 }}>
                      <AppButton
                        fullWidth
                        onClick={submitForm}
                        isLoading={isFetching}
                      >
                        Áp dụng bộ lọc
                      </AppButton>
                    </Box>
                  </Box>
                </Grid>

                {/* Right Content - Results */}
                <Grid
                  size={{
                    xs: 12,
                    md: 9,
                  }}
                >
                  {/* Header với Sort & View Mode */}
                  <Box
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      mb: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: { xs: 1, md: 2 },
                    }}
                  >
                    {/* Results Count */}
                    <Typography
                      variant="h6"
                      sx={{ typography: { xs: "body1", md: "h6" } }}
                      fontWeight={600}
                    >
                      {isLoading
                        ? "Đang tải..."
                        : `${totalCount} homestay được tìm thấy`}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1, md: 2 },
                        flexWrap: "wrap",
                      }}
                    >
                      <AppButton
                        variant="outlined"
                        startIcon={<MapIcon />}
                        onClick={() => setShowMapView(true)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 500,
                          borderRadius: "4px",
                        }}
                      >
                        Hiển thị trên bản đồ
                      </AppButton>
                      {/* Sort Select */}
                      <Box sx={{ minWidth: { xs: 150, md: 200 } }}>
                        <FormSelectField
                          name="sortBy"
                          label="Sắp xếp theo"
                          onChange={(
                            value: string | number | string[] | number[]
                          ) => handleSortChange(value.toString())}
                          options={sortOptions.map((item) => ({
                            label: item.label,
                            value: item.value,
                          }))}
                        />
                      </Box>

                      {/* View Mode Toggle */}
                      <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={handleViewModeChange}
                        size="small"
                        sx={{
                          display: { xs: "none", sm: "flex" },
                          borderRadius: "4px",
                        }}
                      >
                        <ToggleButton
                          value="grid"
                          aria-label="grid view"
                          disableRipple
                        >
                          <GridView />
                        </ToggleButton>
                        <ToggleButton
                          value="list"
                          aria-label="list view"
                          disableRipple
                        >
                          <ViewList />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                  </Box>

                  {/* Loading State */}
                  {(isLoading || isFetching) && (
                    <Grid
                      container
                      spacing={viewMode === "grid" ? 3 : 2}
                      sx={{ mb: 4 }}
                    >
                      {Array.from({ length: 9 }).map((_, index) => (
                        <Grid
                          size={{
                            xs: 12,
                            sm: viewMode === "grid" ? 6 : 12,
                            md: viewMode === "grid" ? 4 : 12,
                          }}
                          key={`skeleton-${index}`}
                        >
                          <HomestayCardSkeleton viewMode={viewMode} />
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {/* Error State */}
                  {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: "4px" }}>
                      Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
                    </Alert>
                  )}

                  {/* Homestay List/Grid */}
                  {!isLoading &&
                    !isFetching &&
                    !error &&
                    homestays.length > 0 && (
                      <>
                        <Grid
                          container
                          spacing={viewMode === "grid" ? 3 : 2}
                          sx={{ mb: 4 }}
                        >
                          {homestays.map((homestay: Homestay) => (
                            <Grid
                              size={{
                                xs: 12,
                                sm: viewMode === "grid" ? 6 : 12,
                                md: viewMode === "grid" ? 4 : 12,
                              }}
                              key={homestay.id}
                            >
                              <HomestayCard
                                homestay={homestay}
                                viewMode={viewMode}
                                onFavoriteToggle={handleFavoriteToggle}
                                isFavorite={favoriteIds.includes(homestay.id)}
                              />
                            </Grid>
                          ))}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 4,
                            }}
                          >
                            <Pagination
                              count={totalPages}
                              page={currentFilters.pageNumber || 1}
                              onChange={handlePageChange}
                              color="primary"
                              size="medium"
                              showFirstButton
                              showLastButton
                            />
                          </Box>
                        )}
                      </>
                    )}

                  {/* Empty State */}
                  {!isLoading &&
                    !isFetching &&
                    !error &&
                    homestays.length === 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          py: 8,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          gutterBottom
                        >
                          Không tìm thấy homestay phù hợp
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Hãy thử thay đổi bộ lọc để xem thêm kết quả
                        </Typography>
                      </Box>
                    )}
                </Grid>
              </Grid>

              {/* Mobile Filter Drawer */}
              {isMobile && (
                <MobileFilterDrawer
                  onReset={handleResetFilters}
                  onApply={submitForm}
                  activeFiltersCount={countActiveFilters(values)}
                />
              )}
            </Form>
          )}
        </Formik>
      </Container>

      <HomestayMapViewDialog
        open={showMapView}
        homestays={homestays}
        onClose={() => setShowMapView(false)}
        onHomestayClick={(id) => {
          navigate(`/homestay/${id}`);
        }}
        onFavoriteToggle={handleFavoriteToggle}
        favoriteIds={favoriteIds}
        initialFilters={mapFilters}
        onFilterChange={handleMapFilterChange}
      />
    </Box>
  );
};

export default HomestayListPage;
