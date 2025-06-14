import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";

import { AppContext } from "./context/AppContext";
import { ScrollToTop } from "./components/common/ScrollToTop";

import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/OtherPage/NotFound";

// Auth Pages
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgetPassword from "./pages/AuthPages/ForgetPassword";
import VerifyEmail from "./pages/AuthPages/VerifyEmail";

// Content Pages
import CourseAdd from "./content/course/CourseAdd";
import NoteAdd from "./content/notes/NoteAdd";
import BlogAdd from "./content/blog/BlogAdd";
import CategoryAdd from "./content/category/CategoryAdd";
import CourseList from "./content/course/CourseList";
import NoteList from "./content/notes/NoteList";
import BlogList from "./content/blog/BlogList";
import CategoryList from "./content/category/CategoryList";
import SectionList from "./content/category/SectionList";
import PageList from "./content/category/PageList";
import CourseBuys from "./content/course/CourseBuys";

export default function App() {
  const { isLoggedIn } = useContext(AppContext);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: "10000" }}
      />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public route: Home with layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ForgetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Routes */}
          {isLoggedIn ? (
            <Route element={<AppLayout />}>
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />

              {/* Content */}
              <Route path="/course-add" element={<CourseAdd />} />
              <Route path="/notes-add" element={<NoteAdd />} />
              <Route path="/blog-add" element={<BlogAdd />} />
              <Route path="/category-add" element={<CategoryAdd />} />
              <Route path="/course-list" element={<CourseList />} />
              <Route path="/course-buys" element={<CourseBuys />} />
              <Route path="/notes-list" element={<NoteList />} />
              <Route path="/blog-list" element={<BlogList />} />
              <Route path="/category-list" element={<CategoryList />} />
              <Route path="/sectionlist/:categoryId" element={<SectionList />} />
              <Route
                path="/tutpagelist/:categoryId/:sectionId"
                element={<PageList />}
              />
            </Route>
          ) : (
            <>
              {/* Redirect protected routes to SignIn */}
              <Route path="/profile" element={<SignIn/>} />
              <Route path="/calendar" element={<SignIn/>} />
              <Route path="/course-add" element={<SignIn/>} />
              <Route path="/notes-add" element={<SignIn/>} />
              <Route path="/blog-add" element={<SignIn/>} />
              <Route path="/category-add" element={<SignIn/>} />
              <Route path="/course-list" element={<SignIn/>} />
               <Route path="/course-buys" element={<SignIn/>} />
              <Route path="/notes-list" element={<SignIn/>} />
              <Route path="/blog-list" element={<SignIn/>} />
              <Route path="/category-list" element={<SignIn/>} />
              <Route
                path="/sectionlist/:categoryId"
                element={<SignIn/>}
              />
              <Route
                path="/tutpagelist/:categoryId/:sectionId"
                element={<SignIn/>}
              />
            </>
          )}

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
