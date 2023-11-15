import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Header from "./components/Header";
import ProfilePrivateRoute from "./components/ProfilePrivateRoute";
import AuthPrivateRoute from "./components/AuthPrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route element={<ProfilePrivateRoute />} >
          <Route path="/profile" element={<Profile />}></Route>
        </Route>
        <Route element={<AuthPrivateRoute/>} >
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
        </Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
