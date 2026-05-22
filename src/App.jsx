import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Course from "./pages/Course"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import ResetPassword from "./pages/ResetPassword"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/course/:id" element={<Course />} />
    </Routes>
  )
}
