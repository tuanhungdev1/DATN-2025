/* eslint-disable @typescript-eslint/no-non-null-assertion */
// src/pages/admin/UserManagement/components/UserFormDialog.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Formik, Form, type FormikHelpers } from "formik";
import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import type { User } from "@/types/user.types";
import {
  userValidationSchema,
  createUserValidationSchema,
  updateUserValidationSchema,
} from "@/validators/authValidation";
import { AppImage } from "@/components/images";
import USER_DEFAULT_AVATAR from "@/assets/default_user_avatar.png";
import { FormSelectField } from "@/components/select";
import { Gender } from "@/enums/gender.enum";
import { FormCheckbox } from "@/components/checkbox";
import { useUserManagement } from "../hooks/useUserManagement";

export interface UserFormValues {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isActive?: boolean;
  isLocked?: boolean;
  roles?: string[];
}

interface UserFormDialogProps {
  open: boolean;
  mode: "create" | "edit" | "view";
  user?: User;
  isSubmitting?: boolean;
  isUploadingAvatar?: boolean; // THÊM
  onClose: () => void;
  onSubmit: (
    values: UserFormValues,
    formikHelpers: FormikHelpers<UserFormValues>
  ) => Promise<void>;
  onAvatarUpload?: (file: File) => Promise<void>;
  onAvatarDelete?: () => Promise<void>;
  onAvatarRefresh?: () => void;
}

const GENDER_OPTIONS = [
  { value: Gender.Male, label: "Male" },
  { value: Gender.Female, label: "Female" },
  { value: Gender.Other, label: "Other" },
];

