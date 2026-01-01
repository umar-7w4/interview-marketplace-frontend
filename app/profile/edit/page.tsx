"use client";

import dynamic from "next/dynamic";
import React from "react";
import { useAuth } from "@/context/AuthContext";

const InterviewerForm = dynamic(() => import("../InterviewerForm"), {
  ssr: false,
});
const IntervieweeForm = dynamic(() => import("../IntervieweeForm"), {
  ssr: false,
});

export default function EditProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-white text-center mt-10">
        Loading or no user found...
      </div>
    );
  }

  if (user.role === "INTERVIEWER") {
    return (
      <div className="max-w-5xl mx-auto mt-10 mb-24">
        <InterviewerForm mode="edit" />
      </div>
    );
  } else {
    return (
      <div className="max-w-5xl mx-auto mt-10 mb-24">
        <IntervieweeForm mode="edit" />
      </div>
    );
  }
}
