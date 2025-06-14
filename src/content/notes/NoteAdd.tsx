import { useCallback, useContext, useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DownloadIcon } from "../../icons";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function NoteAdd() {
  const [step, setStep] = useState<number>(1);
  const progressPercent = ((step - 1) / (2 - 1)) * 100;

  const [note, setNote] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);

  const options = [
    { value: "note", label: "Note" },
    { value: "cheetsheet", label: "Cheetsheet" },
    { value: "handbook", label: "Handbook" },
  ];

  const { userData, backendUrl } = useContext(AppContext);

  const [data, setData] = useState({
    title: "",
    category: "note",
    language: "",
    creator: userData?.username || "",
    creatorId: userData?.id || "",
    creatorProfileUrl: userData?.profileImageUrl || "",
  });

  useEffect(() => {
    if (userData?.username && userData?.id) {
      setData((prev) => ({
        ...prev,
        creator: userData.username,
        creatorId: userData.id,
      }));
    }
  }, [userData]);

  const handleImageDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, [previewUrl]);

  const handleNoteDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setNote(acceptedFiles[0]);
  }, []);

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    onDrop: handleImageDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    multiple: false,
  });

  const {
    getRootProps: getNoteRootProps,
    getInputProps: getNoteInputProps,
    isDragActive: isNoteDragActive,
  } = useDropzone({
    onDrop: handleNoteDrop,
    accept: {
      "application/pdf": [],
    },
    multiple: false,
  });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleCategoryChange = (value: string) => {
    setData((prev) => ({ ...prev, category: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!data.title.trim()) {
      toast.error("Please enter a title.");
      setStep(1);
      return;
    }

    if (!data.language.trim()) {
      toast.error("Please enter the language.");
      setStep(2);
      return;
    }

    if (!image || !note) {
      toast.error("Please upload both image and note file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("note", JSON.stringify(data));
      formData.append("imgFile", image);
      formData.append("pdfFile", note);

      await axios.post(`${backendUrl}/note`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Notes added successfully.");
      setStep(1);
      setData({
        title: "",
        category: "note",
        language: "",
        creator: userData?.username || "",
        creatorId: userData?.id || "",
        creatorProfileUrl: userData?.profileImageUrl || "",
      });
      setImage(null);
      setNote(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      toast.error("Error adding note.");
    } finally{
      setIsLoading(false);
    }
  };

  const renderSection = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="image-upload">Upload Image</Label>
              <div
                {...getImageRootProps()}
                className={`dropzone mt-2 cursor-pointer rounded-xl border border-dashed p-7 lg:p-10 transition ${
                  isImageDragActive
                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <input {...getImageInputProps()} />
               <div className="dz-message flex flex-col items-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <DownloadIcon className="h-8 w-8" />
                      </div>
                    </div>
                    <h4 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                      {isImageDragActive
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
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-4 max-h-64 rounded border object-contain"
                />
              )}
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={data.title}
                onChange={handleInputChange}
                placeholder="Notes title"
              />
            </div>

            <div>
              <Label htmlFor="category-select">Category</Label>
              <Select
                options={options}
               className="dark:bg-dark-900"
                onChange={handleCategoryChange}
                placeholder="Select Category"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                name="language"
                value={data.language}
                onChange={handleInputChange}
                placeholder="e.g. English"
              />
            </div>

            <div>
              <Label>Creator</Label>
              <Input
                value={userData?.username || "Creator's Name..."}
                disabled
              />
            </div>

            <div>
              <Label htmlFor="note-upload">Upload Notes</Label>
              <div
                {...getNoteRootProps()}
                className={`dropzone mt-2 cursor-pointer rounded-xl border border-dashed p-7 lg:p-10 transition ${
                  isNoteDragActive
                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <input {...getNoteInputProps()} />
                <div className="dz-message flex flex-col items-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <DownloadIcon className="h-8 w-8" />
                      </div>
                    </div>
                    <h4 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                      {isNoteDragActive
                        ? "Drop Files Here"
                        : "Drag & Drop Files Here"}
                    </h4>
                    <span className="text-center mb-4 block text-sm text-gray-700 dark:text-gray-400">
                      Drag and drop your PDF file or
                      browse
                    </span>
                    <span className="font-medium underline text-theme-sm text-brand-500">
                      Browse File
                    </span>
                  </div>
              </div>

              {note && (
                <div className="mt-2">
                  <embed
                    src={URL.createObjectURL(note)}
                    type="application/pdf"
                    width="100%"
                    height="400px"
                  />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <PageMeta
        title="Eduport Admin – Add Note"
        description="This is React/TypeScript page for Eduport Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Add Notes" />
      <div className="mx-auto mt-6 max-w-screen-2xl px-4 sm:px-6 lg:px-8 flex justify-center">
        <ComponentCard
          title="Add Notes"
          desc="Share Your Learning Notes with the Community"
          className="w-full max-w-2xl"
        >
          <div className="mb-8 w-full">
            <div className="relative h-1 w-full bg-gray-200 rounded-full">
              <div
                className="absolute left-0 top-0 h-1 bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="relative -mt-3 flex justify-between">
              {[1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    step >= s
                      ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                      : "border-gray-300 bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            {renderSection()}

            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                size="sm"
                variant="primary"
                disabled={step === 1}
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </Button>

              {step < 2 ? (
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={isLoading}
                >
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
