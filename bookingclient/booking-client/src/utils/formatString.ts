export const generateRandomString = (length: number): string => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const generateSlug = (title: string): string => {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
  const randomSuffix = generateRandomString(6); // Tạo chuỗi 6 ký tự
  return `${baseSlug}-${randomSuffix}`;
};

export const formatDateVi = (dateString: string) => {
  const date = new Date(dateString);

  // Kiểm tra hợp lệ
  if (isNaN(date.getTime())) return "Ngày không hợp lệ";

  // Định dạng: Thứ, ngày tháng năm (theo chuẩn Việt Nam)
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long", // Thứ Hai, Thứ Ba,...
    day: "numeric", // 1, 2, 3,...
    month: "long", // tháng Một, tháng Hai,...
    year: "numeric", // 2025
  }).format(date);
};
