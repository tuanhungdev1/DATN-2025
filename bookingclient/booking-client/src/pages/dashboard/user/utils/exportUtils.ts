// src/pages/admin/UserManagement/components/utils/exportUtils.ts
import type { UserProfile } from "@/types/user.types";

export const exportUsersToCSV = (users: UserProfile[]) => {
  const headers = [
    "ID",
    "Email",
    "First Name",
    "Last Name",
    "Phone",
    "Status",
    "Created At",
    "Last Login",
  ];

  const rows = users.map((user) => [
    user.id,
    user.email,
    user.firstName,
    user.lastName,
    user.phoneNumber || "N/A",
    user.isActive ? "Active" : "Inactive",
    new Date(user.createdAt).toLocaleDateString("vi-VN"),
    user.lastLoginAt
      ? new Date(user.createdAt).toLocaleDateString("vi-VN")
      : "N/A",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) =>
          typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
        )
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `users_${Date.now()}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportUsersToJSON = (users: UserProfile[]) => {
  const jsonString = JSON.stringify(users, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `users_${Date.now()}.json`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportUsersToExcel = async (users: UserProfile[]) => {
  // Sử dụng thư viện xlsx nếu cần Excel
  // npm install xlsx
  const XLSX = await import("xlsx");

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(
    users.map((user) => ({
      ID: user.id,
      Email: user.email,
      "First Name": user.firstName,
      "Last Name": user.lastName,
      Phone: user.phoneNumber || "N/A",
      Status: user.isActive ? "Active" : "Inactive",
      "Created At": new Date(user.createdAt).toLocaleDateString("vi-VN"),
      "Last Login": user.lastLoginAt
        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
        : "N/A",
    }))
  );

  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  XLSX.writeFile(workbook, `users_${Date.now()}.xlsx`);
};
