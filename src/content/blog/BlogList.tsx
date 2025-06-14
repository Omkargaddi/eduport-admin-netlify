import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import BlogCard from "./BlogCard";

type Blog = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  readtime: number;
  creatorId: string;
  creator: string;
  creatorProfileUrl: string;
  tags: string[];
  content: string;
};

const BlogList = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [list, setList] = useState<Blog[]>([]);

  const fetchList = async () => {
    axios.defaults.withCredentials = true;
    try { 
      const response = await axios.get(`${backendUrl}/blog/${userData.id}`, {
      });
      console.log(response);
      setList(response.data);
    } catch (error) {
      toast.error("Error while reading the blogs.");
    }
  };

  const deleteBlog = async (blogId: any) => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.delete(`${backendUrl}/blog/${blogId}`, {
      });
      return response.status === 204;
    } catch (error) {
      console.error("Error while deleting the blog.", error);
      throw error;
    }
  };

  const removeBlog = async (blogId: any) => {
    try {
      const success = await deleteBlog(blogId);
      if (success) {
        toast.success("Blog removed.");
        await fetchList();
      } else {
        toast.error("Error occurred while removing the blog.");
      }
    } catch (error) {
      toast.error("Error occurred while removing the blog.");
    }
  };
useEffect(() => {
  if (userData?.id) {
    fetchList();
  }
}, [userData]);


const updateBlog = (id: string | number, updatedData: any, imageFile: File | null) => {
  const courseEndpoint = `${backendUrl}/blog`;
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(updatedData)], { type: "application/json" })
  );
  if (imageFile) {
    formData.append("file", imageFile);
  }

  axios.put(`${courseEndpoint}/${id}`, formData, {
    withCredentials: true,
  })
    .then(() => {
      toast.success("Blog updated successfully")
      console.log("Blog updated successfully");
      fetchList();
    })
    .catch((err) => {
      if (typeof err === "object" && err !== null && "response" in err && "message" in err) {
        // @ts-ignore
        console.error("Update error:", err.response?.data || err.message);
      } else {
        console.error("Update error:", err);
      }
    });
};
  return (
    <>
      <PageMeta
        title="Eduport Admin – View Blogs"
        description="This is React/TypeScript page for Eduport Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="View Blogs" />
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
        <ComponentCard title="Blogs" className="w-full">
          {list.length > 0 ? (
            list.map((item, index) => (
              <BlogCard item={item} key={index} removeBlog={removeBlog} updateBlog={updateBlog}  />
            ))
          ) : (
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">No blogs added...</p>
          )}
        </ComponentCard>
      </div>
    </>
  );
};

export default BlogList;
