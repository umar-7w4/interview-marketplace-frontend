"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InterviewerDto } from "@/types/entities";
import { InterviewerSkills } from "@/components/InterviewerSkills";
import userImage from "@/images/user.png";

type UserInfo = {
  fullName: string;
  profilePictureUrl?: string;
};

interface FilterOptions {
  minExperience: number;
  maxExperience: number;
  currentCompany: string;
  minSessionRate: number;
  maxSessionRate: number;
  minAverageRating: number;
  maxAverageRating: number;
  verified: boolean;
  selectedSkills: string[];
  sortBy: "name" | "yearsOfExperience" | "sessionRate" | "averageRating";
  sortOrder: "asc" | "desc";
}

export default function HomePage() {
  const [interviewers, setInterviewers] = useState<InterviewerDto[]>([]);
  const [filteredInterviewers, setFilteredInterviewers] = useState<
    InterviewerDto[]
  >([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minExperience: 0,
    maxExperience: 50,
    currentCompany: "",
    minSessionRate: 0,
    maxSessionRate: 1000,
    minAverageRating: 0,
    maxAverageRating: 5,
    verified: false,
    selectedSkills: [],
    sortBy: "yearsOfExperience",
    sortOrder: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [userInfos, setUserInfos] = useState<Record<number, UserInfo>>({});

  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const authTokensStr = localStorage.getItem("authTokens");
        const idToken = authTokensStr ? JSON.parse(authTokensStr).idToken : "";
        const res = await fetch(`${apiUrl}/api/interviewers`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) throw new Error("Failed to fetch interviewers");
        const data: InterviewerDto[] = await res.json();
        setInterviewers(data);
        setFilteredInterviewers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviewers();
  }, []);

  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const authTokensStr = localStorage.getItem("authTokens");
        const idToken = authTokensStr ? JSON.parse(authTokensStr).idToken : "";
        const uniqueUserIds = Array.from(
          new Set(interviewers.map((i) => i.userId))
        );
        const mapping: Record<number, UserInfo> = {};
        await Promise.all(
          uniqueUserIds.map(async (userId) => {
            const res = await fetch(`${apiUrl}/api/users/${userId}`, {
              headers: { Authorization: `Bearer ${idToken}` },
            });
            if (res.ok) {
              const text = await res.text();
              try {
                const data = JSON.parse(text.trim());
                mapping[userId] = {
                  fullName: data.fullName,
                  profilePictureUrl: data.profilePictureUrl,
                };
              } catch (parseError) {
                const fullNameMatch = text.match(/"fullName"\s*:\s*"([^"]+)"/);
                const picMatch = text.match(
                  /"profilePictureUrl"\s*:\s*"([^"]*)"/
                );
                mapping[userId] = {
                  fullName: fullNameMatch ? fullNameMatch[1] : "Unknown",
                  profilePictureUrl:
                    picMatch && picMatch[1] ? picMatch[1] : undefined,
                };
                console.error(
                  "Error parsing JSON for userId",
                  userId,
                  "response text:",
                  text
                );
              }
            }
          })
        );
        setUserInfos(mapping);
      } catch (error) {
        console.error(error);
      }
    };
    if (interviewers.length > 0) {
      fetchUserInfos();
    }
  }, [interviewers]);

  const applyFilters = () => {
    let result = [...interviewers];
    result = result.filter(
      (i) =>
        i.yearsOfExperience >= filterOptions.minExperience &&
        i.yearsOfExperience <= filterOptions.maxExperience
    );
    if (filterOptions.currentCompany.trim() !== "") {
      result = result.filter(
        (i) =>
          i.currentCompany &&
          i.currentCompany
            .toLowerCase()
            .includes(filterOptions.currentCompany.toLowerCase())
      );
    }
    result = result.filter(
      (i) =>
        i.sessionRate >= filterOptions.minSessionRate &&
        i.sessionRate <= filterOptions.maxSessionRate
    );
    result = result.filter(
      (i) =>
        i.averageRating >= filterOptions.minAverageRating &&
        i.averageRating <= filterOptions.maxAverageRating
    );
    if (filterOptions.verified) {
      result = result.filter((i) => i.isVerified);
    }
    if (filterOptions.selectedSkills.length > 0) {
      result = result.filter((i) =>
        i.skills?.some((skillObj) =>
          filterOptions.selectedSkills.includes(skillObj.skill.name)
        )
      );
    }
    result.sort((a, b) => {
      let compare = 0;
      if (filterOptions.sortBy === "name") {
        const nameA = userInfos[a.userId]?.fullName || "";
        const nameB = userInfos[b.userId]?.fullName || "";
        compare = nameA.localeCompare(nameB);
      } else if (filterOptions.sortBy === "yearsOfExperience") {
        compare = a.yearsOfExperience - b.yearsOfExperience;
      } else if (filterOptions.sortBy === "sessionRate") {
        compare = a.sessionRate - b.sessionRate;
      } else if (filterOptions.sortBy === "averageRating") {
        compare = a.averageRating - b.averageRating;
      }
      return filterOptions.sortOrder === "asc" ? compare : -compare;
    });
    setFilteredInterviewers(result);
  };

  useEffect(() => {
    applyFilters();
  }, [filterOptions, interviewers, userInfos]);

  const handleExperienceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "min" | "max"
  ) => {
    const value = Number(e.target.value);
    setFilterOptions((prev) => ({
      ...prev,
      [field === "min" ? "minExperience" : "maxExperience"]: value,
    }));
  };

  const handleCurrentCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterOptions((prev) => ({
      ...prev,
      currentCompany: e.target.value,
    }));
  };

  const handleSessionRateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "min" | "max"
  ) => {
    const value = Number(e.target.value);
    setFilterOptions((prev) => ({
      ...prev,
      [field === "min" ? "minSessionRate" : "maxSessionRate"]: value,
    }));
  };

  const handleAverageRatingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "min" | "max"
  ) => {
    const value = Number(e.target.value);
    setFilterOptions((prev) => ({
      ...prev,
      [field === "min" ? "minAverageRating" : "maxAverageRating"]: value,
    }));
  };

  const handleVerifiedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions((prev) => ({
      ...prev,
      verified: e.target.checked,
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions((prev) => ({
      ...prev,
      sortBy: e.target.value as
        | "name"
        | "yearsOfExperience"
        | "sessionRate"
        | "averageRating",
    }));
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions((prev) => ({
      ...prev,
      sortOrder: e.target.value as "asc" | "desc",
    }));
  };

  const resetFilters = () => {
    setFilterOptions({
      minExperience: 0,
      maxExperience: 50,
      currentCompany: "",
      minSessionRate: 0,
      maxSessionRate: 1000,
      minAverageRating: 0,
      maxAverageRating: 5,
      verified: false,
      selectedSkills: [],
      sortBy: "yearsOfExperience",
      sortOrder: "desc",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#15192e] to-[#0c0f1c] flex items-center justify-center">
        <p className="text-white text-xl">Loading interviewers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex gap-8 mt-24">
        <aside className="w-1/4 p-8 bg-gradient-to-br from-[#15192e] to-[#0c0f1c] rounded-2xl shadow-2xl border border-gray-700 mr-6">
          <h2 className="text-3xl font-bold text-white mb-8">Filters</h2>
          <div className="mb-8">
            <label className="block text-gray-300 font-semibold mb-3">
              Experience (Years)
            </label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={filterOptions.minExperience}
                onChange={(e) => handleExperienceChange(e, "min")}
                className="w-1/2 flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Min"
                min={0}
              />
              <input
                type="number"
                value={filterOptions.maxExperience}
                onChange={(e) => handleExperienceChange(e, "max")}
                className="w-1/2 flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Max"
                min={0}
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-gray-300 font-semibold mb-3">
              Current Company
            </label>
            <input
              type="text"
              value={filterOptions.currentCompany}
              onChange={handleCurrentCompanyChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Enter company name"
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-300 font-semibold mb-3">
              Session Rate ($)
            </label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={filterOptions.minSessionRate}
                onChange={(e) => handleSessionRateChange(e, "min")}
                className="w-1/2 flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Min"
                min={0}
              />
              <input
                type="number"
                value={filterOptions.maxSessionRate}
                onChange={(e) => handleSessionRateChange(e, "max")}
                className="w-1/2 flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Max"
                min={0}
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-gray-300 font-semibold mb-3">
              Average Rating
            </label>
            <div className="flex space-x-4">
              <input
                type="number"
                step="0.1"
                value={filterOptions.minAverageRating}
                onChange={(e) => handleAverageRatingChange(e, "min")}
                className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Min"
                min={0}
                max={5}
              />
              <input
                type="number"
                step="0.1"
                value={filterOptions.maxAverageRating}
                onChange={(e) => handleAverageRatingChange(e, "max")}
                className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Max"
                min={0}
                max={5}
              />
            </div>
          </div>
          <div className="mb-8 flex items-center">
            <input
              type="checkbox"
              checked={filterOptions.verified}
              onChange={handleVerifiedChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-3 text-gray-300 font-semibold">
              Verified Only
            </label>
          </div>
          <div className="mb-8">
            <label className="block text-gray-300 font-semibold mb-3">
              Sort By
            </label>
            <select
              value={filterOptions.sortBy}
              onChange={handleSortChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="yearsOfExperience">Experience</option>
              <option value="name">Name</option>
              <option value="sessionRate">Session Rate</option>
              <option value="averageRating">Average Rating</option>
            </select>
          </div>
          <div className="mb-8">
            <label className="block text-gray-300 font-semibold mb-3">
              Order
            </label>
            <select
              value={filterOptions.sortOrder}
              onChange={handleSortOrderChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          <button
            onClick={resetFilters}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg transition-all transform hover:scale-105"
          >
            Reset Filters
          </button>
        </aside>

        <section className="w-3/4">
          {filteredInterviewers.length === 0 ? (
            <p className="text-center text-gray-400 text-2xl">
              No interviewers match your criteria.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInterviewers.map((interviewer) => (
                <Link
                  href={`/home/${
                    interviewer.interviewerId || interviewer.userId
                  }`}
                  key={interviewer.interviewerId || interviewer.userId}
                  className="cursor-pointer"
                >
                  <Card className="relative bg-gradient-to-br from-[#15192e] to-[#0c0f1c] rounded-lg overflow-hidden shadow-2xl transform transition duration-300 hover:scale-105 border border-gray-700">
                    <CardHeader className="p-0">
                      <img
                        src={
                          interviewer.profileImage || "/default-user-icon.png"
                        }
                        alt={
                          userInfos[interviewer.userId]?.fullName ||
                          "Interviewer"
                        }
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = userImage.src;
                        }}
                        className="w-full h-60 object-cover"
                      />
                    </CardHeader>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {userInfos[interviewer.userId]?.fullName || "Unknown"}
                      </h2>
                      <p className="text-gray-300 mb-2">
                        {interviewer.yearsOfExperience}{" "}
                        {interviewer.yearsOfExperience === 1 ? "year" : "years"}{" "}
                        of experience
                      </p>
                      <p className="text-xl text-emerald-400 font-semibold mb-4">
                        ${interviewer.sessionRate} per session
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-200 font-semibold">
                          Skills:
                        </span>
                        <InterviewerSkills
                          interviewerId={
                            interviewer.interviewerId || interviewer.userId
                          }
                        />
                      </div>
                    </CardContent>
                    <div
                      className="absolute bottom-4 right-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://www.google.com/search?q=${interviewer.currentCompany}`,
                          "_blank"
                        );
                      }}
                    >
                      <img
                        src={`https://logo.clearbit.com/${interviewer.currentCompany
                          ?.toLowerCase()
                          .replace(/\s+/g, "")
                          .replace(/[^\w.-]/g, "")}.com`}
                        alt={interviewer.currentCompany}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/default-company-icon.png";
                        }}
                        className="h-8 w-8 rounded bg-white p-[2px] shadow"
                      />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
