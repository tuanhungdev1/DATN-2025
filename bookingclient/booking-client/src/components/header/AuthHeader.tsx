/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Container,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import type { TransitionProps } from "@mui/material/transitions";
import { IoCheckmark } from "react-icons/io5";
import { languages } from "@/constants/countryFlags";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
      timeout={{ appear: 300, enter: 300, exit: 200 }}
      easing={{
        enter: "cubic-bezier(0.22, 1, 0.36, 1)",
        exit: "cubic-bezier(0.55, 0.06, 0.68, 0.19)",
      }}
    />
  );
});

const AuthHeader = () => {
  const { t, i18n } = useTranslation();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const currentLanguageCode = i18n.language.split("-")[0];
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find((lang) => lang.code === currentLanguageCode) || languages[0]
  );

  const handleToggleMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const handleOpenLanguageDialog = () => {
    setIsLanguageDialogOpen(true);
  };

  const handleCloseLanguageDialog = () => {
    setIsLanguageDialogOpen(false);
  };

  const handleSelectLanguage = (language: (typeof languages)[0]) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language.code);
  };

  const languageList = [
    selectedLanguage,
    ...languages
      .filter((lang) => lang !== selectedLanguage)
      .sort((a, b) => a.name.localeCompare(b.name)),
  ];

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  React.useEffect(() => {
    if (!isLargeScreen && isLanguageDialogOpen && !isOpenMenu) {
      setIsLanguageDialogOpen(false);
    }

    if (isLargeScreen && isOpenMenu) {
      setIsOpenMenu(false);
    }
  }, [isLargeScreen, isLanguageDialogOpen, isOpenMenu]);

  React.useEffect(() => {
    const langCode = i18n.language.split("-")[0];
    const foundLang = languages.find((lang) => lang.code === langCode);
    if (foundLang) {
      setSelectedLanguage(foundLang);
    }
  }, [i18n.language]);

  return (
    <>
      <Box height={65} bgcolor={"primary.main"} color="white">
        <Container>
          <Stack
            lineHeight={65}
            height={65}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Logo Website */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography variant="h5" fontWeight={600} color="inherit">
                NextStay.com
              </Typography>
            </Link>

            {/* Desktop Menu */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: "none", lg: "flex" } }}
            >
              {/* Icon cờ quốc gia */}
              <Tooltip title={t("header.selectLanguage")} arrow>
                <Box
                  onClick={handleOpenLanguageDialog}
                  p={"12px 14px"}
                  borderRadius={"4px"}
                  sx={{
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.3s",
                    ":hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <Box
                    component={selectedLanguage.FlagComponent}
                    sx={{
                      width: 20,
                      height: 20,
                      overflow: "hidden",
                    }}
                  />
                </Box>
              </Tooltip>

              {/* Helper Icon */}
              <Tooltip title={t("header.help")} arrow>
                <Box
                  p={"12px"}
                  borderRadius={"4px"}
                  sx={{
                    color: "white",
                    transition: "background-color 0.3s",
                    ":hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <IoIosHelpCircleOutline size={24} />
                </Box>
              </Tooltip>
            </Stack>

            {/* Mobile Menu - Hamburger */}
            <Tooltip title={t("header.menu")} arrow>
              <Box
                onClick={handleToggleMenu}
                p={"12px"}
                borderRadius={"4px"}
                sx={{
                  color: "white",
                  display: { lg: "none", md: "block" },
                  transition: "background-color 0.3s",
                  ":hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <FiMenu size={20} />
              </Box>
            </Tooltip>
          </Stack>
        </Container>
      </Box>

      {/* Dialog Chọn Ngôn Ngữ */}
      <Dialog
        open={isLanguageDialogOpen}
        onClose={handleCloseLanguageDialog}
        slots={{
          transition: Transition,
        }}
        maxWidth="lg"
        fullScreen={isOpenMenu}
        sx={{
          zIndex: 1500,
          transition: "opacity 0.1s",
          userSelect: "none",
          opacity: isLanguageDialogOpen ? 1 : 0,
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            {t("header.selectLanguage")}
          </Typography>
        </DialogTitle>
        {/* Close Icon */}
        <Box
          p={"12px"}
          borderRadius={"4px"}
          onClick={handleCloseLanguageDialog}
          sx={{
            cursor: "pointer",
            position: "absolute",
            right: 14,
            top: 14,
            transition: "background-color 0.3s",
            ":hover": { bgcolor: "rgba(212, 210, 210, 0.2)" },
          }}
        >
          <IoClose size={22} />
        </Box>
        <DialogContent sx={{ p: 2 }}>
          <List
            sx={{
              display: "grid",
              gridTemplateColumns: isOpenMenu
                ? "repeat(1, 1fr)"
                : "repeat(4, 1fr)",
              gap: 1.5,
            }}
          >
            {languageList.map((language) => (
              <ListItem key={language.code} disablePadding>
                <ListItemButton
                  disableRipple
                  onClick={() => handleSelectLanguage(language)}
                  selected={selectedLanguage.code === language.code}
                  sx={{
                    py: 1,
                    px: 1.5,
                    borderRadius: "4px",
                    bgcolor: "",
                    "&.Mui-selected": {
                      bgcolor: "background.hover",
                      "&:hover": {
                        bgcolor: "background.hover",
                      },
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "transparent",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Box
                        component={language.FlagComponent}
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={language.name}
                    primaryTypographyProps={{
                      fontWeight:
                        language.name === selectedLanguage.name ? 500 : 400,
                      fontSize: "14px",
                      color:
                        language.name === selectedLanguage.name
                          ? "text.hover"
                          : "text.primary",
                    }}
                  />

                  <Box
                    sx={{
                      paddingLeft: "14px",
                      color:
                        language.name === selectedLanguage.name
                          ? "text.hover"
                          : "text.primary",
                    }}
                  >
                    <IoCheckmark size={20} />
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Dialog Mobile */}
      <Dialog
        open={isOpenMenu}
        onClose={handleToggleMenu}
        fullScreen
        slots={{
          transition: Transition,
        }}
        sx={{
          zIndex: 1400,
          transition: "opacity 0.1s",
          userSelect: "none",
          opacity: isOpenMenu ? 1 : 0,
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Typography variant="h4" fontWeight={600} pl={"14px"}>
            {t("header.menu")}
          </Typography>

          {/* Close Icon */}
          <Box
            p={"12px"}
            borderRadius={"4px"}
            onClick={handleToggleMenu}
            sx={{
              cursor: "pointer",
              position: "absolute",
              right: 14,
              top: 14,
              transition: "background-color 0.3s",
              ":hover": { backgroundColor: "rgba(212, 210, 210, 0.2)" },
            }}
          >
            <IoClose size={22} />
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            mt: "38px",
          }}
        >
          <Box
            onClick={handleOpenLanguageDialog}
            borderRadius={"4px"}
            sx={{
              p: "14px 14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1.5,
              transition: "background-color 0.3s",
              ":hover": { backgroundColor: "rgba(212, 210, 210, 0.2)" },
            }}
          >
            <Box
              component={selectedLanguage.FlagComponent}
              sx={{
                width: 28,
                height: 28,
                overflow: "hidden",
              }}
            />

            <Typography>
              {selectedLanguage.name} ({selectedLanguage.code.toUpperCase()})
            </Typography>
          </Box>

          <Box
            p={"12px"}
            borderRadius={"4px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-start"}
            gap={1.5}
            sx={{
              mt: 1,
              cursor: "pointer",
              transition: "background-color 0.3s",
              ":hover": { backgroundColor: "rgba(212, 210, 210, 0.2)" },
            }}
          >
            <IoIosHelpCircleOutline size={30} />

            <Typography variant="body1">
              {t("header.helpAndSupport")}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthHeader;
