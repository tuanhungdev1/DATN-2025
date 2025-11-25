import { Box, Typography } from "@mui/material";

const SocialLoginOptions = () => {
  return (
    <Box mt={"8px"}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Box
          sx={{
            height: "1px",
            flex: 1,
            bgcolor: "#C0C0C0",
          }}
        ></Box>
        <Typography variant="body2">or use one of these options</Typography>
        <Box
          sx={{
            height: "1px",
            flex: 1,
            bgcolor: "#C0C0C0",
          }}
        ></Box>
      </Box>

      <Box></Box>

      <Box
        sx={{
          height: "1px",
          flex: 1,
          bgcolor: "#C0C0C0",
        }}
      ></Box>
    </Box>
  );
};

export default SocialLoginOptions;
