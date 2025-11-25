import * as Yup from "yup";

export const createHostProfileSchema = Yup.object({
  userId: Yup.number()
    .required("Vui lòng nhập mã người dùng.")
    .min(1, "Mã người dùng phải lớn hơn 0."),

  // Thông tin đăng ký
  businessName: Yup.string()
    .required("Vui lòng nhập tên doanh nghiệp.")
    .max(200, "Tên doanh nghiệp không được vượt quá 200 ký tự."),

  aboutMe: Yup.string()
    .max(1000, "Phần giới thiệu bản thân không được vượt quá 1000 ký tự.")
    .nullable(),

  languages: Yup.string().nullable(),

  // Thông tin ngân hàng
  bankName: Yup.string().required("Vui lòng nhập tên ngân hàng."),

  bankAccountNumber: Yup.string()
    .required("Vui lòng nhập số tài khoản ngân hàng.")
    .matches(/^\d+$/, "Số tài khoản ngân hàng chỉ được chứa các chữ số."),

  bankAccountName: Yup.string().required(
    "Vui lòng nhập tên chủ tài khoản ngân hàng."
  ),

  // Tài liệu xác minh
  identityCardFrontFile: Yup.mixed<File>()
    .required("Vui lòng tải lên mặt trước của CMND/CCCD.")
    .test(
      "fileRequired",
      "Vui lòng chọn tệp hợp lệ cho mặt trước của CMND/CCCD.",
      (value) => value instanceof File
    ),

  identityCardBackFile: Yup.mixed<File>()
    .required("Vui lòng tải lên mặt sau của CMND/CCCD.")
    .test(
      "fileRequired",
      "Vui lòng chọn tệp hợp lệ cho mặt sau của CMND/CCCD.",
      (value) => value instanceof File
    ),

  businessLicenseFile: Yup.mixed<File>()
    .nullable()
    .test(
      "fileType",
      "Vui lòng chọn tệp hợp lệ cho giấy phép kinh doanh.",
      (value) => {
        if (!value) return true;
        return value instanceof File;
      }
    ),

  taxCodeDocumentFile: Yup.mixed<File>()
    .nullable()
    .test(
      "fileType",
      "Vui lòng chọn tệp hợp lệ cho tài liệu mã số thuế.",
      (value) => {
        if (!value) return true;
        return value instanceof File;
      }
    ),

  // Ghi chú bổ sung
  applicantNote: Yup.string().nullable(),
  avatarFile: Yup.mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "Ảnh đại diện không được vượt quá 5MB",
      (value) =>
        !value || (value instanceof File && value.size <= 5 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Chỉ hỗ trợ định dạng: JPG, PNG, WEBP",
      (value) =>
        !value ||
        (value instanceof File &&
          ["image/jpeg", "image/png", "image/webp"].includes(value.type))
    ),
});
