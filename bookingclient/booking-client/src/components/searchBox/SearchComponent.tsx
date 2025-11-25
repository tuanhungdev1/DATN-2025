/* eslint-disable @typescript-eslint/no-explicit-any */
// SearchComponent.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Popover,
  Typography,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import { Remove as RemoveIcon, Add as AddIcon } from "@mui/icons-material";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { vi } from "date-fns/locale";
import { AppButton } from "../button";
import {
  BedDouble,
  CalendarDays,
  Clock,
  MapPin,
  UserRound,
  X,
} from "lucide-react";
import { AppSwitch } from "../switch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { vietnamProvinces, type Province } from "@/constants/vietnamProvinces";

interface GuestConfig {
  adults: number;
  children: number;
  rooms: number;
  pets: boolean;
}

interface SearchComponentProps {
  onSearch?: (searchData: SearchData) => void;
  variant?: "hero" | "filter"; // hero = trang chủ, filter = trang danh sách
}

export interface SearchData {
  destination: string;
  checkInDate?: string;
  checkOutDate?: string;
  adults: number;
  children: number;
  rooms: number;
  pets: boolean;
}

interface DateRangeType {
  startDate: Date | null;
  endDate: Date | null;
  key: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  variant = "hero",
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);

  // Initialize from URL params (for filter variant)
  const getInitialDestination = () => {
    if (variant === "filter") {
      return searchParams.get("search") || searchParams.get("city") || "";
    }
    return "";
  };

  const getInitialDateRange = (): DateRangeType => {
    if (variant === "filter") {
      const checkIn = searchParams.get("checkInDate");
      const checkOut = searchParams.get("checkOutDate");

      // CHỈ set giá trị khi có checkIn và checkOut trong URL
      if (checkIn && checkOut) {
        return {
          startDate: new Date(checkIn),
          endDate: new Date(checkOut),
          key: "selection",
        };
      }
    }

    // Mặc định luôn là null cho cả hero và filter variant
    return {
      startDate: null,
      endDate: null,
      key: "selection",
    };
  };

  const getInitialGuests = (): GuestConfig => {
    if (variant === "filter") {
      return {
        adults: Number(searchParams.get("adults")) || 2,
        children: Number(searchParams.get("children")) || 0,
        rooms: Number(searchParams.get("rooms")) || 1,
        pets: searchParams.get("pets") === "true",
      };
    }
    return {
      adults: 2,
      children: 0,
      rooms: 1,
      pets: false,
    };
  };

  // States
  const [destination, setDestination] = useState(getInitialDestination());
  const [dateRange, setDateRange] = useState<DateRangeType>(
    getInitialDateRange()
  );
  const [guests, setGuests] = useState<GuestConfig>(getInitialGuests());
  const [dateAnchor, setDateAnchor] = useState<HTMLElement | null>(null);
  const [guestsAnchor, setGuestsAnchor] = useState<HTMLElement | null>(null);

  // Update states when URL params change (for filter variant)
  useEffect(() => {
    if (variant === "filter") {
      setDestination(getInitialDestination());
      setGuests(getInitialGuests());

      // Chỉ update dateRange khi có params trong URL
      const checkIn = searchParams.get("checkInDate");
      const checkOut = searchParams.get("checkOutDate");
      if (checkIn && checkOut) {
        setDateRange({
          startDate: new Date(checkIn),
          endDate: new Date(checkOut),
          key: "selection",
        });
      }
    }
  }, [searchParams, variant]);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Filter provinces based on input
  useEffect(() => {
    if (destination.trim()) {
      const searchTerm = destination.toLowerCase();
      const filtered = vietnamProvinces.filter(
        (province) =>
          province.name.toLowerCase().includes(searchTerm) ||
          province.nameWithoutAccent.toLowerCase().includes(searchTerm)
      );
      setFilteredProvinces(filtered.slice(0, 5));
    } else {
      setFilteredProvinces([]);
    }
  }, [destination]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-destination-input]")) {
        setShowSuggestions(false);
        setShowAllHistory(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSuggestions]);

  const saveToHistory = (place: string) => {
    if (!place.trim()) return;

    const newHistory = [
      place,
      ...searchHistory.filter((item) => item !== place),
    ].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  // Remove from history
  const removeFromHistory = (place: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter((item) => item !== place);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  // Clear all history
  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // Select destination
  const selectDestination = (place: string) => {
    setDestination(place);
    saveToHistory(place);
    setShowSuggestions(false);
  };

  // Filter history based on search
  const getFilteredHistory = () => {
    if (!destination.trim()) {
      return searchHistory;
    }
    const searchTerm = destination.toLowerCase();
    return searchHistory.filter((item) =>
      item.toLowerCase().includes(searchTerm)
    );
  };

  // Handle date click
  const handleDateClick = (event: React.MouseEvent<HTMLElement>) => {
    setDateAnchor(event.currentTarget);
  };

  // Handle guests click
  const handleGuestsClick = (event: React.MouseEvent<HTMLElement>) => {
    setGuestsAnchor(event.currentTarget);
  };

  // Handle search
  const handleSearch = () => {
    if (destination.trim()) {
      saveToHistory(destination);
    }
    const searchData: SearchData = {
      destination,
      checkInDate: dateRange.startDate
        ? format(dateRange.startDate, "yyyy-MM-dd")
        : undefined,
      checkOutDate: dateRange.endDate
        ? format(dateRange.endDate, "yyyy-MM-dd")
        : undefined,
      adults: guests.adults,
      children: guests.children,
      rooms: guests.rooms,
      pets: guests.pets,
    };

    if (dateRange.startDate && dateRange.endDate) {
      searchData.checkInDate = format(dateRange.startDate, "yyyy-MM-dd");
      searchData.checkOutDate = format(dateRange.endDate, "yyyy-MM-dd");
    }

    // Close popovers
    setDateAnchor(null);
    setGuestsAnchor(null);

    if (variant === "hero") {
      // Navigate to homestay list page with search params
      const params = new URLSearchParams();

      if (searchData.destination) {
        params.append("search", searchData.destination);
      }
      if (searchData.checkInDate) {
        params.append("checkInDate", searchData.checkInDate);
      }
      if (searchData.checkOutDate) {
        params.append("checkOutDate", searchData.checkOutDate);
      }

      // Thêm các params về guests - QUAN TRỌNG!
      params.append("adults", String(searchData.adults));
      params.append("children", String(searchData.children));
      params.append("rooms", String(searchData.rooms));
      if (searchData.pets) {
        params.append("pets", "true");
      }

      // Thêm các params mặc định cho filter
      params.append(
        "minGuests",
        String(searchData.adults + searchData.children)
      );
      if (searchData.children > 0) {
        params.append("minChildren", String(searchData.children));
      }
      if (searchData.rooms > 1) {
        params.append("minRooms", String(searchData.rooms));
      }
      if (searchData.pets) {
        params.append("isPetFriendly", "true");
      }

      navigate(`/homestay-list?${params.toString()}`);
    } else {
      // Filter variant - call onSearch callback
      onSearch?.(searchData);
    }
  };

  // Format date range display
  const formatDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return "Chọn ngày"; // Thông báo rõ ràng hơn
    }

    const start = dateRange.startDate;
    const end = dateRange.endDate;
    const currentYear = new Date().getFullYear();

    const formatDate = (date: any, showYear = true) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return showYear && year !== currentYear
        ? `${day} Tháng ${month} Năm ${year}`
        : `${day} Tháng ${month}`;
    };

    // Nếu cùng 1 ngày
    const isSameDay =
      start.getDate() === end.getDate() &&
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear();

    if (isSameDay) {
      return formatDate(start);
    }

    // Nếu cùng tháng và cùng năm
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return (
        `${start.getDate()} — ${end.getDate()} Tháng ${end.getMonth() + 1}` +
        (end.getFullYear() !== currentYear ? ` Năm ${end.getFullYear()}` : "")
      );
    }

    // Nếu cùng năm nhưng khác tháng
    if (start.getFullYear() === end.getFullYear()) {
      return (
        `${start.getDate()} Tháng ${
          start.getMonth() + 1
        } — ${end.getDate()} Tháng ${end.getMonth() + 1}` +
        (end.getFullYear() !== currentYear ? ` Năm ${end.getFullYear()}` : "")
      );
    }

    // Khác năm
    return `${formatDate(start)} — ${formatDate(end)}`;
  };
  // Format guests display
  const formatGuests = () => {
    const parts = [];
    parts.push(`${guests.adults} người lớn`);
    if (guests.children > 0) parts.push(`${guests.children} trẻ em`);
    parts.push(`${guests.rooms} phòng`);
    if (guests.pets) parts.push("Có thú cưng");
    return parts.join(" · ");
  };

  // Update guest count
  const updateGuestCount = (
    field: keyof GuestConfig,
    value: number | boolean
  ) => {
    setGuests((prev) => ({ ...prev, [field]: value }));
  };

  // Handle date range change
  const handleDateRangeChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange({
      startDate: startDate || null,
      endDate: endDate || startDate || null,
      key: "selection",
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffb700",
        padding: { xs: "8px", md: "6px" },
        borderRadius: "8px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      }}
    >
      <Grid
        container
        spacing={{ xs: "8px", md: "6px" }}
        sx={{
          borderRadius: 1,
          height: { xs: "auto", md: "60px" },
          alignItems: "stretch",
        }}
      >
        {/* Destination Input */}
        <Grid
          size={{
            xs: 12,
            md: 3.5,
          }}
          sx={{ display: "flex", alignItems: "stretch", position: "relative" }}
          data-destination-input
        >
          <TextField
            fullWidth
            placeholder="Bạn muốn đến đâu?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            InputProps={{
              startAdornment: <BedDouble className="mr-0.5 text-gray-600" />,
              sx: {
                borderRadius: "4px",
                "& fieldset": { border: "none" },
              },
            }}
            sx={{
              bgcolor: "white",
              borderRadius: "4px",
              height: { xs: "48px", md: "100%" },
              "& .MuiOutlinedInput-root": {
                height: { xs: "48px", md: "100%" },
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiInputBase-input": {
                fontSize: "14px",
                fontWeight: "600",
                padding: { xs: "14px 12px", md: "0 12px" },
              },
            }}
          />

          {/* Suggestions Popover */}
          {showSuggestions && (
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                bgcolor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 1300,
                maxHeight: "400px",
                overflowY: "auto",
                p: 1,
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {/* Search History */}
              {getFilteredHistory().length > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      Các tìm kiếm gần đây
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "primary.main",
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={clearAllHistory}
                    >
                      Xóa tất cả
                    </Typography>
                  </Box>

                  {getFilteredHistory()
                    .slice(0, showAllHistory ? undefined : 3)
                    .map((place, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1.5,
                          cursor: "pointer",
                          borderRadius: 1,
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                        onClick={() => selectDestination(place)}
                      >
                        <Clock size={20} className="text-gray-500" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="600">
                            {place}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => removeFromHistory(place, e)}
                          sx={{
                            opacity: 0.6,
                            "&:hover": { opacity: 1 },
                          }}
                        >
                          <X size={16} />
                        </IconButton>
                      </Box>
                    ))}

                  {getFilteredHistory().length > 3 && !showAllHistory && (
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "primary.main",
                          cursor: "pointer",
                          fontWeight: 600,
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() => setShowAllHistory(true)}
                      >
                        Hiển thị thêm
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Trending Destinations / Filtered Suggestions */}
              {(destination.trim() === "" || filteredProvinces.length > 0) && (
                <Box sx={{ mt: getFilteredHistory().length > 0 ? 2 : 0 }}>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {destination.trim() === ""
                        ? "Điểm đến thịnh hành"
                        : "Gợi ý"}
                    </Typography>
                  </Box>

                  {(destination.trim() === ""
                    ? vietnamProvinces.slice(0, 5)
                    : filteredProvinces
                  ).map((province, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1.5,
                        cursor: "pointer",
                        borderRadius: 1,
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                      onClick={() => selectDestination(province.name)}
                    >
                      <MapPin size={20} className="text-gray-500" />
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {province.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {province.country}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* No results */}
              {destination.trim() !== "" &&
                filteredProvinces.length === 0 &&
                getFilteredHistory().length === 0 && (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      No results found
                    </Typography>
                  </Box>
                )}
            </Box>
          )}
        </Grid>

        {/* Date Range Input */}
        <Grid
          size={{
            xs: 12,
            md: 3.5,
          }}
          sx={{ display: "flex", alignItems: "stretch" }}
        >
          <TextField
            fullWidth
            placeholder="Chọn ngày"
            value={formatDateRange()}
            onClick={handleDateClick}
            InputProps={{
              readOnly: true,
              startAdornment: <CalendarDays className="mr-0.5 text-gray-600" />,
              sx: {
                "& fieldset": { border: "none" },
                borderRight: { xs: "none", md: "1px solid #e0e0e0" },
              },
            }}
            sx={{
              bgcolor: "white",
              borderRadius: "4px",
              height: { xs: "48px", md: "100%" },
              "& .MuiOutlinedInput-root": {
                height: { xs: "48px", md: "100%" },
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiInputBase-input": {
                fontSize: "14px",
                fontWeight: "600",
                padding: { xs: "14px 12px", md: "0 12px" },
              },
            }}
          />
        </Grid>

        {/* Guests Input */}
        <Grid
          size={{
            xs: 12,
            md: 3.5,
          }}
          sx={{ display: "flex", alignItems: "stretch" }}
        >
          <TextField
            fullWidth
            placeholder="Số khách"
            value={formatGuests()}
            onClick={handleGuestsClick}
            InputProps={{
              readOnly: true,
              startAdornment: <UserRound className="mr-0.5 text-gray-600" />,
              sx: { "& fieldset": { border: "none" } },
            }}
            sx={{
              bgcolor: "white",
              borderRadius: "4px",
              height: { xs: "48px", md: "100%" },
              "& .MuiOutlinedInput-root": {
                height: { xs: "48px", md: "100%" },
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiInputBase-input": {
                fontSize: "14px",
                fontWeight: 600,
                padding: { xs: "14px 12px", md: "0 12px" },
              },
            }}
          />
        </Grid>

        {/* Search Button */}
        <Grid
          size={{
            xs: 12,
            md: 1.5,
          }}
          sx={{
            bgcolor: { xs: "transparent", md: "white" },
            borderRadius: "4px",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <AppButton
            fullWidth
            size="medium"
            sx={{
              height: { xs: "48px", md: "100%" },
              minHeight: "48px",
            }}
            onClick={handleSearch}
          >
            Tìm kiếm
          </AppButton>
        </Grid>
      </Grid>

      {/* Date Popover */}
      <Popover
        open={Boolean(dateAnchor)}
        anchorEl={dateAnchor}
        onClose={() => setDateAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: { xs: "calc(100vw - 32px)", sm: 600, md: 680 },
            maxWidth: "95vw",
            mt: 1,
            p: { xs: 1.5, md: 2 },
            borderRadius: 2,
            boxShadow: 3,
            overflow: "visible",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            "& .rdrCalendarWrapper": {
              fontSize: { xs: "12px", sm: "14px" },
              width: "100%",
            },
            "& .rdrDateRangePickerWrapper": {
              width: "100%",
            },
            "& .rdrDefinedRangesWrapper": {
              display: "none",
            },
            "& .rdrMonthAndYearWrapper": {
              paddingTop: "12px",
            },
            "& .rdrMonth": {
              width: { xs: "100%", sm: "auto" },
            },
            "& .rdrDays": {
              fontSize: { xs: "11px", sm: "13px" },
            },
            "& .rdrDay": {
              height: { xs: "36px", sm: "42px" },
              width: { xs: "36px", sm: "42px" },
            },
            "& .rdrSelected, & .rdrInRange, & .rdrStartEdge, & .rdrEndEdge": {
              background: "#1976d2",
            },
          }}
        >
          <DateRangePicker
            ranges={[
              {
                // Chỉ truyền startDate và endDate khi chúng không null
                startDate: dateRange.startDate || new Date(),
                endDate: dateRange.endDate || new Date(),
                key: "selection",
              },
            ]}
            moveRangeOnFirstSelection={false}
            onChange={handleDateRangeChange}
            locale={vi}
            minDate={new Date()}
            rangeColors={["#1976d2"]}
            dateDisplayFormat="dd MMM yyyy"
            months={2}
            direction="horizontal"
            showMonthAndYearPickers={true}
            showDateDisplay={false} // ĐỔI thành false để không hiển thị date display khi chưa chọn
            staticRanges={[]}
            inputRanges={[]}
            weekdayDisplayFormat="EEEEE"
          />
        </Box>
      </Popover>

      {/* Guests Popover */}
      <Popover
        open={Boolean(guestsAnchor)}
        anchorEl={guestsAnchor}
        onClose={() => setGuestsAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: { xs: "calc(100vw - 32px)", md: 400 },
            mt: 1,
            maxWidth: "100%",
            p: 2,
          },
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Adults */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight="600">
                Người lớn
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                size="small"
                onClick={() =>
                  updateGuestCount("adults", Math.max(1, guests.adults - 1))
                }
                disabled={guests.adults <= 1}
                sx={{
                  border: "1px solid",
                  borderColor:
                    guests.adults <= 1 ? "action.disabled" : "#006CE4",
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 30, textAlign: "center" }}>
                {guests.adults}
              </Typography>
              <IconButton
                size="small"
                onClick={() => updateGuestCount("adults", guests.adults + 1)}
                sx={{ border: "1px solid #006CE4" }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Children */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight="600">
                Trẻ em
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                size="small"
                onClick={() =>
                  updateGuestCount("children", Math.max(0, guests.children - 1))
                }
                disabled={guests.children <= 0}
                sx={{
                  border: "1px solid",
                  borderColor:
                    guests.children <= 0 ? "action.disabled" : "#006CE4",
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 30, textAlign: "center" }}>
                {guests.children}
              </Typography>
              <IconButton
                size="small"
                onClick={() =>
                  updateGuestCount("children", guests.children + 1)
                }
                sx={{ border: "1px solid #006CE4" }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Rooms */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight="600">
                Phòng
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                size="small"
                onClick={() =>
                  updateGuestCount("rooms", Math.max(1, guests.rooms - 1))
                }
                disabled={guests.rooms <= 1}
                sx={{
                  border: "1px solid",
                  borderColor:
                    guests.rooms <= 1 ? "action.disabled" : "#006CE4",
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ minWidth: 30, textAlign: "center" }}>
                {guests.rooms}
              </Typography>
              <IconButton
                size="small"
                onClick={() => updateGuestCount("rooms", guests.rooms + 1)}
                sx={{ border: "1px solid #006CE4" }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Pets */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight="500">
                Bạn đi cùng thú cưng?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Động vật hỗ trợ không được coi là thú cưng
              </Typography>
            </Box>
            <AppSwitch
              size="small"
              checked={guests.pets}
              onChange={(e) => updateGuestCount("pets", e.target.checked)}
            />
          </Box>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <AppButton
              variant="outlined"
              fullWidth
              onClick={() => setGuestsAnchor(null)}
            >
              Xong
            </AppButton>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default SearchComponent;
