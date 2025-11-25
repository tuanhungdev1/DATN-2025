import * as yup from "yup";

export const updateUserProfileSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("Họ không được để trống.")
    .max(50, "Họ không được vượt quá 50 ký tự."),

  lastName: yup
    .string()
    .required("Tên không được để trống.")
    .max(50, "Tên không được vượt quá 50 ký tự."),

  dateOfBirth: yup.date().nullable().typeError("Ngày sinh không hợp lệ."),

  gender: yup.number().nullable().oneOf([0, 1, 2], "Giới tính không hợp lệ."), // 0: Male, 1: Female, 2: Other

  address: yup
    .string()
    .nullable()
    .max(255, "Địa chỉ không được vượt quá 255 ký tự."),

  city: yup
    .string()
    .nullable()
    .max(100, "Tên thành phố không được vượt quá 100 ký tự."),

  country: yup
    .string()
    .nullable()
    .max(100, "Tên quốc gia không được vượt quá 100 ký tự."),

  postalCode: yup
    .string()
    .nullable()
    .max(20, "Mã bưu điện không được vượt quá 20 ký tự."),

  phoneNumber: yup
    .string()
    .nullable()
    .max(20, "Số điện thoại không được vượt quá 20 ký tự.")
    .matches(
      /^(\+?\d{1,4}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?[\d\s-]{6,}$/,
      "Số điện thoại không hợp lệ."
    ),
});