const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Host", label: "Host" },
  { value: "User", label: "User" },
];

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  mode,
  user,
  isSubmitting = false,
  isUploadingAvatar = false, // THÊM
  onClose,
  onSubmit,
  onAvatarUpload,
  onAvatarDelete,
}) => {
  const { selectedUser } = useUserManagement();
  // THAY ĐỔI: Không lưu preview - chỉ hiển thị avatar đã được upload thành công
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  // THÊM: State để track avatar URL
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(
    selectedUser?.avatar || null
  );

  //const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setCurrentAvatarUrl(user.avatar);
    } else {
      setCurrentAvatarUrl(null);
    }
  }, [user?.avatar, open]); // Re-sync khi open dialog hoặc user.avatar thay đổi

  const initialValues = useMemo<UserFormValues>(() => {
    if (mode === "create") {
      return {
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        password: "",
        dateOfBirth: undefined, // SỬA: undefined thay vì null
        gender: undefined, // SỬA: undefined thay vì null
        address: "",
        city: "",
        country: "",
        postalCode: "",
        isActive: true,
        isLocked: false,
        roles: ["User"],
      };
    }

    if (mode === "edit") {
      return {
        email: user?.email || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phoneNumber: user?.phoneNumber || "",
        password: "",
        dateOfBirth: user?.dateOfBirth ?? undefined, // SỬA: ?? undefined để handle null -> undefined
        gender: user?.gender ?? undefined, // SỬA: ?? undefined (Gender enum | undefined)
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
        postalCode: user?.postalCode || "",
        isActive: user?.isActive ?? true,
        isLocked: user?.isLocked ?? false,
        roles: user?.roles || ["User"],
      };
    }

    // View mode
    return {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      password: "",
      dateOfBirth: user?.dateOfBirth ?? undefined, // SỬA: ?? undefined
      gender: user?.gender ?? undefined, // SỬA: ?? undefined
      address: user?.address || "",
      city: user?.city || "",
      country: user?.country || "",
      postalCode: user?.postalCode || "",
      isActive: user?.isActive ?? true,
      isLocked: user?.isLocked ?? false,
      roles: user?.roles || [],
    };
  }, [user, mode]);

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !onAvatarUpload) return;

    // Validate file trước
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG, GIF images are allowed");
      return;
    }

    if (file.size > maxSize) {
      alert("File size must not exceed 5MB");
      return;
    }

    try {
      setIsUploadingFile(true);

      await onAvatarUpload(file);

      event.target.value = "";
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!onAvatarDelete) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete the avatar?"
    );
    if (!confirmed) return;

    try {
      await onAvatarDelete();
      // THÊM: Clear preview ngay sau khi xóa
      setCurrentAvatarUrl(null);
    } catch (error) {
      console.error(error);
    }
  };

  const getValidationSchema = () => {
    if (mode === "create") return createUserValidationSchema;
    if (mode === "edit") return updateUserValidationSchema;
    return userValidationSchema;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontSize: "24px",
        }}
      >
        {mode === "create"
          ? "Create New User"
          : mode === "edit"
          ? "Edit User"
          : "View User Details"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Avatar Section - dùng cho Edit và View */}
        {(mode === "edit" || mode === "view") && (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <Box
              sx={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                border: "2px solid #e0e0e0",
                backgroundColor: "#fafafa",
              }}
            >
              {isUploadingAvatar || isUploadingFile ? (
                <CircularProgress size={40} />
              ) : (
                <AppImage
                  src={currentAvatarUrl || USER_DEFAULT_AVATAR}
                  alt="User Avatar"
                />
              )}
            </Box>

            {mode === "edit" && (
              <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                <AppButton
                  variant="outlined"
                  size="small"
                  component="label"
                  disabled={isUploadingAvatar}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Avatar
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                </AppButton>
                {currentAvatarUrl && (
                  <AppButton
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={handleDeleteAvatar}
                    disabled={isUploadingAvatar}
                    startIcon={<CloseIcon />}
                  >
                    Delete
                  </AppButton>
                )}
              </Box>
            )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* View Mode - THAY Grid bằng Flexbox */}
        {mode === "view" ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Email
                </Typography>
                <Typography variant="body1">{user?.email}</Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Username
                </Typography>
                <Typography variant="body1">{user?.userName}</Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  First Name
                </Typography>
                <Typography variant="body1">{user?.firstName}</Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Last Name
                </Typography>
                <Typography variant="body1">{user?.lastName}</Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {user?.phoneNumber || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Date of Birth
                </Typography>
                <Typography variant="body1">
                  {user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                    : "N/A"}
                </Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Gender
                </Typography>
                <Typography variant="body1">
                  {user?.gender
                    ? GENDER_OPTIONS.find((g) => g.value === user.gender)?.label
                    : "N/A"}
                </Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Address
                </Typography>
                <Typography variant="body1">
                  {user?.address || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  City
                </Typography>
                <Typography variant="body1">{user?.city || "N/A"}</Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Country
                </Typography>
                <Typography variant="body1">
                  {user?.country || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Postal Code
                </Typography>
                <Typography variant="body1">
                  {user?.postalCode || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Roles
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {user?.roles && user.roles.length > 0 ? (
                    user.roles.map((role, idx) => (
                      <Chip
                        key={idx}
                        label={role}
                        size="small"
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Typography variant="body1">N/A</Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Status
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label={user?.isActive ? "Active" : "Inactive"}
                    color={user?.isActive ? "success" : "error"}
                    size="medium"
                  />
                  <Chip
                    label={user?.isLocked ? "Locked" : "Unlocked"}
                    color={user?.isLocked ? "error" : "default"}
                    size="medium"
                  />
                </Box>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Email Confirmed
                </Typography>
                <Chip
                  label={user?.isEmailConfirmed ? "Confirmed" : "Not Confirmed"}
                  color={user?.isEmailConfirmed ? "success" : "warning"}
                  size="medium"
                />
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Created At
                </Typography>
                <Typography variant="body1">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleString("vi-VN")
                    : "N/A"}
                </Typography>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Updated At
                </Typography>
                <Typography variant="body1">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleString("vi-VN")
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          /* Create/Edit Mode - THAY Grid bằng Flexbox */
          <Formik
            initialValues={initialValues}
            validationSchema={getValidationSchema()}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ isValid }) => (
              <Form>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
                  >
                    <FormTextField
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="user@example.com"
                      required
                      disabled={mode === "edit"}
                    />
                  </Box>

                  <Box
                    sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
                  >
                    <FormTextField
                      name="firstName"
                      label="First Name"
                      placeholder="John"
                      required
                    />
                  </Box>

                  <Box
                    sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
                  >
                    <FormTextField
                      name="lastName"
                      label="Last Name"
                      placeholder="Doe"
                      required
                    />
                  </Box>

                  <Box
                    sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
                  >
                    <FormTextField
                      name="phoneNumber"
                      label="Phone Number"
                      placeholder="+84 123 456 789"
                    />
                  </Box>

                  <Box
                    sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
                  >
                    <FormTextField
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                    />
                  </Box>

                  <Box
                    sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
                  >
                    <FormSelectField
                      name="gender"
                      label="Gender"
                      options={GENDER_OPTIONS}
                    />
                  </Box>

                  <Box sx={{ flex: "1 1 100%" }}>
                    <FormTextField
                      name="address"
                      label="Address"
                      placeholder="123 Main Street"
                    />
                  </Box>

                  <Box
                    sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
                  >
                    <FormTextField
                      name="city"
                      label="City"
                      placeholder="New York"
                    />
                  </Box>

                  <Box
                    sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
                  >
                    <FormTextField
                      name="country"
                      label="Country"
                      placeholder="United States"
                    />
                  </Box>

                  <Box
                    sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}
                  >
                    <FormTextField
                      name="postalCode"
                      label="Postal Code"
                      placeholder="10001"
                    />
                  </Box>

                  {mode === "create" && (
                    <Box
                      sx={{
                        flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" },
                      }}
                    >
                      <FormTextField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        required
                        showPasswordToggle
                      />
                    </Box>
                  )}

                  {mode === "create" && (
                    <Box
                      sx={{
                        flex: { xs: "1 1 50%", sm: "1 1 calc(50% - 8px)" },
                      }}
                    >
                      <FormSelectField
                        name="roles"
                        label="Roles"
                        options={ROLE_OPTIONS}
                        multiple
                      />
                    </Box>
                  )}

                  {mode === "edit" && (
                    <Box
                      sx={{
                        flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" },
                      }}
                    >
                      <FormTextField
                        name="password"
                        label="New Password (optional)"
                        type="password"
                        placeholder="Leave blank to keep current"
                        showPasswordToggle
                      />
                    </Box>
                  )}

                  {mode === "edit" && (
                    <Box
                      sx={{
                        display: "flex",

                        width: "100%",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                        }}
                      >
                        <FormSelectField
                          name="roles"
                          label="Roles"
                          options={ROLE_OPTIONS}
                          multiple
                        />
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                      >
                        <FormCheckbox name="isActive" label="Active" />
                        <FormCheckbox name="isLocked" label="Locked" />
                      </Box>
                    </Box>
                  )}
                </Box>

                <DialogActions sx={{ px: 0, pt: 3 }}>
                  <AppButton onClick={onClose} variant="outlined" size="large">
                    Cancel
                  </AppButton>
                  <AppButton
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </AppButton>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
      </DialogContent>

      {mode === "view" && (
        <DialogActions
          sx={{
            px: 2,
            py: 2,
          }}
        >
          <AppButton onClick={onClose}>Close</AppButton>
        </DialogActions>
      )}
    </Dialog>
  );
};
