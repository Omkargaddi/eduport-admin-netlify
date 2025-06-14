import { useCallback, useContext, useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DownloadIcon } from "../../icons";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function CategoryAdd() {


  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   const { userData, backendUrl } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    title: "",
    description: "",
    creator: userData?.username || "Creator's name...",
    creatorProfileUrl: userData?.profileImageUrl || "",
  });

  const onSubmitHandler = async (event: { preventDefault: () => void; }) => {
     event.preventDefault();
     setIsLoading(true);
 
     if (!image) {
       toast.error("Please select an image.");
       return;
     }
     if (data.title === "") {
       toast.error("Please enter an title.");
       return;
     }
     if (data.description === "") {
       toast.error("Please enter an description.");
       return;
     }
     try {
       const formData = new FormData();
       const categoryBlob = new Blob([JSON.stringify(data)], {
         type: "application/json",
       });
 
       formData.append("request", categoryBlob);
       formData.append("file", image);
 
       const response = await axios.post(`${backendUrl}/categories`, formData, {
         headers: {
           "Content-Type": "multipart/form-data",
           "X-Creator-Id": userData.id,
         },
       });
       if (response.status === 200) {
         toast.success("Category added successfully.");
       }
 
       // Clear everything
       setPreviewUrl(null);
       setData({
         title: "",
         description: "",
         creator: userData?.username || "Creator's name...",
         creatorProfileUrl: userData?.profileImageUrl || "",
       });
       setImage(null);
     } catch (error) {
       console.error("Error", error);
       toast.error("Error adding Category.");
     } finally{
      setIsLoading(false);
     }
   };

  // Drop handler:
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        setImage(null);
        setPreviewUrl(null);
        return;
      }

      const file = acceptedFiles[0];
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    [previewUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    multiple: false,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  return (
    <div>
      <PageMeta
        title="Eduport Admin – Add Category"
        description="This is React/TypeScript page for Eduport Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Add Category" />
      <div
        className="mx-auto mt-6 max-w-screen-2xl px-4 sm:px-6 lg:px-8"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ComponentCard
          title="Add Category"
          desc="Create a New Blog Category."
          className="w-full max-w-2xl"
        >
          {/* === Form Sections === */}
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div>
            {/* === Step 1: Upload image, title, description === */}
            <div className="space-y-6">
              {/* === Upload Image === */}
              <div>
                <Label htmlFor="image-upload">Upload Image</Label>

                <div
                  {...getRootProps()}
                  className={`dropzone mt-2 cursor-pointer rounded-xl border border-dashed p-7 lg:p-10 transition ${
                    isDragActive
                      ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                      : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                  id="image-upload"
                >
                  <input {...getInputProps()} />
                  <div className="dz-message flex flex-col items-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <DownloadIcon className="h-8 w-8" />
                      </div>
                    </div>
                    <h4 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                      {isDragActive
                        ? "Drop Files Here"
                        : "Drag & Drop Files Here"}
                    </h4>
                    <span className="text-center mb-4 block text-sm text-gray-700 dark:text-gray-400">
                      Drag and drop your PNG, JPG, WebP, SVG images here or
                      browse
                    </span>
                    <span className="font-medium underline text-theme-sm text-brand-500">
                      Browse File
                    </span>
                  </div>
                </div>

                {previewUrl && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 w-auto rounded border border-gray-300 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title-input">Title</Label>
                <Input
                  type="text"
                  id="title-input"
                  placeholder="Category title"
                  name="title"
                  onChange={handleInputChange}
                  value={data.title}
                  required
                />
              </div>
              {/* Description */}
              <div>
                <Label htmlFor="description-textarea">Description</Label>
                <TextArea
                  rows={6}
                  placeholder="Write description here…"
                  required
                  onChange={(value) =>
                    setData((data) => ({ ...data, description: value }))
                  }
                  value={data.description}
                />
              </div>
              <div>
                <Label>Creator</Label>
                <Input
                  type="text"
                  id="creator-input"
                  placeholder="Creator's name..."
                  value={userData?.username || "Creator's name..."}
                  disabled={true}
                />
              </div>
            </div>
          </div>
              
             <div className="flex items-center justify-center">
              <Button type="submit" size="sm" variant="primary" disabled={isLoading}>
                  {isLoading && (
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 me-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  {isLoading ? "Processing..." : "Save"}
                </Button>
            
             </div>
            
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}
