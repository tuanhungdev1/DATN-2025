import React from "react";
import { Stack, Divider, Typography, Box } from "@mui/material";
import SocialLoginButton, { type SocialProvider } from "./SocialLoginButton";

interface SocialLoginGroupProps {
  providers: SocialProvider[];
  onSocialLogin: (provider: SocialProvider) => void | Promise<void>;
  title?: string;
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
}

const SocialLoginGroup: React.FC<SocialLoginGroupProps> = ({
  providers,
  onSocialLogin,
  title = "or use one of these options",
  orientation = "horizontal",
  fullWidth = false,
}) => {
  const handleLogin = (provider: SocialProvider) => async () => {
    await onSocialLogin(provider);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Divider with text */}
      {title && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            my: 3,
            gap: 2,
          }}
        >
          <Divider sx={{ flex: 1 }} />
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>
      )}

      {/* Social Buttons */}
      <Stack
        direction={orientation === "horizontal" ? "row" : "column"}
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          flexWrap: orientation === "horizontal" ? "wrap" : "nowrap",
        }}
      >
        {providers.map((provider) => (
          <SocialLoginButton
            key={provider}
            provider={provider}
            onClick={handleLogin(provider)}
            sx={{
              ...(fullWidth && { width: "100%" }),
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SocialLoginGroup;
