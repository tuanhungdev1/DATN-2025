import { createTheme, type ThemeOptions } from "@mui/material/styles";
import { getPalette } from "./palette";
import { typography } from "./typography";
import { buttonOverrides } from "./components/button";

export const createAppTheme = (mode: "light" | "dark") => {
  const palette = getPalette(mode);

  const themeOptions: ThemeOptions = {
    palette,
    typography,
    components: {
      MuiButton: buttonOverrides,
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            scrollBehavior: "smooth",
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: "none", // Tắt gradient mặc định của MUI dark mode
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow:
              mode === "light"
                ? "0px 2px 8px rgba(0, 0, 0, 0.08)"
                : "0px 2px 8px rgba(0, 0, 0, 0.6)",
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
    shape: {
      borderRadius: 8, // Default 8px
    },
  };

  return createTheme(themeOptions);
};

// Export các border radius để sử dụng
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
};
