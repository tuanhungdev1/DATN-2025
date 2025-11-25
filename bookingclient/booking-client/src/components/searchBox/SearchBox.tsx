import {
  Box,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useState, useEffect } from "react"; // Thêm useEffect

const StyledSearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 4,
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",

    "& fieldset": {
      borderColor: "#565656",
      borderWidth: 2,
      transition: "border-color 0.25s ease",
    },

    "& input": {
      padding: "10px 8px",
      fontSize: "0.95rem",
    },

    // Hover: border sáng nhẹ, mượt
    "&:hover fieldset": {
      borderColor: theme.palette.primary.light,
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

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void; // Gọi khi nhấn Enter
  onClear?: () => void; // Gọi khi clear text
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  label?: string; // Optional label ở trên
  height?: string | number; // Thêm prop cho chiều cao
  width?: string | number; // Thêm prop cho chiều rộng
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Tìm kiếm...",
  value,
  onChange,
  onSearch,
  onClear,
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  autoFocus = false,
  label,
  height,
  width,
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value ?? "");
    }
  }, [value, isControlled]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (isControlled) {
      onChange?.(event); // Parent handle state
    } else {
      setInternalValue(newValue); // Internal handle
    }
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const searchValue = isControlled ? value ?? "" : internalValue;
      onSearch?.(searchValue);
    }
  };

  const handleClear = () => {
    const clearValue = "";
    if (isControlled) {
      onChange?.({
        target: { value: clearValue },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setInternalValue(clearValue);
    }
    onClear?.();
  };

  const currentValue = isControlled ? value ?? "" : internalValue;
  const showClearButton = currentValue.length > 0 && !disabled;

  return (
    <Box sx={{ mb: label || helperText ? 2.5 : 0 }}>
      {label && (
        <Typography
          variant="body2"
          mb={"4px"}
          sx={{
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      )}

      <StyledSearchTextField
        type="text"
        value={currentValue} // Dùng currentValue để tránh mismatch
        onChange={handleChange}
        onKeyDown={handleSearch}
        fullWidth={fullWidth}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        helperText={helperText}
        sx={{
          width,
          height,
        }}
        autoFocus={autoFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color={disabled ? "disabled" : "action"} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                edge="end"
                aria-label="Xóa tìm kiếm"
                size="small"
                disabled={disabled || !showClearButton}
                sx={{
                  visibility: showClearButton ? "visible" : "hidden",
                  minWidth: "auto", // Đảm bảo icon nhỏ gọn
                  padding: "4px", // Làm icon nhỏ hơn một chút
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        FormHelperTextProps={{
          sx: {
            mx: 0,
            mt: 0.5,
            fontSize: "0.75rem",
          },
        }}
      />
    </Box>
  );
};

export default SearchBox;
