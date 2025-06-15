import { useCallback, useContext, useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DownloadIcon } from "../../icons";
import { Editor } from "@tinymce/tinymce-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function BlogAdd() {
  // step goes from 1 to 4
  const [step, setStep] = useState<number>(1);

  // Compute the filled‐bar width as a percentage:
  // (step – 1) / (4 – 1) × 100
  const progressPercent = ((step - 1) / 2) * 100;

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [inputTags, setInputTags] = useState("");
   const [isLoading, setIsLoading] = useState(false);

  const { userData, backendUrl } = useContext(AppContext);

  const [data, setData] = useState({
    title: "",
    description: "",
    content: "",
    readtime: "",
    tags: tags,
    creator: userData?.username || "Creator's name...",
    creatorId: userData?.id || "Creator's id...",
    creatorProfileUrl: userData?.profileImageUrl || "",
  });

  // Update data when userData changes
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      creator: userData?.username || "Creator's name...",
      creatorId: userData?.id || "Creator's id...",
      creatorProfileUrl: userData?.profileImageUrl || "",
    }));
  }, [userData]);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const onSubmitHandler = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsLoading(true);

    if (!image) {
      toast.error("Please select an image.");
      return;
    }
    if (data.title === "") {
      toast.error("Please enter an title.");
      setStep(1);
      return;
    }
    if (data.description === "") {
      toast.error("Please enter an description.");
      setStep(1);
      return;
    }

    if (data.content === "") {
      toast.error("Please fill an content of blog.");
      setStep(2);
      return;
    }
    if (data.readtime === "") {
      toast.error("Please enter an approx readtime");
      return;
    }
    if (tags.length < 2) {
      toast.error("Please enter atleast 2 tags relaated to blog.");
      return;
    }

    // Ensure latest values are included
    const fullData = {
      ...data,
      tags: tags,
    };
console.log(fullData);
console.log(userData);
    try {
      const formData = new FormData();
      formData.append("blog", JSON.stringify(fullData));
      formData.append("file", image);
      await axios.post(`${backendUrl}/blog`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Blog added successfully.");

      // Clear everything
      setStep(1);
      setTags([]);
      setPreviewUrl(null);
      setData({
        title: "",
        description: "",
        content: "",
        readtime: "",
        tags: tags,
        creator: userData?.username || "Creator's name...",
        creatorId: userData?.id || "Creator's id...",
        creatorProfileUrl: userData?.profileImageUrl || "",
      });
      setImage(null);
    } catch (error) {
      console.error("Error", error);
      toast.error("Error adding blog.");
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

  const renderSection = () => {
    switch (step) {
      case 1:
        return (
          <>
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
                  placeholder="Blog title"
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
            </div>
          </>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="form-label">Content</Label>

             <Editor
  apiKey="3oyp9f595polavb3h023w1v7rg0n39ddxri8apm96yr8dh1r"
  value={data.content}
  onEditorChange={(newContent) =>
    setData((prev) => ({ ...prev, content: newContent }))
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
          </div>
        );

      case 3:
        return (
          <>
            <div className="space-y-6">
              {/* reading  time */}
              <div>
                <Label htmlFor="lectures-input">Reading time (in mins)</Label>
                <Input
                  type="number"
                  id="readtime-input"
                  placeholder="10 mins"
                  name="readtime"
                  onChange={handleInputChange}
                  value={data.readtime}
                  required
                />
              </div>

              {/* Requirements Section */}
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge
                      variant="light"
                      key={tag}
                      color="primary"
                      endIcon={
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => setTags(tags.filter((l) => l !== tag))}
                        >
                          ✕
                        </button>
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <TextArea
                  rows={3}
                  placeholder="Type tags and press Enter…"
                  value={inputTags}
                  // onChange={(e) => setReqInput(e.target.value)}
                  onChange={(value) => setInputTags(value)}
                  onKeyDown={(e: {
                    key: string;
                    preventDefault: () => void;
                  }) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const trimmed = inputTags.trim();
                      if (trimmed && !tags.includes(trimmed)) {
                        setTags([...tags, trimmed]);
                      }
                      setInputTags("");
                    }
                  }}
                />
              </div>

              {/* creator */}
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
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <PageMeta
        title="Eduport Admin – Add Blog"
        description="This is React/TypeScript page for Eduport Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Add Blog" />
      <div
        className="mx-auto mt-6 max-w-screen-2xl px-4 sm:px-6 lg:px-8"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ComponentCard
          title="Add Blog"
          desc="Got Something to Say? Start Blogging!"
          className="w-full max-w-2xl"
        >
          {/* === Progress Bar Container === */}
          <div className="mb-8 w-full">
            {/* Wrapper for the gray background bar */}
            <div
              className="relative h-1 w-full bg-gray-200"
              style={{ borderRadius: "70%" }}
            >
              {/* Filled portion */}
              <div
                className="absolute left-0 top-0 h-1 bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            {/* Four circles, evenly spaced */}
            <div className="relative -mt-3 flex justify-between">
              {[1, 2, 3].map((s) => {
                const isActive = step >= s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStep(s)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      isActive
                        ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* === Form Sections === */}
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {renderSection()}

            {/* === Prev / Next / Save Buttons === */}
            {/* …inside your <form>… */}
            <div className="mt-6 flex justify-between">
              {/* Prev: now works because type="button" is forwarded */}
              <Button
                type="button"
                size="sm"
                variant="primary"
                disabled={step === 1}
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </Button>
              {step < 3 ? (
                /* Next: also type="button" */
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => setStep((prev) => Math.min(4, prev + 1))}
                >
                  Next
                </Button>
              ) : (
                /* Save: explicitly type="submit" so it actually submits the form */
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
              )}
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}
