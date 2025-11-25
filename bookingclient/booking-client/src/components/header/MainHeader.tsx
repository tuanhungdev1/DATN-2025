/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  Heart,
  User,
  CreditCard,
  Settings,
  Lock,
  LogOut,
  ChevronRight,
  Shield,
  Home,
} from "lucide-react";
import DEFAULT_USER_AVATAR from "@/assets/default_user_avatar.png";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes/routeConstants";
import { useLogoutMutation } from "@/services/endpoints/auth.api";
import { persistor } from "@/store";
import { useToast } from "@/hooks/useToast";

const menuItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Homestay", link: "/homestay-list" },
  { label: "Liên hệ", link: "/contact" },
  { label: "Về chúng tôi", link: "/about" },
];

const MainHeader = () => {
  const { isAuthenticated, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 900px

  const toast = useToast();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleAvatarClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();
      if (result.success) {
        await persistor.purge();
        toast.success("Đăng xuất thành công!");
        handleClose();
        setMobileOpen(false);
        navigate(ROUTES.HOME);
      }
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Đăng xuất thất bại! Vui lòng thử lại sau.");
    }
  };

  const userMenuItems = useMemo(() => {
    const baseItems = [
      {
        label: "Thông tin cá nhân",
        link: ROUTES.USER_PROFILE,
        icon: <User size={20} />,
      },
      {
        label: "Thanh toán",
        link: "/user/profile/my-payments",
        icon: <CreditCard size={20} />,
      },
      {
        label: "Cài đặt",
        link: ROUTES.USER_PROFILE_SETTINGS,
        icon: <Settings size={20} />,
      },
      {
        label: "Đổi mật khẩu",
        link: ROUTES.AUTH_FORGOT_PASSWORD,
        icon: <Lock size={20} />,
      },
    ];

    const roleItems: any[] = [];
    if (Array.isArray(user?.roles) && user.roles.includes("Admin")) {
      roleItems.push({
        label: "Dành cho quản trị viên",
        link: "/admin/dashboard",
        icon: <Shield size={20} />,
        isSpecial: true,
      });
    }
    if (Array.isArray(user?.roles) && user.roles.includes("Host")) {
      roleItems.push({
        label: "Dành cho đối tác",
        link: "/host/dashboard",
        icon: <Home size={20} />,
        isSpecial: true,
      });
    }
    return [...baseItems, ...roleItems];
  }, [user]);

  return (
    <>
      {/* ==================== HEADER CHÍNH (giữ nguyên style cũ 100%) ==================== */}
      <Container
        maxWidth="lg"
        sx={{
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", width: "100%" }}
          alignItems="center"
          spacing={2}
        >
          {/* Logo */}
          <Link to="/">
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "white",
                fontSize: "1.5rem",
                letterSpacing: "0.5px",
                textTransform: "none",
              }}
            >
              NextStay.com
            </Typography>
          </Link>

          {/* MENU NGANG – ẨN TRÊN MOBILE */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  href={item.link}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    borderRadius: "4px",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transition: "background-color 0.3s ease",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* RIGHT – CHỈ THÊM HAMBURGER KHI MOBILE */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Yêu thích">
                  <IconButton
                    href="/user/profile/wishlist"
                    sx={{ color: "white" }}
                  >
                    <Heart />
                  </IconButton>
                </Tooltip>

                {/* Avatar – vẫn giữ nguyên */}
                <Avatar
                  alt="User Avatar"
                  src={user?.avatar ?? DEFAULT_USER_AVATAR}
                  sx={{ width: 42, height: 42, cursor: "pointer" }}
                  onClick={handleAvatarClick}
                />

                {/* Avatar Menu – giữ nguyên 100% */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      width: 280,
                      borderRadius: "8px",
                      transition: "all 0.3s ease-in-out",
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}
                  >
                    <Avatar
                      alt="User Avatar"
                      src={user?.avatar ?? DEFAULT_USER_AVATAR}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {user?.fullName || "Tên Người Dùng"}
                      </Typography>
                      <Typography variant="caption">
                        {user?.email || "user@example.com"}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  {userMenuItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      component={Link}
                      to={item.link}
                      onClick={handleClose}
                      sx={{
                        py: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        {item.icon}
                        <Typography variant="body2">{item.label}</Typography>
                      </Box>
                      <ChevronRight size={20} />
                    </MenuItem>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.5,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                      color: "error.main",
                      "&:hover": { backgroundColor: "rgba(255,0,0,0.08)" },
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <LogOut size={20} />
                      <Typography variant="body2" fontWeight={500}>
                        Đăng xuất
                      </Typography>
                    </Box>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              !isMobile && (
                <Stack direction="row" spacing={2}>
                  <Link to={ROUTES.AUTH_LOGIN}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "white",
                        color: "primary.main",
                        borderRadius: "4px",
                        ":hover": {
                          backgroundColor: "white",
                          color: "primary.main",
                        },
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to={ROUTES.AUTH_REGISTER}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "white",
                        color: "primary.main",
                        borderRadius: "4px",
                      }}
                    >
                      Đăng ký
                    </Button>
                  </Link>
                </Stack>
              )
            )}

            {/* HAMBURGER ICON – CHỈ HIỆN TRÊN MOBILE */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ color: "white" }}
              >
                <MenuIcon fontSize="large" />
              </IconButton>
            )}
          </Box>
        </Stack>
      </Container>

      {/* ==================== MOBILE DRAWER (từ trên xuống) ==================== */}
      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "primary.main",
            color: "white",
            height: "100vh",
            pt: 2,
          },
        }}
      >
        <Box sx={{ px: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{ color: "white" }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>

          {/* Logo trong drawer */}
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
          >
            NextStay.com
          </Typography>

          {/* Menu items */}
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.link}
                  onClick={() => setMobileOpen(false)}
                  sx={{ py: 2 }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "1.1rem",
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Nếu chưa đăng nhập – hiện nút login/register trong drawer */}
            {!isAuthenticated && (
              <>
                <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.3)" }} />
                <Box sx={{ px: 2, pb: 2 }}>
                  <Button
                    component={Link}
                    to={ROUTES.AUTH_LOGIN}
                    fullWidth
                    variant="contained"
                    sx={{
                      mb: 2,
                      backgroundColor: "white",
                      color: "primary.main",
                      borderRadius: "4px",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    component={Link}
                    to={ROUTES.AUTH_REGISTER}
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "white",
                      color: "primary.main",
                      borderRadius: "4px",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Đăng ký
                  </Button>
                </Box>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MainHeader;
