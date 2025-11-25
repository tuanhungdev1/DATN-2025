import { useRef, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: 8,
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

interface ImageUploadFieldProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  helperText?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  error,
  helperText,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Nếu `value` thay đổi (ví dụ set từ Formik), tạo preview tự động
  useEffect(() => {
    // Nếu đã có preview và value là null => clean
    if (!value) {
      setPreview(null);
      return;
    }

    // Nếu value là một File, tạo objectURL
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    // Nếu value có thể là string URL trong tương lai (optional), set trực tiếp
    // (hiện interface định nghĩa File|null, nên đây là phòng trường hợp mở rộng)
    if (typeof value === "string") {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      // Tạo objectURL ngay lập tức để preview (không cần FileReader)
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(file);

      // revoke khi input thay đổi (cleanup sẽ thực hiện khi component unmount hoặc value thay đổi qua useEffect)
      // Không revoke ngay lập tức vì ảnh đang dùng
    }
  };

  const handleRemove = () => {
    onChange(null);
    // Clear preview and input value
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* CHỈ render Card khi có preview hợp lệ */}
      {preview ? (
        <Card sx={{ position: "relative", maxWidth: "100%" }}>
          <CardMedia
            component="img"
            height="300"
            src={preview}
            alt="Preview"
            sx={{ objectFit: "cover" }}
          />
          <IconButton
            onClick={handleRemove}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Card>
      ) : (
        <UploadBox onClick={handleClick}>
          <CloudUploadIcon
            sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
          />
          <Typography variant="body1" color="textSecondary" mb={1}>
            Nhấn để tải ảnh lên
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Hỗ trợ: JPG, PNG, GIF, WEBP (Tối đa 5MB)
          </Typography>
        </UploadBox>
      )}

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: "block" }}
        >
          {error}
        </Typography>
      )}
      {helperText && !error && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mt: 1, display: "block" }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploadField;
