import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";import { useNavigate, useParams } from "react-router";
import SectionCard from "./Sectioncard";
import Button from "../../components/ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import SectionPageBreadcrumb from "./SectionPageBreadcrumb";


type Section = {
  id: string;
  categoryId: string;
  title: string;
  creatorId: string;
  creator: string;
  creatorProfileUrl: string;
};

const SectionList = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { backendUrl, userData } = useContext(AppContext);
  const [list, setList] = useState<Section[]>([]);
  const [editTitle, setEditTitle] = useState("");


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
        `${backendUrl}/categories/${categoryId}/sections`,
        {
          headers: { "X-Creator-Id": userData.id },
        }
      );
      setList(res.data);
    } catch (error) {
      toast.error("Error while reading the sections.");
    }
  };

 
  // Handler to delete a section
  const deleteSection = async (sectionId: any) => {
    try {
      await axios.delete(
        `${backendUrl}/categories/${categoryId}/sections/${sectionId}`,
        {
          headers: { "X-Creator-Id": userData.id },
        }
      );
      toast.success("Section deleted.");
      fetchList();
    } catch (err) {
      toast.error("Could not delete section.");
      console.error(err);
    }
  };
  
useEffect(() => {
  if (userData?.id) {
    fetchList();
  }
}, [userData]);


const updateSection = async (id: string | number, updatedData: any) => {
  try {
      const requestBody = {
        title: updatedData.title,
        creator: userData.username, 
        creatorId: userData.id,
        creatorProfileUrl: userData.profileImageUrl || "",
      };

      await axios.put(
        `${backendUrl}/categories/${categoryId}/sections/${id}`,
        requestBody,
        {
          headers: { "X-Creator-Id": userData.id },
        }
      );

      toast.success("Section updated.");
      fetchList();
    } catch (err) {
      toast.error("Could not update section.");
      console.error(err);
    }
};


  async function addSection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }
    try {
      const requestBody = {
        title: editTitle,
        creator: userData.username,
        creatorId: userData.id,
        creatorProfileUrl: userData.profileImageUrl || "",
      };
      await axios.post(
        `${backendUrl}/categories/${categoryId}/sections`,
        requestBody,
        {
          headers: { "X-Creator-Id": userData.id },
        }
      );
      toast.success("Section added.");
      setEditTitle("");
      closeAddModal();
      fetchList();
    } catch (error) {
      toast.error("Could not add section.");
      console.error(error);
    }
  }

  return (
    <>
      <PageMeta
        title="Eduport Admin – View Sections"
        description="This is React/TypeScript page for Eduport Admin Dashboard"
      />
      <SectionPageBreadcrumb pageTitle="View sections" />
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
          Back to Categories
        </Button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-blue-700 ring-1 ring-inset ring-blue-300 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:ring-blue-700 dark:hover:bg-white/[0.03] dark:hover:text-blue-300"
            onClick={openAddModal}
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </span>
            Add section
            </button>
        </div>
        <ComponentCard title={`${categoryId}`} className="w-full">
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
       A section can only be deleted if it contains no tutorial pages, ensuring that no associated content is unintentionally lost. Additionally, only the administrator who originally created the section has the permission to delete it, maintaining proper ownership and control.
      </p>
    </div>
  </div>
          {list.length > 0 ? (
            list.map((item, index) => (
              <SectionCard item={item} key={index} deleteSection={deleteSection} updateSection={updateSection}  />
            ))
          ) : (
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">No Sections added...</p>
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
              Add Section
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
               Fill the data below to add section.
            </p>
          </div>

          <form
            className="flex flex-col"
            onSubmit={addSection}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3 flex flex-col gap-6">
              
            <div className="col-span-2">
                <Label>Title</Label>
                <Input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeAddModal}>
                Close
              </Button>
              <Button size="sm" type="submit">
                Add Section
              </Button>
            </div>
            
          </form>
        </div>
        

      </Modal>

    </>
  );
};

export default SectionList;
