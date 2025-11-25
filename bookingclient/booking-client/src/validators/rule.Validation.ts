import * as Yup from "yup";

export const updateRuleValidationSchema = Yup.object({
  ruleName: Yup.string()
    .max(100, "Tên quy tắc không được vượt quá 100 ký tự.")
    .nullable(),

  ruleDescription: Yup.string()
    .max(500, "Mô tả quy tắc không được vượt quá 500 ký tự.")
    .nullable(),

  ruleType: Yup.string().nullable(),

  isActive: Yup.boolean().nullable(),

  displayOrder: Yup.number()
    .min(0, "Thứ tự hiển thị phải lớn hơn hoặc bằng 0.")
    .integer("Thứ tự hiển thị phải là số nguyên.")
    .nullable(),

  iconFile: Yup.mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "Kích thước tệp biểu tượng phải nhỏ hơn 5MB.",
      (value) => !value || value.size <= 5 * 1024 * 1024
    )
    .test(
      "fileType",
      "Chỉ chấp nhận tệp hình ảnh (JPEG, PNG, WEBP, SVG).",
      (value) =>
        !value ||
        ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(
          value.type
        )
    ),

  imageAction: Yup.string()
    .oneOf(["Keep", "Replace", "Remove"], "Hành động với ảnh không hợp lệ.")
    .default("Keep"),
});

export const createRuleValidationSchema = Yup.object({
  ruleName: Yup.string()
    .required("Tên quy tắc là bắt buộc.")
    .max(100, "Tên quy tắc không được vượt quá 100 ký tự."),

  ruleDescription: Yup.string()
    .max(500, "Mô tả quy tắc không được vượt quá 500 ký tự.")
    .nullable(),

  iconFile: Yup.mixed<File>()
    .required("Biểu tượng là bắt buộc.")
    .test(
      "fileSize",
      "Kích thước tệp biểu tượng phải nhỏ hơn 5MB.",
      (value) => value && value.size <= 5 * 1024 * 1024
    )
    .test(
      "fileType",
      "Chỉ chấp nhận tệp hình ảnh (JPEG, PNG, WEBP, SVG).",
      (value) =>
        value &&
        ["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(
          value.type
        )
    ),

  ruleType: Yup.string().required("Loại quy tắc là bắt buộc."),

  isActive: Yup.boolean().default(true),

  displayOrder: Yup.number()
    .min(0, "Thứ tự hiển thị phải lớn hơn hoặc bằng 0.")
    .integer("Thứ tự hiển thị phải là số nguyên.")
    .required("Thứ tự hiển thị là bắt buộc."),
});
