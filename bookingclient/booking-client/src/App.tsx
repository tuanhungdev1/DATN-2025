import { useMemo } from "react";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "@/routes/AppRoutes";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "leaflet/dist/leaflet.css";
import { persistor, store } from "./store";

import { useAppSelector } from "./store/hooks";
import { createAppTheme } from "./theme";
import { ToastProvider } from "./components/common/ToastProvider";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { PageLoading } from "./components/loading";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ScrollToTop } from "./components/common";

function AppContent() {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ScrollToTop />
        <CssBaseline />
        <GoogleOAuthProvider
          clientId={
            import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"
          }
        >
          <AppRoutes />
        </GoogleOAuthProvider>

        <ToastProvider />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<PageLoading />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
