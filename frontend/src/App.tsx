import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppRoutes } from "@routes/index";
import { MainView } from "@components/index";
import { Login } from "@pages/index";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Router>
        <Routes>
          {/* Login Route (No MainView) */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes (Inside MainView) */}
          <Route
            path="/*"
            element={
              <MainView>
                <AppRoutes />
              </MainView>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
