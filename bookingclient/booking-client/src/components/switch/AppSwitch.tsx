import {
  alpha,
  Box,
  CircularProgress,
  FormControlLabel,
  styled,
  Switch,
  Tooltip,
  type SwitchProps,
} from "@mui/material";

interface CustomSwitchStyleProps {
  customColor?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info";
  size?: "small" | "medium" | "large";
  gradient?: boolean;
}

const StyledSwitch = styled(Switch, {
  shouldForwardProp: (prop) =>
    prop !== "customColor" && prop !== "gradient" && prop !== "size",
})<CustomSwitchStyleProps>(
  ({ theme, customColor = "primary", gradient, size = "medium" }) => {
    const colorPalette = theme.palette[customColor];

    // Kích thước dựa trên size prop
    const getSizeConfig = () => {
      switch (size) {
        case "small":
          return { width: 42, height: 22, thumbSize: 16, padding: 3 };
        case "large":
          return { width: 58, height: 32, thumbSize: 24, padding: 4 };
        default: // medium
          return { width: 50, height: 26, thumbSize: 20, padding: 3 };
      }
    };

    const sizeConfig = getSizeConfig();

    return {
      width: sizeConfig.width,
      height: sizeConfig.height,
      padding: 0,
      overflow: "visible",

      "& .MuiSwitch-switchBase": {
        padding: sizeConfig.padding,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

        "&:hover": {
          backgroundColor: "transparent",
        },

        "&.Mui-checked": {
          transform: `translateX(${sizeConfig.width - sizeConfig.height}px)`,
          color: "#fff",

          "& + .MuiSwitch-track": {
            backgroundColor: gradient ? colorPalette.main : colorPalette.light,
            backgroundImage: gradient
              ? `linear-gradient(135deg, ${colorPalette.main} 0%, ${colorPalette.dark} 100%)`
              : "none",
            opacity: 1,
            border: 0,
          },

          "&:hover + .MuiSwitch-track": {
            backgroundColor: colorPalette.main,
          },

          "&.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.5,
          },
        },

        "&.Mui-focusVisible .MuiSwitch-thumb": {
          color: colorPalette.main,
          border: `6px solid ${alpha(colorPalette.main, 0.2)}`,
        },

        "&.Mui-disabled .MuiSwitch-thumb": {
          color: theme.palette.grey[400],
        },

        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.3,
        },
      },

      "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: sizeConfig.thumbSize,
        height: sizeConfig.thumbSize,
        boxShadow: theme.shadows[2],
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },

      "& .MuiSwitch-track": {
        borderRadius: sizeConfig.height / 2,
        backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
        opacity: 1,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    };
  }
);

const LoadingWrapper = styled(Box)({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
});

const LoadingOverlay = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
});

export interface CustomSwitchProps extends Omit<SwitchProps, "color" | "size"> {
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  size?: "small" | "medium" | "large";
  label?: string;
  labelPlacement?: "start" | "end" | "top" | "bottom";
  isLoading?: boolean;
  gradient?: boolean;
  tooltip?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
}

const AppSwitch: React.FC<CustomSwitchProps> = ({
  color = "primary",
  size = "medium",
  label,
  labelPlacement = "end",
  isLoading = false,
  gradient = false,
  tooltip,
  disabled,
  checked,
  onChange,
  ...props
}) => {
  const getLoadingSize = (): number => {
    switch (size) {
      case "small":
        return 14;
      case "large":
        return 20;
      default:
        return 16;
    }
  };

  const switchElement = (
    <LoadingWrapper>
      {isLoading && (
        <LoadingOverlay>
          <CircularProgress
            size={getLoadingSize()}
            sx={{ color: "grey.500" }}
          />
        </LoadingOverlay>
      )}
      <StyledSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled || isLoading}
        customColor={color}
        size={size}
        gradient={gradient}
        disableRipple
        sx={{
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
        {...props}
      />
    </LoadingWrapper>
  );

  // Nếu có label, wrap với FormControlLabel
  const labeledSwitch = label ? (
    <FormControlLabel
      control={switchElement}
      label={label}
      labelPlacement={labelPlacement}
      disabled={disabled || isLoading}
      sx={{
        margin: 0,
        "& .MuiFormControlLabel-label": {
          fontWeight: 500,
          fontSize:
            size === "small"
              ? "0.813rem"
              : size === "large"
              ? "0.938rem"
              : "0.875rem",
          color: disabled || isLoading ? "text.disabled" : "text.primary",
        },
      }}
    />
  ) : (
    switchElement
  );

  // Wrap với Tooltip nếu có
  if (tooltip && !disabled && !isLoading) {
    return (
      <Tooltip title={tooltip} arrow placement="top">
        <span>{labeledSwitch}</span>
      </Tooltip>
    );
  }

  return labeledSwitch;
};

export default AppSwitch;
