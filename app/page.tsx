"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/Components/Header";
import { X, Upload, Loader2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Home = () => {
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newStoryId, setNewStoryId] = useState<string | null>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
const [id,setId]=useState("");
  const router = useRouter();

  // Fetch all stories
  useEffect(() => {
    const fetchStories = async () => {
      setLoadingStories(true);
      try {
        const res = await axios.get("http://localhost:8080/story");
        setStories(res.data.Stories || []);
    
      } catch (err) {
        setStories([]);
      } finally {
        setLoadingStories(false);
      }
    };
    fetchStories();
  }, []);

  // File input change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Upload story and grab last story ID
  const handleDirectUserToOwnStory = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    setShowUploadModal(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);

      // Upload story
      const res = await axios.post(
        "http://localhost:8080/story/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status !== 200) throw new Error("Upload failed");
setId(res.data.id);

      // Fetch updated stories list
      const storiesRes = await axios.get(
        "https://storygenerator-production.up.railway.app/story"
      );

      const storiesList = storiesRes.data.Stories || [];
      if (storiesList.length > 0) {
        const lastStory = storiesList[storiesList.length - 1];
        const storyId = lastStory._id || lastStory.id;
        setNewStoryId(storyId);
      } else {
        setNewStoryId(null);
      }
    } catch (error) {
      console.error("Error uploading or fetching story:", error);
      setNewStoryId(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Background */}
      <div className="p-8 bg-[url('https://images.pexels.com/photos/7476134/pexels-photo-7476134.jpeg')] bg-cover bg-center opacity-100 brightness-95">
        {/* Navbar */}
        <Header />

        {/* Heading */}
        <h1 className="text-center font-bold text-5xl mb-10 text-white">
          Story Books
        </h1>

        {/* CTA Section */}
        <div className="p-[100px] text-white bg-black/50 text-center rounded-2xl">
          <h3 className="text-xl md:text-6xl lg:text-7xl font-extrabold leading-tight -tracking-wider inline-block">
            Every story starts with you
          </h3>
          <button
            onClick={() => setShowAddStoryModal(true)}
            className="font-bold bg-[#00033D] px-6 py-3 rounded-2xl m-10 hover:bg-red-400 text-white shadow-lg"
          >
            Create your own story
          </button>
        </div>

        {/* Add Story Modal */}
        {showAddStoryModal && (
          <div className="fixed bg-black/50 backdrop-blur-sm inset-0 flex items-center justify-center z-50 h-screen p-4">
            <div className="max-w-lg w-full bg-white rounded-2xl text-black p-8 shadow-xl relative">
              {/* Close */}
              <button
                onClick={() => setShowAddStoryModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center">
                Upload Your Story
              </h2>

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-blue-500 transition"
              >
                <Upload size={40} className="text-gray-400 mb-3" />
                <p className="text-gray-600 font-medium">
                  Drag & Drop or Click to Select File
                </p>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {selectedFile && (
                <div className="mt-5 flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                  <FileText className="text-blue-600" />
                  <span className="text-sm font-medium">
                    {selectedFile.name}
                  </span>
                </div>
              )}

              <button
                onClick={handleDirectUserToOwnStory}
                disabled={!selectedFile || uploading}
                className="mt-8 w-full bg-blue-900 text-white rounded-xl px-6 py-3 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Generate Story"}
              </button>
            </div>
          </div>
        )}

        {/* Upload Progress Modal */}
        {showUploadModal && (
          <div className="fixed bg-black/50 backdrop-blur-sm inset-0 flex items-center justify-center z-50 p-4">
            <div className="max-w-sm w-full bg-white rounded-2xl text-black p-8 shadow-xl text-center">
              {uploading ? (
                <>
                  <Loader2
                    className="animate-spin mx-auto text-blue-600"
                    size={40}
                  />
                  <p className="mt-4 text-lg font-medium">
                    Uploading...
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl mb-2"></p>
                  <h3 className="text-xl font-bold">Upload Complete!</h3>
                  <p className="mt-2 text-gray-600">
                    Your story has been successfully Generated.
                  </p>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      if (newStoryId) {
                        router.push(`/story/${id}`);
                      } else {
                        alert("Could not find new story ID.");
                      }
                    }}
                    className="mt-6 bg-blue-900 text-white rounded-xl px-6 py-3 font-medium hover:bg-blue-700"
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Stories Grid from API */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-20">
          {loadingStories ? (
            <div className="col-span-full text-center text-white text-xl">
              Loading stories...
            </div>
          ) : stories.length === 0 ? (
            <div className="col-span-full text-center text-white text-xl">
              No stories found.
            </div>
          ) : (
            stories.map((story: any) => (
              <div
                key={story._id}
                className="rounded-2xl  p-4 shadow-lg bg-white hover:scale-105 transition-transform duration-300 text-center flex flex-col justify-between h-full cursor-pointer"
                onClick={() => router.push(`/story/${story._id}`)}
              >
                <h3 className="text-10 text-center  font-bold">
                  {story.name || "Untitled Story"}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">
                 pages: {story.pages || "No description available."}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
