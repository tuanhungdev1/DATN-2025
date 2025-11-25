import * as Yup from "yup";
import dayjs from "dayjs";

export const createBookingValidationSchema = Yup.object({
  homestayId: Yup.number().required("Thiếu thông tin homestay"),
  checkInDate: Yup.string()
    .required("Vui lòng chọn ngày nhận phòng")
    .test("is-valid-date", "Ngày nhận phòng không hợp lệ", (value) =>
      value ? dayjs(value, "YYYY-MM-DD", true).isValid() : false
    ),
  checkOutDate: Yup.string()
    .required("Vui lòng chọn ngày trả phòng")
    .test("is-valid-date", "Ngày trả phòng không hợp lệ", (value) =>
      value ? dayjs(value, "YYYY-MM-DD", true).isValid() : false
    )
    .test(
      "after-checkin",
      "Ngày trả phòng phải sau ngày nhận phòng",
      function (value) {
        const { checkInDate } = this.parent;
        return checkInDate && value
          ? dayjs(value).isAfter(dayjs(checkInDate))
          : false;
      }
    ),
  numberOfAdults: Yup.number()
    .min(1, "Phải có ít nhất 1 người lớn")
    .required("Bắt buộc"),
  numberOfChildren: Yup.number().min(0),
  numberOfInfants: Yup.number().min(0),
  specialRequests: Yup.string().optional(),
  guestFullName: Yup.string()
    .required("Vui lòng nhập họ tên người đặt")
    .max(200, "Họ tên không quá 200 ký tự"),

  guestEmail: Yup.string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ")
    .max(200, "Email không quá 200 ký tự"),

  guestPhoneNumber: Yup.string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ (10-11 chữ số)")
    .max(20, "Số điện thoại không quá 20 ký tự"),

  guestAddress: Yup.string().max(500, "Địa chỉ không quá 500 ký tự").nullable(),
  guestCity: Yup.string().max(100, "Thành phố không quá 100 ký tự").nullable(),
  guestCountry: Yup.string()
    .max(100, "Quốc gia không quá 100 ký tự")
    .nullable(),

  // ✅ THÊM: Validation cho đặt phòng cho người khác
  isBookingForSomeoneElse: Yup.boolean(),

  actualGuestFullName: Yup.string()
    .when("isBookingForSomeoneElse", {
      is: true,
      then: (schema) => schema.required("Vui lòng nhập họ tên người ở thực tế"),
      otherwise: (schema) => schema.nullable(),
    })
    .max(200, "Họ tên không quá 200 ký tự"),

  actualGuestEmail: Yup.string()
    .email("Email không hợp lệ")
    .max(200, "Email không quá 200 ký tự")
    .nullable(),

  actualGuestPhoneNumber: Yup.string()
    .when("isBookingForSomeoneElse", {
      is: true,
      then: (schema) =>
        schema
          .required("Vui lòng nhập số điện thoại người ở thực tế")
          .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
      otherwise: (schema) => schema.nullable(),
    })
    .max(20, "Số điện thoại không quá 20 ký tự"),

  actualGuestIdNumber: Yup.string()
    .max(50, "Số CMND/CCCD không quá 50 ký tự")
    .nullable(),

  actualGuestNotes: Yup.string()
    .max(1000, "Ghi chú không quá 1000 ký tự")
    .nullable(),
});

export const updateBookingValidationSchema = Yup.object().shape({
  checkInDate: Yup.date().nullable().typeError("Ngày nhận phòng không hợp lệ"),

  checkOutDate: Yup.date().nullable().typeError("Ngày trả phòng không hợp lệ"),

  numberOfGuests: Yup.number()
    .nullable()
    .min(1, "Số lượng khách phải từ 1 đến 50")
    .max(50, "Số lượng khách phải từ 1 đến 50"),

  numberOfAdults: Yup.number()
    .nullable()
    .min(1, "Số lượng người lớn phải từ 1 đến 50")
    .max(50, "Số lượng người lớn phải từ 1 đến 50"),

  numberOfChildren: Yup.number()
    .nullable()
    .min(0, "Số lượng trẻ em phải từ 0 đến 50")
    .max(50, "Số lượng trẻ em phải từ 0 đến 50"),

  numberOfInfants: Yup.number()
    .nullable()
    .min(0, "Số lượng trẻ sơ sinh phải từ 0 đến 10")
    .max(10, "Số lượng trẻ sơ sinh phải từ 0 đến 10"),

  specialRequests: Yup.string()
    .nullable()
    .max(1000, "Yêu cầu đặc biệt không được vượt quá 1000 ký tự"),
  // ✅ THÊM: Validation cho thông tin người đặt
  guestFullName: Yup.string()
    .required("Vui lòng nhập họ tên người đặt")
    .max(200, "Họ tên không quá 200 ký tự"),

  guestEmail: Yup.string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ")
    .max(200, "Email không quá 200 ký tự"),

  guestPhoneNumber: Yup.string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ (10-11 chữ số)")
    .max(20, "Số điện thoại không quá 20 ký tự"),

  guestAddress: Yup.string().max(500, "Địa chỉ không quá 500 ký tự").nullable(),
  guestCity: Yup.string().max(100, "Thành phố không quá 100 ký tự").nullable(),
  guestCountry: Yup.string()
    .max(100, "Quốc gia không quá 100 ký tự")
    .nullable(),

  // THÊM: Validation cho đặt phòng cho người khác
  isBookingForSomeoneElse: Yup.boolean().nullable(),

  actualGuestFullName: Yup.string()
    .when("isBookingForSomeoneElse", {
      is: true,
      then: (schema) => schema.required("Vui lòng nhập họ tên người ở thực tế"),
      otherwise: (schema) => schema.nullable(),
    })
    .max(200, "Họ tên không quá 200 ký tự")
    .nullable(),

  actualGuestEmail: Yup.string()
    .email("Email không hợp lệ")
    .max(200, "Email không quá 200 ký tự")
    .nullable(),

  actualGuestPhoneNumber: Yup.string()
    .when("isBookingForSomeoneElse", {
      is: true,
      then: (schema) =>
        schema
          .required("Vui lòng nhập số điện thoại người ở thực tế")
          .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
      otherwise: (schema) => schema.nullable(),
    })
    .max(20, "Số điện thoại không quá 20 ký tự")
    .nullable(),

  actualGuestIdNumber: Yup.string()
    .max(50, "Số CMND/CCCD không quá 50 ký tự")
    .nullable(),

  actualGuestNotes: Yup.string()
    .max(1000, "Ghi chú không quá 1000 ký tự")
    .nullable(),
});
