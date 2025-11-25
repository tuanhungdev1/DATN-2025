// src/validators/homestayValidation.ts
import * as Yup from "yup";

export const createHomestayValidationSchema = Yup.object().shape({
  homestayTitle: Yup.string()
    .required("Tiêu đề homestay là bắt buộc")
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  homestayDescription: Yup.string()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự")
    .optional(),
  slug: Yup.string()
    .matches(
      /^[a-z0-9-]+$/i,
      "Slug chỉ được chứa chữ cái, số và dấu gạch ngang"
    )
    .max(200, "Slug không được vượt quá 200 ký tự")
    .optional(),
  fullAddress: Yup.string()
    .required("Địa chỉ đầy đủ là bắt buộc")
    .max(300, "Địa chỉ không được vượt quá 300 ký tự"),
  city: Yup.string()
    .required("Thành phố là bắt buộc")
    .max(100, "Thành phố không được vượt quá 100 ký tự"),
  province: Yup.string()
    .required("Tỉnh/thành phố là bắt buộc")
    .max(100, "Tỉnh không được vượt quá 100 ký tự"),
  country: Yup.string()
    .required("Quốc gia là bắt buộc")
    .max(100, "Quốc gia không được vượt quá 100 ký tự")
    .default("Vietnam"),
  postalCode: Yup.string()
    .max(20, "Mã bưu điện không được vượt quá 20 ký tự")
    .optional(),
  latitude: Yup.number()
    .required("Vĩ độ là bắt buộc")
    .min(-90, "Vĩ độ phải từ -90 đến 90")
    .max(90, "Vĩ độ phải từ -90 đến 90"),
  longitude: Yup.number()
    .required("Kinh độ là bắt buộc")
    .min(-180, "Kinh độ phải từ -180 đến 180")
    .max(180, "Kinh độ phải từ -180 đến 180"),
  areaInSquareMeters: Yup.number()
    .nullable()
    .min(0, "Diện tích không thể âm")
    .max(100000, "Diện tích tối đa 100000 m²")
    .optional(),
  numberOfFloors: Yup.number()
    .nullable()
    .min(0, "Số tầng không thể âm")
    .max(100, "Số tầng tối đa 100")
    .optional(),
  numberOfRooms: Yup.number()
    .required("Tổng số phòng là bắt buộc")
    .min(1, "Tối thiểu 1 phòng")
    .max(100, "Tối đa 100 phòng"),
  numberOfBedrooms: Yup.number()
    .required("Số phòng ngủ là bắt buộc")
    .min(0, "Không thể âm")
    .max(50, "Tối đa 50 phòng"),
  numberOfBathrooms: Yup.number()
    .required("Số phòng tắm là bắt buộc")
    .min(0, "Không thể âm")
    .max(50, "Tối đa 50 phòng"),
  numberOfBeds: Yup.number()
    .required("Số giường là bắt buộc")
    .min(0, "Không thể âm")
    .max(50, "Tối đa 50 giường"),
  maximumGuests: Yup.number()
    .required("Số lượng khách tối đa là bắt buộc")
    .min(1, "Tối thiểu 1 khách")
    .max(50, "Tối đa 50 khách"),
  maximumChildren: Yup.number()
    .required("Số trẻ em tối đa là bắt buộc")
    .min(0, "Không thể âm")
    .max(50, "Tối đa 50 trẻ em"),
  baseNightlyPrice: Yup.number()
    .required("Giá ban đêm là bắt buộc")
    .min(1, "Giá phải lớn hơn 0")
    .max(100000000, "Giá tối đa 100000000"),
  weekendPrice: Yup.number()
    .nullable()
    .min(0, "Giá không thể âm")
    .max(100000000, "Giá tối đa 100000000")
    .optional(),
  weeklyDiscount: Yup.number()
    .nullable()
    .min(0, "Giảm giá từ 0%")
    .max(100, "Giảm giá tối đa 100%")
    .optional(),
  monthlyDiscount: Yup.number()
    .nullable()
    .min(0, "Giảm giá từ 0%")
    .max(100, "Giảm giá tối đa 100%")
    .optional(),
  minimumNights: Yup.number()
    .required("Số đêm tối thiểu là bắt buộc")
    .min(1, "Tối thiểu 1 đêm")
    .max(30, "Tối đa 30 đêm"),
  maximumNights: Yup.number()
    .required("Số đêm tối đa là bắt buộc")
    .min(1, "Tối thiểu 1 đêm")
    .max(365, "Tối đa 365 đêm"),
  checkInTime: Yup.string().required("Thời gian check-in là bắt buộc"),
  checkOutTime: Yup.string().required("Thời gian check-out là bắt buộc"),
  isInstantBook: Yup.boolean().default(false),
  hasParking: Yup.boolean().default(false),
  isPetFriendly: Yup.boolean().default(false),
  hasPrivatePool: Yup.boolean().default(false),
  ownerId: Yup.number().required("Chủ sở hữu là bắt buộc"),
  propertyTypeId: Yup.number()
    .required("Loại bất động sản là bắt buộc")
    .min(1, "Vui lòng chọn loại bất động sản"),
  searchKeywords: Yup.string()
    .max(500, "Từ khóa tìm kiếm không được vượt quá 500 ký tự")
    .optional(),
  availableRooms: Yup.number()
    .required("Số phòng trống là bắt buộc")
    .min(0, "Số phòng trống không thể âm")
    .max(100, "Tối đa 100 phòng trống"),

  isFreeCancellation: Yup.boolean()
    .required("Trạng thái miễn hủy là bắt buộc")
    .default(false),

  freeCancellationDays: Yup.number()
    .nullable()
    .when("isFreeCancellation", {
      is: true,
      then: (schema) =>
        schema
          .required("Số ngày miễn hủy là bắt buộc khi bật miễn hủy")
          .min(1, "Ít nhất 1 ngày miễn hủy")
          .max(60, "Tối đa 60 ngày miễn hủy"),
      otherwise: (schema) => schema.optional(),
    }),

  isPrepaymentRequired: Yup.boolean()
    .required("Yêu cầu trả trước là bắt buộc")
    .default(false),

  roomsAtThisPrice: Yup.number()
    .required("Số phòng áp dụng giá này là bắt buộc")
    .min(1, "Tối thiểu 1 phòng")
    .max(100, "Tối đa 100 phòng"),
  images: Yup.array()
    .of(
      Yup.object().shape({
        imageFile: Yup.mixed()
          .required("Hình ảnh là bắt buộc")
          .test("fileSize", "Hình ảnh không được vượt quá 5MB", (file) => {
            if (!file) return false;
            return (file as File).size <= 5 * 1024 * 1024;
          })
          .test(
            "fileType",
            "Chỉ chấp nhận ảnh (JPG, PNG, GIF, WEBP)",
            (file) => {
              if (!file) return false;
              return [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/gif",
                "image/webp",
              ].includes((file as File).type);
            }
          ),
        imageTitle: Yup.string()
          .max(200, "Tiêu đề không được vượt quá 200 ký tự")
          .optional(),
        imageDescription: Yup.string()
          .max(500, "Mô tả không được vượt quá 500 ký tự")
          .optional(),
        displayOrder: Yup.number()
          .min(0, "Thứ tự phải >= 0")
          .max(100, "Thứ tự tối đa 100")
          .optional(),
        isPrimaryImage: Yup.boolean(),
        roomType: Yup.string()
          .max(50, "Loại phòng không được vượt quá 50 ký tự")
          .optional(),
      })
    )
    .min(1, "Phải có ít nhất 1 hình ảnh")
    .required("Hình ảnh là bắt buộc"),
  amenities: Yup.array()
    .of(
      Yup.object().shape({
        amenityId: Yup.number()
          .required("ID tiện nghi là bắt buộc")
          .min(1, "Vui lòng chọn tiện nghi"),
        customNote: Yup.string()
          .max(500, "Ghi chú không được vượt quá 500 ký tự")
          .optional(),
      })
    )
    .optional(),
  rules: Yup.array()
    .of(
      Yup.object().shape({
        ruleId: Yup.number()
          .required("ID quy tắc là bắt buộc")
          .min(1, "Vui lòng chọn quy tắc"),
        customNote: Yup.string()
          .max(500, "Ghi chú không được vượt quá 500 ký tự")
          .optional(),
      })
    )
    .optional(),
  availabilityCalendars: Yup.array()
    .of(
      Yup.object().shape({
        homestayId: Yup.number().required("Homestay ID là bắt buộc"),
        availableDate: Yup.string().required("Ngày có sẵn là bắt buộc"),
        isAvailable: Yup.boolean().default(true),
        customPrice: Yup.number()
          .nullable()
          .min(0, "Giá tùy chỉnh phải >= 0")
          .optional(),
        minimumNights: Yup.number()
          .nullable()
          .min(1, "Số đêm tối thiểu phải >= 1")
          .max(365, "Số đêm tối đa 365")
          .optional(),
        isBlocked: Yup.boolean().default(false),
        blockReason: Yup.string()
          .nullable()
          .max(500, "Lý do chặn không được vượt quá 500 ký tự")
          .when("isBlocked", {
            is: true,
            then: (schema) => schema.required("Vui lòng nhập lý do chặn"),
            otherwise: (schema) => schema.optional(),
          }),
      })
    )
    .optional(),
});

