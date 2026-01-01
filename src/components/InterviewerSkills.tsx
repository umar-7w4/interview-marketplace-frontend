"use client";

import React, { useEffect, useState } from "react";
import { getInterviewerSkills } from "@/lib/interviewService";

interface InterviewerSkillsProps {
  interviewerId: number;
}

export function InterviewerSkills({ interviewerId }: InterviewerSkillsProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getInterviewerSkills(interviewerId);
        setSkills(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [interviewerId]);

  if (loading) {
    return <span className="text-xs">Loading...</span>;
  }

  if (skills.length === 0) {
    return <span className="text-xs">N/A</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {skills.map((skill) => (
        <span key={skill} className="bg-gray-700 px-2 py-1 rounded text-xs">
          {skill}
        </span>
      ))}
    </div>
  );
}
