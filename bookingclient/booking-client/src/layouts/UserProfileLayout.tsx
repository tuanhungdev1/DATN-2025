/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, Link, Outlet } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Logout,
  ChevronRight,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useLogoutMutation } from "@/services/endpoints/auth.api";
import { persistor } from "@/store";
import { useToast } from "@/hooks/useToast";
import AppImage from "@/components/images/AppImage";
import USER_DEFAULT_AVATAR from "@/assets/default_user_avatar.png";
import { ROUTES } from "@/constants/routes/routeConstants";
import { AppButton } from "@/components/button";
import { useState, useRef, useMemo } from "react";
import { updateUser } from "@/store/slices/authSlice";
import {
  useDeleteUserAvatarMutation,
  useUploadUserAvatarMutation,
} from "@/services/endpoints/user.api";
import type { BreadcrumbItem } from "@/components/breadcrumb/AppBreadcrumbs";
import {
  BookPlus,
  CreditCard,
  HeartPlus,
  House,
  IdCard,
  Settings2,
  UserRound,
  UserRoundPen,
  UserStar,
} from "lucide-react";
import AppBreadcrumbs from "@/components/breadcrumb/AppBreadcrumbs";

const navItems = [
  {
    name: "Hồ sơ cá nhân",
    path: ROUTES.USER_INFORMATION,
    icon: <UserRound size={18} />,
  },
  {
    name: "Đặt phòng",
    path: "/user/profile/my-bookings",
    icon: <BookPlus size={18} />,
  },
  {
    name: "Yêu thích",
    path: ROUTES.USER_PROFILE_WISHLIST,
    icon: <HeartPlus size={18} />,
  },
  {
    name: "Thanh toán",
    path: "/user/profile/my-payments",
    icon: <CreditCard size={18} />,
  },
  {
    name: "Trở thành Chủ nhà",
    path: "/user/profile/host-registration",
    icon: <UserStar size={18} />,
  },
  {
    name: "Cài đặt",
    path: ROUTES.USER_PROFILE_SETTINGS,
    icon: <Settings2 size={18} />,
  },
];

// 🎯 Mapping để generate breadcrumb
const profilePageMap: Record<
  string,
  { label: string; icon?: React.ReactNode }
> = {
  [ROUTES.USER_INFORMATION]: {
    label: "Hồ sơ cá nhân",
    icon: <IdCard size={14} />,
  },
  [ROUTES.USER_PROFILE_EDIT]: {
    label: "Chỉnh sửa hồ sơ",
    icon: <UserRoundPen size={14} />,
  },
  [ROUTES.USER_PROFILE_SETTINGS]: {
    label: "Cài đặt",
    icon: <Settings2 size={14} />,
  },
  "/user/profile/my-bookings": {
    label: "Đặt phòng",
    icon: <BookPlus size={14} />,
  },
  "/user/profile/my-payments": {
    label: "Thanh toán",
    icon: <CreditCard size={14} />,
  },
  "/user/profile/host-registration/create": {
    label: "Tạo hồ sơ chủ nhà",
    icon: <UserStar size={14} />,
  },
  "/user/profile/host-registration": {
    label: "Đăng ký trở thành chủ nhà",
    icon: <UserStar size={14} />,
  },
  [ROUTES.USER_PROFILE_WISHLIST]: {
    label: "Yêu thích",
    icon: <HeartPlus size={14} />,
  },
};

