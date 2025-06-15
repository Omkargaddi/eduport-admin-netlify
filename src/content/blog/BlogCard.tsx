import { useEffect, useRef, useState } from "react";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { PencilIcon, TrashBinIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from 'dompurify';

type BlogItem = {
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

type CourseCardProps = {
  item: BlogItem;
  removeBlog: (id: string | number) => void;
  updateBlog: (
    id: string | number,
    updatedData: any,
    imageFile: File | null
  ) => void;
};
const BlogCard = ({ item, removeBlog, updateBlog }: CourseCardProps) => {
  const [editData, setEditData] = useState({
    title: item.title,
    description: item.description,
    readtime: item.readtime,
    creatorId: item.creatorId,
    creatorProfileUrl: item.creatorProfileUrl,
    creator: item.creator,
    tags: item.tags,
    content: item.content,
  });
  const [profileImage, setProfileImage] = useState(item?.imageUrl);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
     const [isLoading, setIsLoading] = useState(false);

     const handleDelete = async () => {
  setIsLoading(true);
  try {
    await removeBlog(item.id);
  } catch (error) {
    console.error("Delete failed:", error);
  } finally {
    setIsLoading(false);
  }
};

  const onChange = (field: string) => (e: { target: { value: any } }) => {
    const value = e.target.value;
    setEditData((prev) => ({ ...prev, [field]: value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target) {
        setProfileImage(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
 
  // modals
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const {
    isOpen: isPreviewOpen,
    openModal: openPreviewModal,
    closeModal: closePreviewModal,
  } = useModal();
   useEffect(() => {
      const observer = new MutationObserver(() => {
        setIsDarkMode(document.documentElement.classList.contains("dark"));
      });
  
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
  
      // Initial check
      setIsDarkMode(document.documentElement.classList.contains("dark"));
  
      return () => observer.disconnect();
    }, []);


      const sanitizedContent = DOMPurify.sanitize(item.content || '');

  
  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800 dark:text-white">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={item.imageUrl}
            alt="blog"
            className="rounded-lg object-cover"
            style={{ height: "9rem", width: "14rem" }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p
              className="text-sm mt-1 text-gray-600 dark:text-gray-300"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.description}
            </p>

            <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="mr-3">
                {`🕒 ${item.readtime} mins`}
              </span>
            </div>
          </div>
          <div className="flex flex-row lg:flex-col md:flex-col gap-2 ">
            <button
            className="bg-gray-500 text-white shadow-theme-xs hover:bg-gray-600 disabled:bg-gray-300 inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm"
              onClick={openEditModal}
            >
              <span className="flex items-center">
<PencilIcon className="size-5" />
              </span>
              Edit
            </button>
           <button
              className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm"
              onClick={openPreviewModal}
            >
              <span className="flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
              </span>
              View
            </button>
            <button
              className="bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300 inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm"
              onClick={handleDelete}
            >
              {isLoading ? (
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
                  ) : (
 <span className="flex items-center">
                <TrashBinIcon className="size-5" />
              </span>
                  )}
                  {isLoading ? "Processing..." : "Delete"}

              
            </button>
          </div>
        </div>
      </div>

      {/* Preview modal ###################### */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={closePreviewModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {item.title}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Preview details of your blog.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3 space-y-6">
             

              {/* i want to add preview of content that is stored in item.content here */}
              <div>
      <h5 className="text-lg font-medium text-gray-700 dark:text-white mb-2">
        Content
      </h5>
       {/* Render the TinyMCE HTML content */}
        <div
          className="blog-card-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
              {/* Tags */}
              <div>
                <h5 className="text-lg font-medium text-gray-700 dark:text-white">
                  Tags
                </h5>
                {item.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No tags
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closePreviewModal}>
                Close
              </Button>
            </div>
          </form>
        </div>
      </Modal>



      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Blog
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update the blog details below.
            </p>
          </div>

          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              updateBlog(item.id, editData, profileFile);
              closeEditModal();
            }}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3 flex flex-col gap-6">
              <div>
                <Label>Blog image</Label>
                <div className="flex flex-col items-center  space-y-2">
                  <div
                    className="profile-image-wrapper w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 mt-4 border-2 border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center cursor-pointer mb-3 rounded-xl"
                    onClick={triggerFileSelect}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="initial-circle w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-2xl font-semibold">
                        ?
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={triggerFileSelect}
                  >
                    {profileImage ? "Change image" : "Upload image"}
                  </Button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="file-input-hidden hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="col-span-2">
                <Label>Title</Label>
                <Input
                  type="text"
                  value={editData.title}
                  onChange={onChange("title")}
                />
              </div>

              <div className="col-span-2">
                <Label>Description</Label>
                <TextArea
                  rows={3}
                  placeholder="Write description here…"
                  required
                  value={editData.description}
                  onChange={(value: string) =>
                    setEditData((prev) => ({ ...prev, description: value }))
                  }
                />
              </div>
              
            
                  <div>
              <Label className="form-label">Content</Label>
<Editor
  apiKey="3oyp9f595polavb3h023w1v7rg0n39ddxri8apm96yr8dh1r"
  value={item.content}
                onEditorChange={(newContent) =>
                  setEditData((prev) => ({ ...prev, content: newContent })) 
                }
  init={{
    height: 500,
    menubar: true,
    skin: isDarkMode ? "oxide-dark" : "oxide",
    content_css: isDarkMode ? "dark" : "default",
    plugins: [
      "advlist autolink lists link image charmap preview anchor",
      "searchreplace visualblocks fullscreen insertdatetime media table",
      "help wordcount codesample code",
    ].join(" "),
    toolbar:
      "undo redo | formatselect | bold italic underline strikethrough | " +
      "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
      "removeformat | link image media | preview fullscreen | " +
      "codesample code | help",
    content_style: `
      @import url('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism${isDarkMode ? "-okaidia" : ""}.min.css');
      body {
        font-family: Inter, Helvetica, Arial, sans-serif;
        font-size: 16px;
        padding: 16px;
        background-color: ${isDarkMode ? "#1f2937" : "white"};
        color: ${isDarkMode ? "white" : "black"};
      }
    `,
    codesample_languages: [
      { text: "HTML/XML", value: "markup" },
      { text: "JavaScript", value: "javascript" },
      { text: "TypeScript", value: "typescript" },
      { text: "CSS", value: "css" },
      { text: "Python", value: "python" },
      { text: "Java", value: "java" },
      { text: "C", value: "c" },
      { text: "C++", value: "cpp" },
      { text: "Ruby", value: "ruby" },
      { text: "Go", value: "go" },
    ],
  }}
/>

            </div>
              
<div>
                <Label>Read time</Label>
                <Input
                  type="number"
                  value={editData.readtime}
                  onChange={onChange("readtime")}
                />
              </div>
             

              <div className="col-span-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  type="text"
                  value={editData.tags.join(", ")}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      tags: e.target.value.split(",").map((s) => s.trim()),
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeEditModal}>
                Close
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
            
          </form>
        </div>
        

      </Modal>
      
    </>
  );
};

export default BlogCard;
