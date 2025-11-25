import React from "react";
import { Button, type ButtonProps, Box, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledSocialButton = styled(Button)(() => ({
  borderRadius: 8,
  border: "1px solid #E0E0E0",
  backgroundColor: "#FFFFFF",
  padding: "12px 24px",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.95rem",
  color: "#424242",
  transition: "all 0.3s ease",
  minWidth: 200,

  "&:hover": {
    backgroundColor: "#F5F5F5",
    borderColor: "#BDBDBD",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transform: "translateY(-2px)",
  },

  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },

  "&.Mui-disabled": {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
    color: "#9E9E9E",
    opacity: 0.6,
  },

  "& .MuiButton-startIcon": {
    marginRight: 12,
  },
}));

const IconWrapper = styled(Box)({
  width: 24,
  height: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});

export type SocialProvider =
  | "google"
  | "facebook"
  | "apple"
  | "github"
  | "twitter";

interface SocialLoginButtonProps extends Omit<ButtonProps, "onClick"> {
  provider: SocialProvider;
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void | Promise<void>;
  customIcon?: React.ReactNode;
  customText?: string;
}

const providerConfig: Record<
  SocialProvider,
  {
    icon: string;
    text: string;
    color: string;
  }
> = {
  google: {
    icon: "https://www.google.com/favicon.ico",
    text: "Continue with Google",
    color: "#4285F4",
  },
  facebook: {
    icon: "https://www.facebook.com/favicon.ico",
    text: "Continue with Facebook",
    color: "#1877F2",
  },
  apple: {
    icon: "https://www.apple.com/favicon.ico",
    text: "Continue with Apple",
    color: "#000000",
  },
  github: {
    icon: "https://github.com/favicon.ico",
    text: "Continue with GitHub",
    color: "#24292e",
  },
  twitter: {
    icon: "https://twitter.com/favicon.ico",
    text: "Continue with Twitter",
    color: "#1DA1F2",
  },
};

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  isLoading = false,
  loadingText = "Đang xử lý...",
  onClick,
  customIcon,
  customText,
  disabled,
  ...props
}) => {
  const config = providerConfig[provider];
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    if (!onClick || loading) return;

    try {
      setLoading(true);
      await onClick();
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setLoading(false);
    }
  };

  const isButtonLoading = isLoading || loading;

  return (
    <StyledSocialButton
      variant="outlined"
      disabled={disabled || isButtonLoading}
      onClick={handleClick}
      startIcon={
        isButtonLoading ? (
          <CircularProgress size={20} sx={{ color: config.color }} />
        ) : customIcon ? (
          <IconWrapper>{customIcon}</IconWrapper>
        ) : (
          <IconWrapper>
            <img src={config.icon} alt={`${provider} icon`} />
          </IconWrapper>
        )
      }
      {...props}
    >
      {isButtonLoading ? loadingText : customText || config.text}
    </StyledSocialButton>
  );
};

export default SocialLoginButton;
