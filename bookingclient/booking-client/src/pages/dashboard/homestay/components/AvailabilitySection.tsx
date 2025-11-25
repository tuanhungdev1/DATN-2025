import {
  Box,
  Divider,
  Grid,
  Tooltip as MuiTooltip,
  Paper,
  Typography,
} from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { vi } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { AppButton } from "@/components/button";
import type { AvailabilityCalendar } from "@/types/homestay.types";

export const AvailabilitySection = ({
  availabilityCalendars,
}: {
  availabilityCalendars: AvailabilityCalendar[];
}) => {
  // 1️⃣ States
  const [showAll, setShowAll] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);

  // 2️⃣ Memo - dateInfoMap
  const dateInfoMap = useMemo(() => {
    const map = new Map<string, AvailabilityCalendar>();
    availabilityCalendars.forEach((cal) => {
      const dateKey = format(new Date(cal.availableDate), "yyyy-MM-dd");
      map.set(dateKey, cal);
    });
    return map;
  }, [availabilityCalendars]);

  // 3️⃣ Function - customDayContent (đặt ngay sau dateInfoMap)
  const customDayContent = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const dateInfo = dateInfoMap.get(dateKey);

    if (!dateInfo) return <span>{format(day, "d")}</span>;

    let bgColor = "#fff";
    let textColor = "#000";
    let borderColor = "transparent";

    if (dateInfo.isBlocked) {
      bgColor = "#ffebee";
      borderColor = "#f44336";
      textColor = "#d32f2f";
    } else if (dateInfo.isAvailable) {
      bgColor = "#e8f5e9";
      borderColor = "#4caf50";
      textColor = "#2e7d32";
    } else {
      bgColor = "#fafafa";
      textColor = "#9e9e9e";
    }

    const tooltipContent = (
      <Box sx={{ p: 1 }}>
        <Typography variant="caption" fontWeight={600}>
          {format(new Date(dateInfo.availableDate), "dd/MM/yyyy", {
            locale: vi,
          })}
        </Typography>
        <Divider sx={{ my: 0.5 }} />
        <Typography variant="caption" display="block">
          {dateInfo.isBlocked
            ? "🔒 Bị khóa"
            : dateInfo.isAvailable
            ? "✅ Còn trống"
            : "❌ Không có sẵn"}
        </Typography>
        {dateInfo.customPrice && (
          <Typography variant="caption" display="block" color="primary.main">
            💰 {dateInfo.customPrice.toLocaleString()} VNĐ
          </Typography>
        )}
        {dateInfo.minimumNights && (
          <Typography variant="caption" display="block">
            🌙 Tối thiểu: {dateInfo.minimumNights} đêm
          </Typography>
        )}
        {dateInfo.blockReason && (
          <Typography variant="caption" display="block" color="error.main">
            ⚠️ {dateInfo.blockReason}
          </Typography>
        )}
      </Box>
    );

    return (
      <MuiTooltip title={tooltipContent} arrow placement="top">
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bgColor,
            border: `2px solid ${borderColor}`,
            borderRadius: "4px",
            color: textColor,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: 2,
            },
          }}
        >
          {format(day, "d")}
        </Box>
      </MuiTooltip>
    );
  };

  // 4️⃣ Logic lọc availableDates (code cũ của bạn)
  const availableDates = availabilityCalendars.filter(
    (cal) => cal.isAvailable && !cal.isBlocked
  );

  const displayCalendars = showAll
    ? availableDates
    : availableDates.slice(0, 12);

  // 5️⃣ Return JSX
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Lịch khả dụng ({availableDates.length})
        </Typography>
        {availableDates.length > 12 && (
          <AppButton
            variant="text"
            onClick={() => setShowAll(!showAll)}
            size="small"
          >
            {showAll ? "Thu gọn" : `Xem tất cả (${availableDates.length})`}
          </AppButton>
        )}
      </Box>

      {/* Toggle Calendar + Legend */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <AppButton
          variant="outlined"
          size="small"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? "Ẩn lịch" : "Hiện lịch"}
        </AppButton>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#e8f5e9",
                border: "2px solid #4caf50",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Còn trống</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#ffebee",
                border: "2px solid #f44336",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Bị khóa</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#fafafa",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Không có sẵn</Typography>
          </Box>
        </Box>
      </Box>

      {/* DateRangePicker */}
      {showCalendar && (
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "center",
            overflow: "auto",
            "& .rdrCalendarWrapper": { fontSize: { xs: "12px", sm: "14px" } },
            "& .rdrMonth": { width: { xs: "100%", sm: "auto" } },
            "& .rdrDay": { height: { xs: "40px", sm: "48px" } },
            "& .rdrDayNumber": { display: "none" },
          }}
        >
          <DateRangePicker
            ranges={[]}
            locale={vi}
            months={2}
            direction="horizontal"
            showMonthAndYearPickers={true}
            showDateDisplay={false}
            staticRanges={[]}
            inputRanges={[]}
            weekdayDisplayFormat="EEEEE"
            dayContentRenderer={customDayContent}
            minDate={new Date()}
            maxDate={
              availabilityCalendars.length > 0
                ? new Date(
                    Math.max(
                      ...availabilityCalendars.map((cal) =>
                        new Date(cal.availableDate).getTime()
                      )
                    )
                  )
                : undefined
            }
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Grid danh sách ngày (code cũ của bạn) */}
      <Grid container spacing={2}>
        {displayCalendars.map((calendar, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} key={index}>
            {/* Card hiển thị chi tiết ngày - code cũ */}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
