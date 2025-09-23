"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function StoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(
          `https://storygenerator-production.up.railway.app/story/${id}`
        );
        setStory(res.data.Story);
      } catch (err) {
        console.error(err);
        setError("Failed to load story.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStory();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading story...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          {story?.name || "Untitled Story"}
        </h1>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {story?.stories && story.stories.length > 0
            ? story.stories.join("\n\n")
            : story?.text || "This story could not be loaded."}
        </p>
      </div>
    </div>
  );
}
