import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email là bắt buộc.")
    .email("Định dạng email không hợp lệ."),

  password: Yup.string()
    .required("Mật khẩu là bắt buộc.")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một chữ số và một ký tự đặc biệt."
    ),

  rememberMe: Yup.boolean().notRequired(), // Không bắt buộc, mặc định là false
});

export const registerSchema = Yup.object({
  firstName: Yup.string()
    .required("Tên là bắt buộc.")
    .max(50, "Tên không được vượt quá 50 ký tự."),

  lastName: Yup.string()
    .required("Họ là bắt buộc.")
    .max(50, "Họ không được vượt quá 50 ký tự."),

  email: Yup.string()
    .required("Email là bắt buộc.")
    .email("Định dạng email không hợp lệ."),

  password: Yup.string()
    .required("Mật khẩu là bắt buộc.")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một chữ số và một ký tự đặc biệt."
    ),

  confirmPassword: Yup.string()
    .required("Xác nhận mật khẩu là bắt buộc.")
    .oneOf([Yup.ref("password")], "Mật khẩu và xác nhận mật khẩu không khớp."),

  phoneNumber: Yup.string()
    .matches(
      /^(\+\d{1,3}[- ]?)?\d{10,15}$/,
      "Định dạng số điện thoại không hợp lệ."
    )
    .notRequired(),

  gender: Yup.number()
    .oneOf(
      [0, 1, 2],
      "Giới tính phải là một trong các giá trị: Nam, Nữ hoặc Khác."
    )
    .notRequired(),

  dateOfBirth: Yup.date()
    .max(new Date(), "Ngày sinh không được ở tương lai.")
    .notRequired(),

  address: Yup.string().notRequired(),
  city: Yup.string().notRequired(),
  country: Yup.string().notRequired(),

  acceptTerms: Yup.boolean()
    .oneOf([true], "Bạn phải chấp nhận các điều khoản và điều kiện.")
    .required("Bạn phải chấp nhận các điều khoản và điều kiện."),
});

export const userValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("Tên là bắt buộc.")
    .max(50, "Tên không được vượt quá 50 ký tự."),

  lastName: Yup.string()
    .required("Họ là bắt buộc.")
    .max(50, "Họ không được vượt quá 50 ký tự."),

  email: Yup.string()
    .email("Định dạng email không hợp lệ.")
    .required("Email là bắt buộc."),

  password: Yup.string().when("isNew", {
    is: true,
    then: (schema) =>
      schema
        .required("Mật khẩu là bắt buộc.")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
        .max(100, "Mật khẩu không được vượt quá 100 ký tự.")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
          "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt."
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  dateOfBirth: Yup.date()
    .nullable()
    .typeError("Định dạng ngày sinh không hợp lệ.")
    .required("Ngày sinh là bắt buộc."),

  gender: Yup.number()
    .oneOf(
      [0, 1, 2, undefined],
      "Giới tính không hợp lệ. Giá trị hợp lệ: 0 (Nam), 1 (Nữ), hoặc 2 (Khác)."
    )
    .nullable()
    .typeError("Giới tính phải là số: 0 (Nam), 1 (Nữ), hoặc 2 (Khác)."),

  address: Yup.string()
    .nullable()
    .max(100, "Địa chỉ không được vượt quá 100 ký tự."),

  city: Yup.string()
    .nullable()
    .max(50, "Tên thành phố không được vượt quá 50 ký tự."),

  country: Yup.string()
    .nullable()
    .max(50, "Tên quốc gia không được vượt quá 50 ký tự."),

  postalCode: Yup.string()
    .nullable()
    .max(20, "Mã bưu điện không được vượt quá 20 ký tự.")
    .matches(/^[A-Za-z0-9\s-]*$/, "Định dạng mã bưu điện không hợp lệ."),

  phoneNumber: Yup.string()
    .nullable()
    .matches(/^[0-9+\-\s()]*$/, "Định dạng số điện thoại không hợp lệ."),

  isEmailConfirmed: Yup.boolean().default(false),
  isActive: Yup.boolean().default(false),

  roles: Yup.array()
    .of(Yup.string())
    .min(1, "Cần chọn ít nhất một vai trò.")
    .default(["User"]),
});

