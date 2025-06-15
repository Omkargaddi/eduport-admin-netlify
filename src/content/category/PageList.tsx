import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";import { useNavigate, useParams } from "react-router";
import Button from "../../components/ui/button/Button";
import PageCard from "./PageCard";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { Editor } from "@tinymce/tinymce-react";
import TutPageBreadcrumb from "./TutPageBreadcrumb";


type Page = {
  id: string;
  categoryId: string;
  sectionId: string;
  title: string;
  content: string;
  creatorId: string;
  creator: string;
  creatorProfileUrl: string;
  createdAt: string;
};

const PageList = () => {
  const navigate = useNavigate();
     const { categoryId, sectionId } = useParams();
  const { backendUrl, userData } = useContext(AppContext);
  const [list, setList] = useState<Page[]>([]);
  const [addTitle, setAddTitle] = useState("");
  const [addContent, setAddContent] = useState("");
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

   // modals
    const {
      isOpen: isAddOpen,
      openModal: openAddModal,
      closeModal: closeAddModal,
    } = useModal();

  const fetchList = async () => {
    axios.defaults.withCredentials = true;
    try { 
      const res = await axios.get(
        `${backendUrl}/categories/${categoryId}/sections/${sectionId}/pages`,
        {
          headers: { "X-Creator-Id": userData.id },
          withCredentials: true,
        }
      );
      setList(res.data);
    } catch (error) {
      toast.error("Error while reading the pages.");
    }
  };

 
  // Handler to delete a section
  const deletePage= async (pageId: any) => {
    try {
      await axios.delete(
        `${backendUrl}/categories/${categoryId}/sections/${sectionId}/pages/${pageId}`,
        {
          headers: { "X-Creator-Id": userData.id },
        }
      );
      toast.success("Page deleted.");
      fetchList();
    } catch (err) {
      toast.error("Could not delete page.");
      console.error(err);
    }
  };
  
useEffect(() => {
  if (userData?.id) {
    fetchList();
  }
}, [userData]);


const updatePage = async (id: string | number, updatedData: any) => {
  try {
      const requestBody = {
        title: updatedData.title,
        content: updatedData.content,
        creator: userData.username, 
        creatorId: userData.id,
        creatorProfileUrl: userData.profileImageUrl || "",
      };

      await axios.put(
        `${backendUrl}/categories/${categoryId}/sections/${sectionId}/pages/${id}`,
        requestBody,
        {
          headers: { "X-Creator-Id": userData.id },
        }
      );

      toast.success("Page updated.");
      fetchList();
    } catch (err) {
      toast.error("Could not update page.");
      console.error(err);
    }
};


  async function addPage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const requestBody = {
        title: addTitle,
        content: addContent,
        creator: userData.username,
        creatorId: userData.id,
        creatorProfileUrl: userData.profileImageUrl || "",
      };
      await axios.post(
        `${backendUrl}/categories/${categoryId}/sections/${sectionId}/pages`,
        requestBody,
        {
          headers: { "X-Creator-Id": userData.id },
        }
      );
      toast.success("Page added.");
      setAddTitle("");
      setAddContent("");
      closeAddModal();
      fetchList();
    } catch (error) {
      toast.error("Could not add page.");
      console.error(error);
    }
  }

  return (
    <>
      <PageMeta
        title="Eduport Admin – View Pages"
        description="This is React/TypeScript page for Eduport Admin Dashboard"
      />
      <TutPageBreadcrumb pageTitle="View pages" sectionPath={`/sectionlist/${categoryId}`}/>
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
        <div className="gap-4 w-full flex ">
          <Button
          variant="outline" size="sm"
          onClick={() => navigate(-1)}
          startIcon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-arrow-left-icon lucide-circle-arrow-left"><circle cx="12" cy="12" r="10"/><path d="M16 12H8"/><path d="m12 8-4 4 4 4"/></svg>}
        >
          Back to Sections
        </Button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-blue-700 ring-1 ring-inset ring-blue-300 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:ring-blue-700 dark:hover:bg-white/[0.03] dark:hover:text-blue-300"
            onClick={openAddModal}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </span>
            Add Page
            </button>
        </div>
        <ComponentCard title={`${sectionId}`} className="w-full">
           {/* popular ribbon card at end */}
  <div className="mt-2">
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
       To maintain content integrity and accountability, only the creator who originally created a tutorial page is authorized to delete it. This restriction ensures that only the responsible content author can remove their own material.
      </p>
    </div>
  </div>
          {list.length > 0 ? (
            list.map((item, index) => (
              <PageCard item={item} key={index} deletePage={deletePage} updatePage={updatePage}  />
            ))
          ) : (
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">No Pages added...</p>
          )}
        </ComponentCard>
      </div>





<Modal
        isOpen={isAddOpen}
        onClose={closeAddModal}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Page
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill the data below to add page.
            </p>
          </div>

          <form
            className="flex flex-col"
            onSubmit={addPage}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3 flex flex-col gap-6">
              
            <div className="col-span-2">
                <Label>Title</Label>
                <Input
                  type="text"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                />
              </div>
              <div>
              <Label className="form-label">Content</Label>

               <Editor
  apiKey="3oyp9f595polavb3h023w1v7rg0n39ddxri8apm96yr8dh1r"
  value={addContent}
  onEditorChange={(newContent) =>
                  setAddContent(newContent)
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

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeAddModal}>
                Close
              </Button>
              <Button size="sm" type="submit">
                Add Page
              </Button>
            </div>
            
          </form>
        </div>
        

      </Modal>



    </>
  );
};

export default PageList;
