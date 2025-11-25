import { Typography, Stack } from "@mui/material";

import type { Homestay } from "@/types/homestay.types";

interface AddressInfoProps {
  homestay: Homestay;
}

export const AddressInfo = ({ homestay }: AddressInfoProps) => {
  return (
    <Stack spacing={1.5}>
      <Typography variant="body1" fontWeight={500}>
        {homestay.fullAddress}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {homestay.city}, {homestay.province}, {homestay.country}
      </Typography>
      {homestay.postalCode && (
        <Typography variant="caption" color="text.secondary">
          Mã bưu điện: {homestay.postalCode}
        </Typography>
      )}
    </Stack>
  );
};
