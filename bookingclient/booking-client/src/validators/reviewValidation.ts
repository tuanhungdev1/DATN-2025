// src/validations/review.validation.ts
import * as Yup from "yup";

const ratingSchema = Yup.number()
  .integer("Phải là số nguyên")
  .min(1, "Tối thiểu 1 sao")
  .max(5, "Tối đa 5 sao")
  .required("Bắt buộc");

export const createReviewSchema = Yup.object().shape({
  overallRating: ratingSchema,
  cleanlinessRating: ratingSchema,
  locationRating: ratingSchema,
  valueForMoneyRating: ratingSchema,
  communicationRating: ratingSchema,
  checkInRating: ratingSchema,
  reviewComment: Yup.string()
    .nullable()
    .max(1000, "Bình luận không quá 1000 ký tự"),
  isRecommended: Yup.boolean(),
  bookingId: Yup.number()
    .integer()
    .positive()
    .required("Booking ID là bắt buộc"),
});

export const updateReviewSchema = Yup.object().shape({
  overallRating: ratingSchema.nullable(),
  cleanlinessRating: ratingSchema.nullable(),
  locationRating: ratingSchema.nullable(),
  valueForMoneyRating: ratingSchema.nullable(),
  communicationRating: ratingSchema.nullable(),
  checkInRating: ratingSchema.nullable(),
  reviewComment: Yup.string()
    .nullable()
    .max(1000, "Bình luận không quá 1000 ký tự"),
  isRecommended: Yup.boolean().nullable(),
});

export const hostResponseSchema = Yup.object().shape({
  hostResponse: Yup.string()
    .required("Nội dung phản hồi là bắt buộc")
    .max(1000, "Phản hồi không quá 1000 ký tự"),
});

export const reviewValidationSchema = Yup.object({
  overallRating: Yup.number()
    .min(1, "Vui lòng chọn đánh giá")
    .required("Bắt buộc"),
  cleanlinessRating: Yup.number().min(1).required("Bắt buộc"),
  locationRating: Yup.number().min(1).required("Bắt buộc"),
  valueForMoneyRating: Yup.number().min(1).required("Bắt buộc"),
  communicationRating: Yup.number().min(1).required("Bắt buộc"),
  checkInRating: Yup.number().min(1).required("Bắt buộc"),
  reviewComment: Yup.string().max(1000, "Tối đa 1000 ký tự"),
  isRecommended: Yup.boolean(),
});
