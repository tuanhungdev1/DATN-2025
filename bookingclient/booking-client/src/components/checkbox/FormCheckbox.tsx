/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Box,
  Typography,
  type CheckboxProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useField } from "formik";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

const StyledCheckbox = styled(Checkbox, {
  shouldForwardProp: (prop) =>
    prop !== "customColor" && prop !== "checkboxSize",
})<{ customColor?: string; checkboxSize?: "small" | "medium" | "large" }>(
  ({ theme, customColor, checkboxSize = "medium" }) => {
    // Xác định size cho checkbox
    const getSizeConfig = () => {
      switch (checkboxSize) {
        case "small":
          return { size: 16, borderWidth: 1.5 };
        case "large":
          return { size: 28, borderWidth: 2.5 };
        default: // medium
          return { size: 22, borderWidth: 1 };
      }
    };

    const sizeConfig = getSizeConfig();
    const checkedColor = customColor || "#006ce4";

    return {
      padding: 4,
      transition: "none", // Tắt transition
      borderRadius: 2,

      // Tắt hover effect
      "&:hover": {
        backgroundColor: "transparent",
      },

      "&.Mui-checked": {
        color: checkedColor,

        "&:hover": {
          backgroundColor: "transparent",
        },
      },

      "&.Mui-disabled": {
        opacity: 0.4,
      },

      // Tắt animation
      "& .MuiSvgIcon-root": {
        fontSize: sizeConfig.size,
        transition: "none", // Tắt animation
      },

      "&.Mui-checked .MuiSvgIcon-root": {
        transform: "none", // Không scale khi checked
      },

      // Custom icon với border width
      "& .MuiSvgIcon-root path": {
        strokeWidth: sizeConfig.borderWidth,
      },
    };
  }
);

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  alignItems: "center", // Thay đổi từ flex-start thành center
  userSelect: "none",
  marginLeft: 0,

  "& .MuiFormControlLabel-label": {
    paddingTop: 0, // Bỏ padding top
    paddingLeft: 8,
    fontSize: "0.875rem",
    fontWeight: 400,
    color: theme.palette.text.primary,
    cursor: "pointer",
    lineHeight: 1.5,

    "&.Mui-disabled": {
      color: theme.palette.text.disabled,
      cursor: "not-allowed",
    },
  },
}));

export interface FormCheckboxProps
  extends Omit<CheckboxProps, "name" | "size"> {
  name: string;
  label?: string | React.ReactNode;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  customColor?: string;
  indeterminate?: boolean;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  description?: string;
  checkboxSize?: "small" | "medium" | "large";
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  helperText,
  required = false,
  disabled = false,
  customColor,
  indeterminate = false,
  labelPlacement = "end",
  description,
  checkboxSize = "medium",
  ...props
}) => {
  const [field, meta, helpers] = useField({
    name,
    type: "checkbox",
  });

  const showError = meta.touched && Boolean(meta.error);
  const errorText = showError ? meta.error : helperText;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    await helpers.setValue(newValue);
  };

  const handleBlur = () => {
    helpers.setTouched(true);
  };

  const checkboxElement = (
    <StyledCheckbox
      {...field}
      {...props}
      checked={field.value || false}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      customColor={customColor}
      checkboxSize={checkboxSize}
      indeterminate={indeterminate}
      disableRipple // Tắt ripple effect
      icon={<CheckBoxOutlineBlankIcon />}
      checkedIcon={<CheckBoxIcon />}
      indeterminateIcon={<IndeterminateCheckBoxIcon />}
      inputProps={{
        "aria-label": typeof label === "string" ? label : name,
        "aria-required": required,
        "aria-invalid": showError,
      }}
      sx={{
        // Override thêm styles nếu cần
        "&.MuiCheckbox-root": {
          "&:hover": {
            backgroundColor: "transparent !important",
          },
        },
      }}
    />
  );

  const labelElement = label && (
    <Box>
      <Typography
        component="span"
        sx={{
          fontSize: "0.875rem",
          fontWeight: 400,
          color: showError ? "error.main" : "text.primary",
          lineHeight: 1.5,
        }}
      >
        {label}
        {required && (
          <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
      {description && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: showError ? "error.main" : "text.secondary",
            mt: 0.5,
            lineHeight: 1.4,
            fontSize: "0.75rem",
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );

  return (
    <FormControl
      error={showError}
      component="fieldset"
      sx={{
        mb: 1.5, // Giảm margin bottom
        width: "100%",
      }}
    >
      <StyledFormControlLabel
        control={checkboxElement}
        label={labelElement}
        labelPlacement={labelPlacement}
        disabled={disabled}
      />
      {errorText && (
        <FormHelperText
          sx={{
            mx: 0,
            mt: 0.5,
            fontSize: "0.75rem",
            color: showError ? "error.main" : "text.secondary",
          }}
        >
          {errorText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default FormCheckbox;
