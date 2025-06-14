import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CourseCard from "./CourseCard";

type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  duration: number;
  lectures: number;
  creatorId: string;
  creator: string;
  creatorProfileUrl: string;
  requirements: string[];
  whatLearn: string[];
  tags: string[];
  language: string;
};

const CourseList = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [list, setList] = useState<Course[]>([]);

  const fetchList = async () => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${backendUrl}/course/${userData.id}`);
      console.log(response);
      setList(response.data);
    } catch (error) {
      toast.error("Error while reading the courses.");
    }
  };

  const deleteCourse = async (courseId: any) => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.delete(`${backendUrl}/course/${courseId}`);
      return response.status === 204;
    } catch (error) {
      console.error("Error while deleting the course.", error);
      throw error;
    }
  };

  const removeCourse = async (courseId: any) => {
    try {
      const success = await deleteCourse(courseId);
      if (success) {
        toast.success("Course removed.");
        await fetchList();
      } else {
        toast.error("Error occurred while removing the course.");
      }
    } catch (error) {
      toast.error("Error occurred while removing the course.");
    }
  };

  const updateCourse = (id: string | number, updatedData: any, imageFile: File | null) => {
    const courseEndpoint = `${backendUrl}/course`;
    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(updatedData)], { type: "application/json" })
    );
    if (imageFile) {
      formData.append("file", imageFile);
    }

    axios
      .put(`${courseEndpoint}/${id}`, formData, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Course updated successfully");
        console.log("Course updated successfully");
        fetchList();
      })
      .catch((err) => {
        if (typeof err === "object" && err !== null && "response" in err && "message" in err) {
          console.error("Update error:", err.response?.data || err.message);
        } else {
          console.error("Update error:", err);
        }
      });
  };

  useEffect(() => {
    if (userData?.id) {
      fetchList()
    }
  }, [userData]);

  const premiumCourses = list.filter((item) => item.category === "premium");
  const freeCourses = list.filter((item) => item.category === "free");

  return (
    <>
      <PageMeta
        title="Eduport Admin – View Courses"
        description="This is React/TypeScript page for Eduport Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="View Courses" />
      <div
        className="mx-auto mt-6 max-w-screen-2xl px-4 sm:px-6 lg:px-8"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px",
        }}
      >
       
          <>
            <ComponentCard title="Premium Courses" className="w-full">
              {premiumCourses.length > 0 ? (
                premiumCourses.map((item, index) => (
                  <CourseCard
                    item={item}
                    key={index}
                    removecourse={removeCourse}
                    updateCourse={updateCourse}
                  />
                ))
              ) : (
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">No premium courses added...</p>
              )}
            </ComponentCard>

            <ComponentCard title="Free Courses" className="w-full">
              {freeCourses.length > 0 ? (
                freeCourses.map((item, index) => (
                  <CourseCard
                    item={item}
                    key={index}
                    removecourse={removeCourse}
                    updateCourse={updateCourse}
                  />
                ))
              ) : (
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">No free courses added...</p>
              )}
            </ComponentCard>
          </>
        
      </div>
    </>
  );
};

export default CourseList;