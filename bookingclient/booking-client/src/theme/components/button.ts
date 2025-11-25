import { type Components, type Theme } from "@mui/material/styles";

export const buttonOverrides: Components<Theme>["MuiButton"] = {
  styleOverrides: {
    root: {
      borderRadius: 8,
      textTransform: "none",
      fontWeight: 600,
      padding: "10px 24px",
    },
    contained: {
      boxShadow: "none",
      "&:hover": {
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.12)",
      },
    },
    outlined: ({ theme }) => ({
      borderWidth: 1.5,
      "&:hover": {
        borderWidth: 1.5,
        backgroundColor:
          theme.palette.mode === "light"
            ? "rgba(47, 131, 178, 0.04)"
            : "rgba(92, 163, 201, 0.08)",
      },
    }),
  },
};
