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
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import Header from "./components/Header";
import TrueFriends from "./pages/TrueFriends";

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
              {/* inside private rout put all the pages that only an authenticated user can see */}
              <Route exact path="/" element={<PrivateRoute />}>
                <Route exact path="/" element={<HomePage />} />
                <Route path="followers" element={<Followers />} />
                <Route path="following" element={<Following />} />
                <Route path="trueFriends" element={<TrueFriends />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="inbox" element={<Inbox />} />
              </Route>

              <Route path="signup" element={<SignUpPage />} />
              <Route path="login" element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </>
    // </div>
  );
}

export default App;
