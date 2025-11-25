/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  MenuItem,
  Select,
  styled,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useField, useFormikContext } from "formik";

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: 4,
  transition: "border-color 0.25s ease, box-shadow 0.25s ease",

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#565656",
    borderWidth: 1,
    transition: "border-color 0.25s ease",
  },

  "& .MuiSelect-select": {
    padding: "10px 12px",
    fontSize: "0.95rem",
  },

  // Hover: border sáng nhẹ, mượt
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },

  // Focus: không đổi độ dày border, chỉ thêm ánh sáng quanh
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.light,
    boxShadow: `0 0 2px ${theme.palette.primary.light}`,
  },

  // Error: border đỏ, không focus
  "&.Mui-error:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.error.main,
  },
}));

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  options: SelectOption[];
  multiple?: boolean;
  autoFocus?: boolean;
  onChange?: (value: string | number | string[] | number[]) => void;
}

const FormSelectField: React.FC<FormSelectFieldProps> = ({
  label,
  required = false,
  helperText,
  options,
  placeholder,
  onChange,
  multiple,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const { setFieldValue } = useFormikContext();
  const showError = meta.touched && Boolean(meta.error);
  const errorText = showError ? meta.error : helperText;

  const handleChange = (event: any) => {
    const value = event.target.value;
    setFieldValue(props.name, value);
    if (onChange) onChange(value);
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

      <StyledSelect
        {...field}
        fullWidth
        onChange={handleChange}
        displayEmpty
        disabled={props.disabled}
        multiple={multiple}
        autoFocus={props.autoFocus}
        error={showError}
        renderValue={(selected) => {
          if (
            selected === null ||
            selected === undefined ||
            (Array.isArray(selected) && selected.length === 0)
          ) {
            return (
              <Typography sx={{ color: "text.disabled", fontSize: "0.95rem" }}>
                {placeholder || "Select..."}
              </Typography>
            );
          }

          if (Array.isArray(selected)) {
            return selected
              .map(
                (val) =>
                  options.find((opt) => opt.value === val)?.label || String(val)
              )
              .join(", ");
          }

          const foundLabel = options.find(
            (opt) => opt.value === selected
          )?.label;
          return foundLabel ? foundLabel : String(selected);
        }}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <Typography sx={{ color: "text.disabled" }}>
              {placeholder}
            </Typography>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>

      {errorText && (
        <FormHelperText
          error={showError}
          sx={{
            mx: 0,
            mt: 0.5,
            fontSize: "0.75rem",
          }}
        >
          {errorText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FormSelectField;
