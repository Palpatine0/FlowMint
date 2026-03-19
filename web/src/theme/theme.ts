import { createTheme } from "@mui/material/styles";
import { brandTokens } from "./tokens";

const theme = createTheme({
  palette: {
    primary: {
      main: brandTokens.colors.primary,
      dark: brandTokens.colors.primaryDark,
      light: brandTokens.colors.primaryLight,
    },
    secondary: {
      main: brandTokens.colors.secondary,
      dark: brandTokens.colors.secondaryDark,
      light: brandTokens.colors.secondaryLight,
    },
    background: {
      default: brandTokens.colors.background,
      paper: brandTokens.colors.surface,
    },
    text: {
      primary: brandTokens.colors.textPrimary,
      secondary: brandTokens.colors.textSecondary,
    },
  },
  typography: {
    fontFamily: brandTokens.typography.fontFamily,
    h1: { fontSize: brandTokens.typography.h1Size, fontWeight: 700 },
    body1: { fontSize: brandTokens.typography.bodySize },
  },
  shape: {
    borderRadius: brandTokens.shape.borderRadius,
  },
});

export default theme;
