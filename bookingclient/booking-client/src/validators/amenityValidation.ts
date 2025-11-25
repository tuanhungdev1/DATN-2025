import * as Yup from "yup";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const amenityValidationSchema = Yup.object().shape({
  amenityName: Yup.string()
    .required("Tên tiện nghi là bắt buộc")
    .max(100, "Tên tiện nghi không vượt quá 100 ký tự"),
  amenityDescription: Yup.string().max(500, "Mô tả không vượt quá 500 ký tự"),
  category: Yup.string()
    .required("Danh mục là bắt buộc")
    .max(100, "Danh mục không vượt quá 100 ký tự"),
  displayOrder: Yup.number()
    .min(0, "Thứ tự hiển thị phải >= 0")
    .required("Thứ tự hiển thị là bắt buộc"),
  isActive: Yup.boolean(),
  iconFile: Yup.mixed<File>()
    .nullable()
    .test("fileSize", "Kích thước tệp không vượt quá 5MB", (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test("fileType", "Chỉ chấp nhận hình ảnh (JPEG, PNG, WebP)", (value) => {
      if (!value) return true;
      return ALLOWED_IMAGE_TYPES.includes(value.type);
    }),
});

export const amenityUpdateValidationSchema = Yup.object().shape({
  amenityName: Yup.string().max(100, "Tên tiện nghi không vượt quá 100 ký tự"),
  amenityDescription: Yup.string().max(500, "Mô tả không vượt quá 500 ký tự"),
  category: Yup.string().max(100, "Danh mục không vượt quá 100 ký tự"),
  displayOrder: Yup.number().min(0, "Thứ tự hiển thị phải >= 0"),
  isActive: Yup.boolean(),
  iconFile: Yup.mixed<File>()
    .nullable()
    .test("fileSize", "Kích thước tệp không vượt quá 5MB", (value) => {
      if (!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
    .test("fileType", "Chỉ chấp nhận hình ảnh (JPEG, PNG, WebP)", (value) => {
      if (!value) return true;
      return ALLOWED_IMAGE_TYPES.includes(value.type);
    }),
});
