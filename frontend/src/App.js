import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@mui/material";
import { theme } from "./themes/theme";
import { CssBaseline } from "@mui/material";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import Inbox from "./pages/inbox";
import Header from "./components/Header";

function App() {
  return (
    // <div className="App">
    <>
  <ThemeProvider theme={theme}>
    <CssBaseline />
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route exact path="/" element={<PrivateRoute />}>
              <Route exact path="/" element={<HomePage />} />
            </Route>

            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="profile" element={<ProfilePage />}/>
            <Route path="inbox" element={<Inbox />}/>
          </Routes>
        </AuthProvider>
      </Router>
      </ThemeProvider>
      </>
    // </div>
  );
}

export default App;
