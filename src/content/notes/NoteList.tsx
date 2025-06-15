import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import NoteCard from "./NoteCard";

type Note = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  pdfUrl:  string;
  creatorId: string;
  creator: string;
  creatorProfileUrl: string;
  language: string;
};

const  NoteList = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [list, setList] = useState<Note[]>([]);

  const fetchList = async () => {
    axios.defaults.withCredentials = true;
    try { 
      const response = await axios.get(`${backendUrl}/note/${userData.id}`, {
      });
      console.log(response);
      setList(response.data);
    } catch (error) {
      toast.error("Error while reading the notes.");
    }
  };

  const deleteNote = async (courseId: any) => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.delete(`${backendUrl}/note/${courseId}`, {
      });
      return response.status === 204;
    } catch (error) {
      console.error("Error while deleting the notes.", error);
      throw error;
    }
  };

  const removeNote = async (courseId: any) => {
    try {
      const success = await deleteNote(courseId);
      if (success) {
        toast.success("Notes removed.");
        await fetchList();
      } else {
        toast.error("Error occurred while removing the notes.");
      }
    } catch (error) {
      toast.error("Error occurred while removing the notes.");
    }
  };
useEffect(() => {
  if (userData?.id) {
    fetchList();
  }
}, [userData]);

const updateNote = (id: string | number, updatedData: any, imageFile: File | null , pdfFile: File | null) => {
  const courseEndpoint = `${backendUrl}/note`;
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(updatedData)], { type: "application/json" })
  );
  if (imageFile) {
    formData.append("image", imageFile);
  }
  if (pdfFile) {
    formData.append("pdf", pdfFile);
  }

  axios.put(`${courseEndpoint}/${id}`, formData, {
    withCredentials: true,
  })
    .then(() => {
      toast.success("Notes updated successfully")
      console.log("Note updated successfully");
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



  const notes = list.filter((item) => item.category === "note");
  const cheetsheets = list.filter((item) => item.category === "cheetsheet");
  const handbooks = list.filter((item) => item.category === "handbook")

  return (
    <>
      <PageMeta
        title="Eduport Admin – View Notes"
        description="This is React/TypeScript page for Eduport Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="View Notes" />
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
        <ComponentCard title="Notes" className="w-full">
          {notes.length > 0 ? (
            notes.map((item, index) => (
              <NoteCard item={item} key={index} removenote={removeNote} updateNote={updateNote} />
            ))
          ) : (
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">No notes added...</p>
          )}
        </ComponentCard>

        <ComponentCard title="CheetSheets" className="w-full">
          {cheetsheets.length > 0 ? (
            cheetsheets.map((item, index) => (
              <NoteCard item={item} key={index} removenote={removeNote} updateNote={updateNote}/>
            ))
          ) : (
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">No cheetsheets added...</p>
          )}
        </ComponentCard>

          <ComponentCard title="Handbooks" className="w-full">
          {handbooks.length > 0 ? (
            handbooks.map((item, index) => (
              <NoteCard item={item} key={index} removenote={removeNote} updateNote={updateNote}/>
            ))
          ) : (
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">No handbooks added...</p>
          )}
        </ComponentCard>

      </div>
    </>
  );
};

export default NoteList;
