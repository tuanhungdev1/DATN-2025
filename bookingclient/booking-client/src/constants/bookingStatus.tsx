// src/constants/bookingStatus.tsx
import {
  HourglassEmpty,
  CheckCircle,
  Cancel,
  EventAvailable,
  MeetingRoom,
  Task,
  Block,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { BookingStatus } from "@/enums/bookingStatus";

export const BOOKING_STATUS_CONFIG = {
  [BookingStatus.Pending]: {
    label: "Chờ xác nhận",
    color: "#FFA726",
    icon: <HourglassEmpty sx={{ fontSize: 16 }} />,
  },
  [BookingStatus.Confirmed]: {
    label: "Đã xác nhận",
    color: "#66BB6A",
    icon: <CheckCircle sx={{ fontSize: 16 }} />,
  },
  [BookingStatus.Cancelled]: {
    label: "Đã hủy",
    color: "#EF5350",
    icon: <Cancel sx={{ fontSize: 16 }} />,
  },
  [BookingStatus.Rejected]: {
    label: "Bị từ chối",
    color: "#F44336",
    icon: <RemoveCircleOutline sx={{ fontSize: 16 }} />,
  },
  [BookingStatus.CheckedIn]: {
    label: "Đã nhận phòng",
    color: "#29B6F6",
    icon: <MeetingRoom sx={{ fontSize: 16 }} />,
  },
  [BookingStatus.CheckedOut]: {
    label: "Đã trả phòng",
    color: "#AB47BC",
    icon: <EventAvailable sx={{ fontSize: 16 }} />,
  },
  [BookingStatus.Completed]: {
    label: "Hoàn thành",
    color: "#26A69A",
    icon: <Task sx={{ fontSize: 16 }} />,
  },
  [BookingStatus.NoShow]: {
    label: "Không đến",
    color: "#78909C",
    icon: <Block sx={{ fontSize: 16 }} />,
  },
};
