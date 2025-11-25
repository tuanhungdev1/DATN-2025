import { type PaletteMode } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: {
      white: string;
      gray100: string;
      gray200: string;
      gray300: string;
      gray400: string;
      gray500: string;
    };
    state: {
      errorLight: string;
      errorDark: string;
      alert: string;
      accent: string;
      successLight: string;
      successDark: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      white?: string;
      gray100?: string;
      gray200?: string;
      gray300?: string;
      gray400?: string;
      gray500?: string;
    };
    state?: {
      errorLight?: string;
      errorDark?: string;
      alert?: string;
      accent?: string;
      successLight?: string;
      successDark?: string;
    };
  }
}

export const getPalette = (mode: PaletteMode) => ({
  mode,
  ...(mode === "light"
    ? {
        // ========== LIGHT MODE ==========
        primary: {
          main: "#003b95",
          light: "#006ce4",
          dark: "#07689F",
          contrastText: "#FFFFFF",
          hover: "#0057b8",
        },
        secondary: {
          main: "#006ce4", // Primary-600
          light: "#2F83B2",
          dark: "#022535",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#F9F9F9", // Gray 100
          paper: "#FFFFFF",
          hover: "rgba(0, 108, 228, 0.06)",
          active: "rgba(0, 108, 228, 0.06)",
          hover_button: "#0057b8",
        },
        text: {
          primary: "#0C0C0C", // Black/Text
          secondary: "#565656", // Gray 500
          disabled: "#A6A6A6", // Gray 400
          hover: "#006ce4",
          active: "#006ce4",
        },
        error: {
          main: "#EA0205", // Error-Light
          dark: "#A80102", // Error-dark
          light: "#FF4D4F",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#FF6C01", // Accent
          light: "#FF8C38",
          dark: "#CC5601",
          contrastText: "#FFFFFF",
        },
        success: {
          main: "#00c951", // Success-dark
          light: "#00c951", // Success-Light
          dark: "#3A7A2B",
          contrastText: "#FFFFFF",
        },
        divider: "#D9D9D9", // Gray 300
        // Custom palettes
        neutral: {
          white: "#FFFFFF",
          gray100: "#F9F9F9",
          gray200: "#EFEFEF",
          gray300: "#D9D9D9",
          gray400: "#A6A6A6",
          gray500: "#565656",
        },
        state: {
          errorLight: "#EA0205",
          errorDark: "#A80102",
          alert: "#FDFF83",
          accent: "#FF6C01",
          successLight: "#E8F5E4",
          successDark: "#4C9839",
        },
        hover: {
          light: "#0057b8",
        },
      }
    : {
        // ========== DARK MODE ==========
        primary: {
          main: "#5CA3C9", // Sáng hơn Primary để dễ nhìn trên nền tối
          light: "#8BC1DB",
          dark: "#2F83B2", // Giữ Primary gốc
          contrastText: "#0C0C0C",
        },
        secondary: {
          main: "#07689F", // Primary-500 sáng hơn
          light: "#2F83B2",
          dark: "#043E5F",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#0F1419", // Nền tối chính
          paper: "#1A1F26", // Paper tối hơn một chút
        },
        text: {
          primary: "#E8E8E8", // Text sáng chính
          secondary: "#A6A6A6", // Gray 400 cho secondary text
          disabled: "#565656", // Gray 500 cho disabled
        },
        error: {
          main: "#FF5252", // Error sáng hơn cho dark mode
          dark: "#EA0205", // Error-Light gốc
          light: "#FF8A80",
          contrastText: "#FFFFFF",
        },
        warning: {
          main: "#FF8C38", // Accent sáng hơn
          light: "#FFB366",
          dark: "#FF6C01", // Accent gốc
          contrastText: "#0C0C0C",
        },
        success: {
          main: "#66BB54", // Success sáng hơn
          light: "#8FD180",
          dark: "#4C9839", // Success-dark gốc
          contrastText: "#0C0C0C",
        },
        divider: "#2D3339", // Divider tối
        // Custom palettes for dark mode
        neutral: {
          white: "#FFFFFF",
          gray100: "#2D3339", // Đảo ngược: tối nhất
          gray200: "#373E47",
          gray300: "#4A5159",
          gray400: "#6B7280", // Trung bình
          gray500: "#9CA3AF", // Sáng nhất
        },
        state: {
          errorLight: "#FF5252",
          errorDark: "#EA0205",
          alert: "#FFF59D", // Alert sáng hơn, dễ đọc
          accent: "#FF8C38",
          successLight: "#2D4029", // Success background tối
          successDark: "#66BB54",
        },
      }),
});
