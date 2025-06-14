import { useCallback, useContext, useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import MultiSelect from "../../components/form/MultiSelect";
import Select from "../../components/form/Select";
import Badge from "../../components/ui/badge/Badge";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DownloadIcon } from "../../icons";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";


export default function CourseAdd() {
  // step goes from 1 to 4
  const [step, setStep] = useState<number>(1);

  // Compute the filled‐bar width as a percentage:
  // (step – 1) / (4 – 1) × 100
  const progressPercent = ((step - 1) / 3) * 100;
const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [reqInput, setReqInput] = useState<string>("");
  const [whatLearn, setWhatLearn] = useState<string[]>([]);
  const [learnInput, setLearnInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const multiOptions = [
    { value: "Hot", text: "Hot", selected: false },
    { value: "New", text: "New", selected: false },
    { value: "Popular", text: "Popular", selected: false },
    { value: "Live Now", text: "Live Now", selected: false },
    { value: "Beginner-Friendly", text: "Beginner-Friendly", selected: false },
  ];

  const options = [
    { value: "premium", label: "Premium" },
    { value: "free", label: "Free" },
  ];

  const { userData, backendUrl } = useContext(AppContext);

  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    lectures: "",
    duration: "",
    requirements: requirements,
    whatLearn: whatLearn,
    tags: tags,
    language: "",
    creator: userData?.username || "Creator's name...",
    creatorId: userData?.id || "Creator's id...",
    creatorProfileUrl: userData?.profileImageUrl || "",
  });

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
    if (data.price === "" && data.category === "premium") {
      toast.error("Please enter an price of course.");
      setStep(2);
      return;
    }
    if (data.lectures === "") {
      toast.error("Please enter an number of lectures.");
      setStep(2);
      return;
    }
    if (data.duration === "") {
      toast.error("Please enter an duration of course.");
      setStep(2);
      return;
    }
    if (requirements.length < 2) {
      toast.error("Please enter atleast 2 requriments of course.");
      setStep(3);
      return;
    }
    if (whatLearn.length < 2) {
      toast.error("Please enter atleast 2 learnings of course.");
      setStep(3);
      return;
    }
    // Ensure latest values are included
    const fullData = {
      ...data,
      requirements: requirements,
      whatLearn: whatLearn,
      tags: tags,
    };
    console.log(fullData);
    try {
      const formData = new FormData();
      formData.append("course", JSON.stringify(fullData));
      formData.append("file", image);

      await axios.post(`${backendUrl}/course`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Course added successfully.");

      // Clear everything
      setStep(1);
      setRequirements([]);
      setWhatLearn([]);
      setLearnInput("");
      setReqInput("");
      setTags([]);
      setPreviewUrl(null);
      setData({
        title: "",
        description: "",
        category: "premium",
        price: "",
        lectures: "",
        duration: "",
        requirements: [],
        whatLearn: [],
        tags: [],
        language: "",
        creator: userData?.username || "Creator's name...",
        creatorId: userData?.id || "Creator's id...",
        creatorProfileUrl: userData?.profileImageUrl || "",
      });
      setImage(null);
    } catch (error) {
      console.error("Error", error);
      toast.error("Error adding Course.");
    } finally {
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

  const handleCategoryChange = (value: string) => {
    setData((data) => ({ ...data, ["category"]: value }));
  };
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
                  placeholder="Course title"
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
          <>
            {/* === Step 2: Placeholder for pricing, category, lectures, duration === */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="category-select">Category</Label>
                <Select
                  options={options}
                  placeholder="Select Option"
                  onChange={handleCategoryChange}
                  className="dark:bg-dark-900"
                />
              </div>
              {data.category === "premium" && (
                <div>
                  <Label htmlFor="price-input">Price (if premium)</Label>
                  <Input
                    type="number"
                    id="price-input"
                    placeholder="₹200"
                    name="price"
                    onChange={handleInputChange}
                    value={data.price}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="lectures-input">Lectures</Label>
                <Input
                  type="number"
                  id="lectures-input"
                  placeholder="10 lectures"
                  name="lectures"
                  onChange={handleInputChange}
                  value={data.lectures}
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration-input">Duration (minutes)</Label>
                <Input
                  type="number"
                  id="duration-input"
                  placeholder="120"
                  name="duration"
                  onChange={handleInputChange}
                  value={data.duration}
                  required
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="space-y-6">
              {/* Requirements Section */}
              <div>
                <Label>Requirements</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {requirements.map((req) => (
                    <Badge
                      variant="light"
                      key={req}
                      color="primary"
                      endIcon={
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() =>
                            setRequirements(
                              requirements.filter((l) => l !== req)
                            )
                          }
                        >
                          ✕
                        </button>
                      }
                    >
                      {req}
                    </Badge>
                  ))}
                </div>

                <TextArea
                  rows={3}
                  placeholder="Type requirement and press Enter…"
                  value={reqInput}
                  // onChange={(e) => setReqInput(e.target.value)}
                  onChange={(value) => setReqInput(value)}
                  onKeyDown={(e: {
                    key: string;
                    preventDefault: () => void;
                  }) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const trimmed = reqInput.trim();
                      if (trimmed && !requirements.includes(trimmed)) {
                        setRequirements([...requirements, trimmed]);
                      }
                      setReqInput("");
                    }
                  }}
                />
              </div>

              {/* What You'll Learn Section */}
              <div>
                <Label>What You’ll Learn</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {whatLearn.map((learn) => (
                    <Badge
                      variant="light"
                      key={learn}
                      color="primary"
                      endIcon={
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() =>
                            setWhatLearn(whatLearn.filter((l) => l !== learn))
                          }
                        >
                          ✕
                        </button>
                      }
                    >
                      {learn}
                    </Badge>
                  ))}
                </div>
                <TextArea
                  rows={3}
                  placeholder="Type learning and press Enter…"
                  value={learnInput}
                  onChange={(value) => setLearnInput(value)}
                  onKeyDown={(e: {
                    key: string;
                    preventDefault: () => void;
                  }) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const trimmed = learnInput.trim();
                      if (trimmed && !whatLearn.includes(trimmed)) {
                        setWhatLearn([...whatLearn, trimmed]);
                      }
                      setLearnInput("");
                    }
                  }}
                />
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            {/* === Step 4: Placeholder for language, creator, tags, etc. === */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="language-input">Language</Label>
                <Input
                  type="text"
                  id="language-input"
                  placeholder="e.g. English"
                  name="language"
                  onChange={handleInputChange}
                  value={data.language}
                  required
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

              <div>
                <MultiSelect
                  label="Tags"
                  options={multiOptions}
                  defaultSelected={[]}
                  onChange={(values) => setTags(values)}
                />
                <p className="sr-only">Selected Values: {tags.join(", ")}</p>
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
        title="Eduport Admin – Add Course"
        description="This is React/TypeScript page for Eduport Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Add Course" />
      <div
        className="mx-auto mt-6 max-w-screen-2xl px-4 sm:px-6 lg:px-8"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ComponentCard
          title="Add Course"
          desc="Inspire. Educate. Lead. Start by adding your course."
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
              {[1, 2, 3, 4].map((s) => {
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
              {step < 4 ? (
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
