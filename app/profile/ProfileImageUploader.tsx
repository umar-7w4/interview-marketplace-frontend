"use client";
import React, { useState } from "react";

type ProfileImageUploaderProps = {
  fullName: string;
  userId: number;
  onUpload: (url: string) => void;
  initialImage?: string;
};

export default function ProfileImageUploader({
  fullName,
  userId,
  onUpload,
  initialImage,
}: ProfileImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImage || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const ext = selectedFile.name.split(".").pop();
      const safeName = fullName.replace(/\s+/g, "-").toLowerCase();
      const customFilename = `${safeName}${userId}.${ext}`;
      const formData = new FormData();
      formData.append("file", selectedFile, customFilename);
      formData.append("fullName", fullName);
      formData.append("interviewerId", userId.toString());
      const tokenStr = localStorage.getItem("authTokens");
      const token = tokenStr ? JSON.parse(tokenStr).idToken : "";
      if (!token) throw new Error("No auth token found!");
      const res = await fetch("http://localhost:8080/api/upload-profile-pic", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onUpload(data.url);
      setImagePreview(data.url);
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Profile"
          className="w-40 h-40 rounded-full object-cover shadow-xl"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-white"
      />
      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}