export const updateHomestayValidationSchema = Yup.object().shape({
  homestayTitle: Yup.string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự")
    .optional(),
  homestayDescription: Yup.string()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự")
    .optional(),
  slug: Yup.string()
    .matches(
      /^[a-z0-9-]+$/i,
      "Slug chỉ được chứa chữ cái, số và dấu gạch ngang"
    )
    .max(200, "Slug không được vượt quá 200 ký tự")
    .optional(),
  fullAddress: Yup.string()
    .max(300, "Địa chỉ không được vượt quá 300 ký tự")
    .optional(),
  city: Yup.string()
    .max(100, "Thành phố không được vượt quá 100 ký tự")
    .optional(),
  province: Yup.string()
    .max(100, "Tỉnh không được vượt quá 100 ký tự")
    .optional(),
  country: Yup.string()
    .max(100, "Quốc gia không được vượt quá 100 ký tự")
    .optional(),
  postalCode: Yup.string()
    .max(20, "Mã bưu điện không được vượt quá 20 ký tự")
    .optional(),
  latitude: Yup.number()
    .min(-90, "Vĩ độ phải từ -90 đến 90")
    .max(90, "Vĩ độ phải từ -90 đến 90")
    .optional(),
  longitude: Yup.number()
    .min(-180, "Kinh độ phải từ -180 đến 180")
    .max(180, "Kinh độ phải từ -180 đến 180")
    .optional(),

  areaInSquareMeters: Yup.number().min(0).max(100000).optional(),
  numberOfFloors: Yup.number().min(0).max(100).optional(),
  numberOfRooms: Yup.number().min(1).max(100).optional(),
  numberOfBedrooms: Yup.number().min(0).max(50).optional(),
  numberOfBathrooms: Yup.number().min(0).max(50).optional(),
  numberOfBeds: Yup.number().min(0).max(50).optional(),

  maximumGuests: Yup.number().min(1).max(50).optional(),
  maximumChildren: Yup.number().min(0).max(50).optional(),

  baseNightlyPrice: Yup.number().min(1).max(100000000).optional(),
  weekendPrice: Yup.number().min(0).max(100000000).optional(),
  weeklyDiscount: Yup.number().min(0).max(100).optional(),
  monthlyDiscount: Yup.number().min(0).max(100).optional(),

  minimumNights: Yup.number().min(1).max(30).optional(),
  maximumNights: Yup.number().min(1).max(365).optional(),
  checkInTime: Yup.string().optional(),
  checkOutTime: Yup.string().optional(),

  isInstantBook: Yup.boolean().optional(),
  hasParking: Yup.boolean().optional(),
  isPetFriendly: Yup.boolean().optional(),
  hasPrivatePool: Yup.boolean().optional(),

  ownerId: Yup.number().min(1).optional(),
  propertyTypeId: Yup.number()
    .min(1, "Vui lòng chọn loại bất động sản")
    .optional(),

  searchKeywords: Yup.string()
    .max(500, "Từ khóa không được vượt quá 500 ký tự")
    .optional(),

  availableRooms: Yup.number().min(0).max(100).optional(),

  isFreeCancellation: Yup.boolean().optional(),
  freeCancellationDays: Yup.number().min(1).max(60).optional(),
  isPrepaymentRequired: Yup.boolean().optional(),
  roomsAtThisPrice: Yup.number().min(1).max(100).optional(),
});
