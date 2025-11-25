import {
  Box,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useField } from "formik";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 4,
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",

    "& fieldset": {
      borderColor: "#565656",
      borderWidth: 1,
      transition: "border-color 0.25s ease",
    },

    "& input": {
      padding: "10px 12px",
      fontSize: "0.95rem",
    },

    // Hover: border sáng nhẹ, mượt
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },

    // Focus: không đổi độ dày border, chỉ thêm ánh sáng quanh
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.light,
      boxShadow: `0 0 2px ${theme.palette.primary.light}`,
    },

    // Error: border đỏ, không focus
    "&.Mui-error:not(.Mui-focused) fieldset": {
      borderColor: theme.palette.error.main,
    },
  },
}));

interface FormTextFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  showPasswordToggle?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  autoComplete?: string;
  autoFocus?: boolean;
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  required = false,
  helperText,
  showPasswordToggle = false,
  startIcon,
  endIcon,
  type,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const [showPassword, setShowPassword] = useState(false);
  const showError = meta.touched && Boolean(meta.error);
  const errorText = showError ? meta.error : helperText;

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const getInputType = () => {
    if (showPasswordToggle) {
      return showPassword ? "text" : "password";
    }

    return type || "text";
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      {label && (
        <Typography
          variant="body2"
          mb={"4px"}
          sx={{
            fontWeight: 500,
          }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: "#d32f2f", ml: 0.5 }}>
              *
            </Box>
          )}
        </Typography>
      )}

      <StyledTextField
        type={getInputType()}
        {...field}
        fullWidth
        placeholder={props.placeholder}
        disabled={props.disabled}
        multiline={props.multiline}
        rows={props.rows}
        maxRows={props.maxRows}
        autoComplete={props.autoComplete}
        autoFocus={props.autoFocus}
        error={showError}
        helperText={errorText}
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : null,

          endAdornment: (
            <>
              {showPasswordToggle && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    size="small"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )}

              {endIcon && (
                <InputAdornment position="end">{endIcon}</InputAdornment>
              )}
            </>
          ),
        }}
        FormHelperTextProps={{
          sx: {
            mx: 0,
            mt: 0.5,
            fontSize: "0.75rem",
          },
        }}
        {...props}
      ></StyledTextField>
    </Box>
  );
};

export default FormTextField;
