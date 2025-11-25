// src/components/datetime/FormDateTimeField.tsx (Cập nhật)
import { Box, TextField, styled, Typography } from "@mui/material";
import { useField } from "formik";

const StyledDateTimeField = styled(TextField)(({ theme }) => ({
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

    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },

    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.light,
      boxShadow: `0 0 2px ${theme.palette.primary.light}`,
    },

    "&.Mui-error:not(.Mui-focused) fieldset": {
      borderColor: theme.palette.error.main,
    },
  },
}));

interface FormDateTimeFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  type?: "date" | "datetime-local" | "month" | "time";
  min?: string;
  max?: string;
}

const FormDateTimeField: React.FC<FormDateTimeFieldProps> = ({
  label,
  required = false,
  helperText,
  type = "date",
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const showError = meta.touched && Boolean(meta.error);
  const errorText = showError ? meta.error : helperText;

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

      <StyledDateTimeField
        type={type}
        {...field}
        fullWidth
        disabled={props.disabled}
        autoFocus={props.autoFocus}
        error={showError}
        helperText={errorText}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: props.min,
          max: props.max,
        }}
        FormHelperTextProps={{
          sx: {
            mx: 0,
            mt: 0.5,
            fontSize: "0.75rem",
          },
        }}
        {...props}
      />
    </Box>
  );
};

export default FormDateTimeField;
