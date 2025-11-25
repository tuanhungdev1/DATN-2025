import {
  Box,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  styled,
  Typography,
} from "@mui/material";
import { useField } from "formik";

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  "& .MuiFormControlLabel-root": {
    marginBottom: "8px",
    transition: "all 0.2s ease",

    "& .MuiRadio-root": {
      padding: "8px",
      transition: "all 0.2s ease",

      "&:hover": {
        backgroundColor: `rgba(${theme.palette.primary.main}, 0.04)`,
      },
    },

    "& .MuiTypography-root": {
      fontSize: "0.95rem",
      fontWeight: 400,
    },
  },

  "& .MuiRadio-root.Mui-checked": {
    color: theme.palette.primary.light,
  },

  "& .MuiRadio-root.Mui-disabled": {
    opacity: 0.6,
  },
}));

interface RadioOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}

interface FormRadioGroupProps {
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  options: RadioOption[];
  row?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  label,
  required = false,
  helperText,
  options,
  row = false,
  disabled = false,
  autoFocus = false,
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
          mb={"8px"}
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

      <StyledRadioGroup {...field} row={row} autoFocus={autoFocus}>
        {options.map((option) => (
          <FormControlLabel
            key={String(option.value)}
            value={String(option.value)}
            control={<Radio size="small" />}
            label={option.label}
            disabled={option.disabled || disabled}
          />
        ))}
      </StyledRadioGroup>

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

export default FormRadioGroup;
