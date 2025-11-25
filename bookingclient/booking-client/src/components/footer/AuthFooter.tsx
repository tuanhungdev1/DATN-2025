import { Box, Typography } from "@mui/material";

const AuthFooter = () => {
  return (
    <Box mt={"28px"} maxWidth={"400px"} mx={"auto"}>
      <Box height={"1px"} bgcolor={"#dedede"}></Box>

      <Typography variant="body2" fontSize={"12px"} mt={2} align="center">
        By signing in or creating an account, you agree with our{" "}
        <Box
          component={"span"}
          color={"primary.light"}
          sx={{
            cursor: "pointer",
            ":hover": {
              textDecoration: "underline",
            },
          }}
        >
          Terms & Conditions
        </Box>{" "}
        and{" "}
        <Box
          component={"span"}
          color={"primary.light"}
          sx={{
            cursor: "pointer",
            ":hover": {
              textDecoration: "underline",
            },
          }}
        >
          Privacy Statement
        </Box>
      </Typography>

      <Typography variant="body2" fontSize={"12px"} align="center" mt={1.5}>
        All rights reserved.
      </Typography>
      <Typography variant="body2" fontSize={"12px"} align="center" mt={"4px"}>
        Copyright {new Date().getFullYear()} – NextStay.com™
      </Typography>
    </Box>
  );
};

export default AuthFooter;