const UserProfileLayout = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const [uploadUserAvatar] = useUploadUserAvatarMutation();
  const [deleteUserAvatar] = useDeleteUserAvatarMutation();
  const toast = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getActiveNavItem = () => {
    let match: { item: (typeof navItems)[0]; length: number } | null = null;

    for (const item of navItems) {
      if (location.pathname.startsWith(item.path)) {
        const len = item.path.length;
        if (!match || len > match.length) {
          match = { item, length: len };
        }
      }
    }

    return match?.item ?? null;
  };

  const activeItem = useMemo(getActiveNavItem, [location.pathname]);

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // 🎯 Generate breadcrumb items động dựa trên URL
  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        label: "Trang chủ",
        path: ROUTES.HOME,
        icon: <House size={14} />,
      },
    ];

    const currentPath = location.pathname;

    // Tìm key DÀI NHẤT khớp với currentPath
    let matchedKey: string | undefined;
    let maxLength = 0;

    for (const key of Object.keys(profilePageMap)) {
      if (currentPath.startsWith(key) && key.length > maxLength) {
        matchedKey = key;
        maxLength = key.length;
      }
    }

    if (matchedKey) {
      const pageInfo = profilePageMap[matchedKey];

      // Nếu không phải trang chính (Hồ sơ cá nhân), thêm link "Tài khoản"
      if (
        !currentPath.startsWith(ROUTES.USER_PROFILE_EDIT) &&
        currentPath !== ROUTES.USER_PROFILE
      ) {
        items.push({
          label: "Tài khoản",
          path: ROUTES.USER_PROFILE,
          icon: <UserRound size={14} />,
        });
      }

      // Thêm trang hiện tại (không có link nếu là trang cuối)
      items.push({
        label: pageInfo.label,
        icon: pageInfo.icon,
      });
    }

    return items;
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();
      if (result.success) {
        await persistor.purge();
        toast.success("Đăng xuất thành công!");
      }
    } catch (err) {
      console.error("Đăng xuất thất bại:", err);
      toast.error("Đăng xuất thất bại! Vui lòng thử lại sau.");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setPreview(user?.avatar || null);
    setSelectedFile(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
    setPreview(user?.avatar || null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate định dạng và kích thước
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast.error("Định dạng không hỗ trợ. Chỉ chấp nhận JPG hoặc PNG.");
        return;
      }

      if (file.size > maxSize) {
        toast.error("Kích thước file quá lớn. Tối đa 5MB.");
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdateAvatar = async () => {
    if (!user?.id) return;

    try {
      if (selectedFile) {
        // Upload ảnh mới
        const result = await uploadUserAvatar({
          id: parseInt(user.id),
          file: selectedFile,
        }).unwrap();

        if (result.success) {
          dispatch(updateUser({ ...user, avatar: result.data?.avatarUrl }));
          toast.success("Cập nhật ảnh đại diện thành công!");
          handleCloseDialog();
        }
      } else if (!preview && !selectedFile) {
        // Xóa ảnh đại diện
        const result = await deleteUserAvatar(parseInt(user.id)).unwrap();
        if (result.success) {
          dispatch(updateUser({ ...user, avatar: undefined }));
          toast.success("Xóa ảnh đại diện thành công!");
          handleCloseDialog();
        }
      }
    } catch (err: any) {
      console.error("Cập nhật/Xóa avatar thất bại:", err);
      toast.error(
        err?.data?.message || "Thao tác thất bại! Vui lòng thử lại sau."
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          mb: 2,
        }}
      >
        {/* ✅ Breadcrumbs */}
        <AppBreadcrumbs items={breadcrumbItems} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 1, md: 2 },
        }}
      >
        {/* ==== Cột trái (Profile Sidebar) ==== */}
        <Box
          sx={{
            width: { xs: "100%", md: 300 },
            flexShrink: 0,
            borderRadius: "4px",
            p: 3,
            display: "flex",
            bgcolor: "white",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Avatar + thông tin người dùng */}
          <Avatar
            sx={{ width: 90, height: 90, mb: 2, cursor: "pointer" }}
            onClick={handleOpenDialog}
          >
            <AppImage
              src={user?.avatar || USER_DEFAULT_AVATAR}
              alt="Avatar"
              sx={{ width: "100%", height: "100%" }}
            />
          </Avatar>

          <Typography variant="h6" fontWeight={600}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {user?.email}
          </Typography>

          <Divider sx={{ width: "100%", mb: 2 }} />

          {/* Nav Items */}
          <List
            sx={{
              width: "100%",
              gap: "8px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  mb: 0.5,
                  borderRadius: "4px",
                  bgcolor:
                    activeItem?.path === item.path ? "primary.light" : "white",
                  color:
                    activeItem?.path === item.path
                      ? "primary.contrastText"
                      : "text.primary",
                  "&:hover": {
                    bgcolor:
                      activeItem?.path === item.path
                        ? "primary.light"
                        : "action.hover",
                  },
                  display: "flex",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path)
                        ? "primary.contrastText"
                        : "text.secondary",
                      minWidth: 36,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                      fontSize: "14px",
                    }}
                  />
                </Box>
                <ChevronRight
                  sx={{
                    color: isActive(item.path)
                      ? "primary.contrastText"
                      : "text.secondary",
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ width: "100%", mt: "auto", mb: 2 }} />

          {/* Logout */}
          <AppButton
            fullWidth
            variant="outlined"
            startIcon={<Logout />}
            color="error"
            onClick={handleLogout}
            sx={{
              borderRadius: "4px",
              textTransform: "none",
              fontWeight: 600,
              py: 1.2,
            }}
          >
            Đăng xuất
          </AppButton>
        </Box>

        {/* ==== Cột phải (Dynamic content) ==== */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "white",
            borderRadius: "4px",
            p: { xs: 2 },
            overflow: "hidden",
          }}
        >
          {/* ✅ Outlet để render route con */}
          <Outlet />
        </Box>
      </Box>

      {/* Dialog Upload Avatar */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              py: 2,
            }}
          >
            {preview ? (
              <Box sx={{ position: "relative" }}>
                <Avatar sx={{ width: 150, height: 150 }}>
                  <AppImage
                    src={preview}
                    alt="Preview Avatar"
                    sx={{ width: "100%", height: "100%" }}
                  />
                </Avatar>
                <IconButton
                  size="small"
                  onClick={handleRemovePreview}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    bgcolor: "background.paper",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  border: "2px dashed grey",
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon sx={{ fontSize: 40, color: "grey" }} />
                <Typography variant="body2" color="text.secondary">
                  Tải lên hình ảnh
                </Typography>
              </Box>
            )}
            <input
              type="file"
              accept="image/jpeg, image/png"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              mt={2}
              textAlign="center"
            >
              Định dạng hỗ trợ: JPG, PNG. Kích thước tối đa: 5MB.
              <br />
              Nhấn "Cập nhật" khi không chọn ảnh để xóa ảnh đại diện hiện tại.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
          }}
        >
          <AppButton
            variant="outlined"
            size="small"
            onClick={handleCloseDialog}
          >
            Hủy
          </AppButton>
          <AppButton
            onClick={handleUpdateAvatar}
            variant="contained"
            disabled={!selectedFile && !user?.avatar} // Vô hiệu hóa nếu không có file và không có ảnh hiện tại
          >
            Cập nhật
          </AppButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfileLayout;
