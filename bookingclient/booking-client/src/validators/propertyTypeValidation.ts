import * as Yup from "yup";

export const createPropertyTypeSchema = Yup.object({
  typeName: Yup.string()
    .required("Tên loại tài sản là bắt buộc.")
    .min(3, "Tên loại tài sản phải có ít nhất 3 ký tự.")
    .max(100, "Tên loại tài sản không được vượt quá 100 ký tự."),
  description: Yup.string()
    .max(500, "Mô tả không được vượt quá 500 ký tự.")
    .nullable(),
  iconFile: Yup.mixed<File>()
    .nullable()
    .test("fileSize", "Tệp hình ảnh không được vượt quá 5MB.", (file) =>
      file ? file.size <= 5 * 1024 * 1024 : true
    )
    .test("fileType", "Tệp phải là hình ảnh (jpg, jpeg, png).", (file) =>
      file ? ["image/jpeg", "image/png", "image/jpg"].includes(file.type) : true
    ),
  isActive: Yup.boolean().default(true),
  displayOrder: Yup.number()
    .min(0, "Thứ tự hiển thị phải lớn hơn hoặc bằng 0.")
    .max(1000, "Thứ tự hiển thị phải nhỏ hơn hoặc bằng 1000.")
    .required("Thứ tự hiển thị là bắt buộc."),
});

export const updatePropertyTypeSchema = Yup.object({
  typeName: Yup.string()
    .nullable()
    .min(3, "Tên loại tài sản phải có ít nhất 3 ký tự.")
    .max(100, "Tên loại tài sản không được vượt quá 100 ký tự."),
  description: Yup.string()
    .nullable()
    .max(500, "Mô tả không được vượt quá 500 ký tự."),
  iconFile: Yup.mixed<File>().nullable(),
  imageAction: Yup.mixed<"Keep" | "Replace" | "Delete">()
    .oneOf(["Keep", "Replace", "Delete"])
    .default("Keep"),
  isActive: Yup.boolean().nullable(),
  displayOrder: Yup.number()
    .nullable()
    .min(0, "Thứ tự hiển thị phải lớn hơn hoặc bằng 0.")
    .max(1000, "Thứ tự hiển thị phải nhỏ hơn hoặc bằng 1000."),
});
