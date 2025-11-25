import {
  alpha,
  Badge,
  Box,
  Button,
  CircularProgress,
  styled,
  Tooltip,
  type ButtonProps,
} from "@mui/material";

interface CustomButtonStyleProps {
  isLoading?: boolean;
  success?: boolean;
  danger?: boolean;
  gradient?: boolean;
  rounded?: boolean;
  customColor?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info";
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== "isLoading" &&
    prop !== "success" &&
    prop !== "danger" &&
    prop !== "gradient" &&
    prop !== "rounded" &&
    prop !== "customColor",
})<CustomButtonStyleProps>(
  ({ theme, isLoading, success, danger, gradient, rounded, customColor }) => {
    // Xác định color palette dựa trên customColor
    const getColorPalette = () => {
      if (success || customColor === "success") return theme.palette.success;
      if (danger || customColor === "error") return theme.palette.error;
      if (customColor === "warning") return theme.palette.warning;
      if (customColor === "info") return theme.palette.info;
      if (customColor === "secondary") return theme.palette.secondary;
      return theme.palette.primary;
    };

    const colorPalette = getColorPalette();

    return {
      position: "relative",
      textTransform: "none",
      fontWeight: 600,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      overflow: "hidden",
      borderRadius: rounded ? `${rounded}` : "4px",

      "&:active": {
        transform: "scale(0.98)",
      },

      // ==========================================
      // CONTAINED VARIANT (default)
      // ==========================================
      "&.MuiButton-contained": {
        backgroundColor: colorPalette.light,
        color: colorPalette.contrastText,
        boxShadow: theme.shadows[2],

        "&:hover": {
          backgroundColor: alpha(colorPalette.light, 0.8),
          // boxShadow: theme.shadows[4],
          //transform: "translateY(-1px)",
        },

        "&.Mui-disabled": {
          backgroundColor: alpha(colorPalette.light, 0.4),
          color: alpha(colorPalette.contrastText, 0.6),
        },

        // Gradient variant
        ...(gradient && {
          background: `linear-gradient(135deg, ${colorPalette.main} 0%, ${colorPalette.dark} 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colorPalette.dark} 0%, ${colorPalette.main} 100%)`,
            boxShadow: theme.shadows[6],
          },
        }),
      },

      // ==========================================
      // OUTLINED VARIANT
      // ==========================================
      "&.MuiButton-outlined": {
        backgroundColor: "transparent",
        border: `2px solid ${colorPalette.light}`,
        color: colorPalette.light,
        boxShadow: "none",

        "&:hover": {
          backgroundColor: alpha(colorPalette.light, 0.08),
          borderColor: colorPalette.light,
          color: colorPalette.light,
          // boxShadow: `0 0 0 3px ${alpha(colorPalette.light, 0.1)}`,
        },

        "&.Mui-disabled": {
          borderColor: alpha(colorPalette.light, 0.3),
          color: alpha(colorPalette.light, 0.4),
        },
      },

      // ==========================================
      // TEXT VARIANT
      // ==========================================
      "&.MuiButton-text": {
        backgroundColor: "transparent",
        color: colorPalette.light,
        boxShadow: "none",

        "&:hover": {
          backgroundColor: alpha(colorPalette.light, 0.1),
          color: colorPalette.light,
        },

        "&.Mui-disabled": {
          color: alpha(colorPalette.light, 0.4),
        },
      },

      // ==========================================
      // SIZE ADJUSTMENTS
      // ==========================================
      "&.MuiButton-sizeSmall": {
        padding: "6px 16px",
        fontSize: "0.813rem",
      },
      "&.MuiButton-sizeMedium": {
        padding: "8px 20px",
        fontSize: "0.875rem",
      },
      "&.MuiButton-sizeLarge": {
        padding: "10px 24px",
        fontSize: "0.938rem",
      },

      // ==========================================
      // LOADING STATE
      // ==========================================
      ...(isLoading && {
        pointerEvents: "none",
        cursor: "wait",
      }),

      // ==========================================
      // DISABLED STATE
      // ==========================================
      "&.Mui-disabled": {
        cursor: "not-allowed",
        opacity: 0.6,
      },
    };
  }
);

export interface CustomButtonProps extends Omit<ButtonProps, "color"> {
  isLoading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  success?: boolean;
  danger?: boolean;
  gradient?: boolean;
  rounded?: boolean;
  fullWidth?: boolean;
  tooltip?: string;
  badge?: number | string;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AppButton: React.FC<CustomButtonProps> = ({
  children,
  isLoading = false,
  loadingText = "Đang xử lý...",
  startIcon,
  endIcon,
  disabled,
  success = false,
  danger = false,
  gradient = false,
  rounded = false,
  fullWidth = false,
  variant = "contained",
  size = "medium",
  tooltip,
  badge,
  color = "primary",
  onClick,
  disableRipple = true,
  ...props
}) => {
  const getLoadingSize = (): number => {
    switch (size) {
      case "small":
        return 16;
      case "large":
        return 24;
      default:
        return 20;
    }
  };

  // Xác định color cuối cùng dựa trên props
  const finalColor = success ? "success" : danger ? "error" : color;

  const buttonContent = (
    <StyledButton
      disableRipple={disableRipple}
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      fullWidth={fullWidth}
      isLoading={isLoading}
      success={success}
      danger={danger}
      gradient={gradient}
      rounded={rounded}
      customColor={finalColor}
      startIcon={!isLoading && startIcon}
      endIcon={!isLoading && endIcon}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "center",
          }}
        >
          <CircularProgress size={getLoadingSize()} color="inherit" />
          {loadingText && <span>{loadingText}</span>}
        </Box>
      ) : (
        children
      )}
    </StyledButton>
  );

  // Wrap with Badge if badge prop is provided
  const badgeWrappedContent = badge ? (
    <Badge
      badgeContent={badge}
      color="error"
      sx={{
        "& .MuiBadge-badge": {
          right: -3,
          top: -3,
        },
      }}
    >
      {buttonContent}
    </Badge>
  ) : (
    buttonContent
  );

  // Wrap with Tooltip if tooltip prop is provided
  if (tooltip && !disabled && !isLoading) {
    return (
      <Tooltip title={tooltip} arrow placement="top">
        {badgeWrappedContent}
      </Tooltip>
    );
  }

  return badgeWrappedContent;
};

export default AppButton;
