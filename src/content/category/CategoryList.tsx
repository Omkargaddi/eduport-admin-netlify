import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import CategoryCard from "./CategoryCard";

type Category = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  creatorId: string;
  creator: string;
  creatorProfileUrl: string;
  createdAt: string; // Added to match CategoryItem
};

const CategoryList = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [list, setList] = useState<Category[]>([]);
  

  const fetchList = async () => {
    axios.defaults.withCredentials = true;
    try { 
      const response = await axios.get(`${backendUrl}/categories`, {
        headers: { "X-Creator-Id": userData.id },
      });
      setList(response.data);
    } catch (error) {
      toast.error("Error while reading the categories.");
    }
  };
 
  const removeCategory = async (categoryId: any) => {
    axios.defaults.withCredentials = true;
    try {
      const res = await axios.delete(`${backendUrl}/categories/${categoryId}`, {
        headers: { "X-Creator-Id": userData.id },
      });
      if (res.status === 204) {
        toast.success("Category removed.");
        fetchList();
      } else {
        toast.error("Error occurred while removing the category.");
      }
    } catch (err) {
      toast.error("Error occurred while removing the category.");
      console.error(err);
    }
  };

const updateCategory = async (id: string | number, updatedData: any, imageFile: File | null) => {
  const courseEndpoint = `${backendUrl}/categories`;
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(updatedData)], { type: "application/json" })
  );
  if (imageFile) {
    formData.append("file", imageFile);
  }
  try {
    await axios.put(
      `${courseEndpoint}/${id}`,
      formData,
      {
        headers: {
          "X-Creator-Id": userData.id,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    
    toast.success("Category updated successfully");
    console.log("Category updated successfully");
    fetchList();
  } catch (err: any) {
    if (typeof err === "object" && err !== null && "response" in err && "message" in err) {
      // @ts-ignore
      console.error("Update error:", err.response?.data || err.message);
    } else {
      console.error("Update error:", err);
    }
  }
};

useEffect(() => {
  if (userData?.id) {
    fetchList();
  }
}, [userData]);


  return (
    <>
      <PageMeta
        title="Eduport Admin – View Categories"
        description="This is React/TypeScript page for Eduport Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="View categories" />
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
       <ComponentCard title="Categories" className="w-full">
         {/* popular ribbon card at end */}
  <div className="mt-6">
     <div className="relative border border-gray-200 rounded-xl bg-white p-6 max-w-md mx-auto">
      {/* Ribbon */}
      <div
        className="absolute top-4 left-0 bg-yellow-500 text-white font-semibold inline-flex items-center px-4 py-1 -translate-y-1/2 translate-x-0 gap-2"
        style={{
          clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert-icon lucide-triangle-alert"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <span className="mr-1">Note</span>
        
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed pt-3">
        A category can only be deleted by the creator who originally created it. Additionally, it must be empty—containing no sections or content—before it can be removed, ensuring that no dependent data is lost.
      </p>
    </div>
  </div>
  {list.length > 0 ? (
    list.map((item, index) => (
      <CategoryCard
        item={item}
        key={index}
        removeCategory={removeCategory}
        updateCategory={updateCategory}
      />
    ))
  ) : (
    <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
      No categories added...
    </p>
  )}

 
</ComponentCard>

      </div>
    </>
  );
};

export default CategoryList;