export const createUserValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email là bắt buộc.")
    .email("Định dạng email không hợp lệ.")
    .max(256, "Email không được vượt quá 256 ký tự."),

  password: Yup.string()
    .required("Mật khẩu là bắt buộc.")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự."),

  firstName: Yup.string()
    .required("Tên là bắt buộc.")
    .max(50, "Tên không được vượt quá 50 ký tự."),

  lastName: Yup.string()
    .required("Họ là bắt buộc.")
    .max(50, "Họ không được vượt quá 50 ký tự."),

  dateOfBirth: Yup.date()
    .nullable()
    .typeError("Định dạng ngày sinh không hợp lệ."),

  gender: Yup.number()
    .oneOf(
      [0, 1, 2, undefined],
      "Giới tính không hợp lệ. Giá trị hợp lệ: 0 (Nam), 1 (Nữ) hoặc 2 (Khác)."
    )
    .nullable()
    .typeError("Giới tính phải là số: 0 (Nam), 1 (Nữ), hoặc 2 (Khác)."),

  address: Yup.string()
    .nullable()
    .max(255, "Địa chỉ không được vượt quá 255 ký tự."),

  city: Yup.string()
    .nullable()
    .max(100, "Tên thành phố không được vượt quá 100 ký tự."),

  country: Yup.string()
    .nullable()
    .max(100, "Tên quốc gia không được vượt quá 100 ký tự."),

  postalCode: Yup.string()
    .nullable()
    .max(20, "Mã bưu điện không được vượt quá 20 ký tự."),

  phoneNumber: Yup.string()
    .nullable()
    .matches(/^\+?[0-9\s-]{7,20}$/, "Định dạng số điện thoại không hợp lệ."),

  roles: Yup.array().of(Yup.string()).nullable(),
});

export const updateUserValidationSchema = Yup.object({
  firstName: Yup.string().max(50, "Tên không được vượt quá 50 ký tự."),

  lastName: Yup.string().max(50, "Họ không được vượt quá 50 ký tự."),

  email: Yup.string()
    .email("Định dạng email không hợp lệ.")
    .max(256, "Email không được vượt quá 256 ký tự."),

  dateOfBirth: Yup.date()
    .nullable()
    .typeError("Định dạng ngày sinh không hợp lệ."),

  gender: Yup.number()
    .oneOf(
      [0, 1, 2, undefined],
      "Giới tính không hợp lệ. Giá trị hợp lệ: 0 (Nam), 1 (Nữ), hoặc 2 (Khác)."
    )
    .nullable()
    .typeError("Giới tính phải là số: 0 (Nam), 1 (Nữ), hoặc 2 (Khác)."),

  address: Yup.string()
    .nullable()
    .max(255, "Địa chỉ không được vượt quá 255 ký tự."),

  city: Yup.string()
    .nullable()
    .max(100, "Tên thành phố không được vượt quá 100 ký tự."),

  country: Yup.string()
    .nullable()
    .max(100, "Tên quốc gia không được vượt quá 100 ký tự."),

  postalCode: Yup.string()
    .nullable()
    .max(20, "Mã bưu điện không được vượt quá 20 ký tự."),

  phoneNumber: Yup.string()
    .nullable()
    .matches(/^\+?[0-9\s-]{7,20}$/, "Định dạng số điện thoại không hợp lệ."),

  isActive: Yup.boolean().nullable(),
  isDeleted: Yup.boolean().nullable(),
  isLocked: Yup.boolean().nullable(),

  roles: Yup.array().of(Yup.string()).nullable(),
});
