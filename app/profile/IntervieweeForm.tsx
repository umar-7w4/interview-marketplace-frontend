"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import makeAnimated from "react-select/animated";
import Select from "react-select";

import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import {
  getAllSkills,
  registerInterviewee,
  updateIntervieweeProfile,
} from "@/lib/profileService";

import { IntervieweeDto } from "@/types/entities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { OptionType, timezones } from "@/constants/options";
import ProfileImageUploader from "./ProfileImageUploader";

const intervieweeSchema = z.object({
  intervieweeId: z.number().optional(),
  userId: z.number(),
  profileImage: z.string().optional(),
  educationLevel: z.string().optional(),
  languagesSpoken: z.array(z.string()).optional(),
  currentRole: z.string().optional(),
  fieldOfInterest: z.string().optional(),
  resume: z.string().optional(),
  linkedinUrl: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
  skills: z.array(
    z.object({
      skillId: z.number().min(1, "Choose a valid skill"),
      yearsOfExperience: z.number().min(0, "Must be ≥ 0"),
      proficiencyLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
      certified: z.boolean(),
    })
  ),
});
type IntervieweeFormData = z.infer<typeof intervieweeSchema>;

type IntervieweeFormProps = { mode?: "register" | "edit" };

const animatedComponents = makeAnimated();

export default function IntervieweeForm({
  mode = "register",
}: IntervieweeFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [availableSkills, setAvailableSkills] = useState<OptionType[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IntervieweeFormData>({
    resolver: zodResolver(intervieweeSchema),
    defaultValues: {
      userId: user?.userId ?? 0,
      profileImage: "",
      educationLevel: "",
      languagesSpoken: [],
      currentRole: "",
      fieldOfInterest: "",
      resume: "",
      linkedinUrl: "",
      timezone: "",
      skills: [],
    },
  });

  const profileImage = watch("profileImage");
  const { fields, append, remove } = useFieldArray({ control, name: "skills" });

  useEffect(() => {
    if (!user) return;

    getAllSkills().then(setAvailableSkills);

    if (mode === "edit") {
      const token = JSON.parse(localStorage.getItem("user") || "{}").idToken;
      if (token) {
        axios
          .get<IntervieweeDto>(`/interviewees/user/${user.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(({ data }) => {
            setValue("intervieweeId", data.intervieweeId);
            setValue("profileImage", data.profileImage || "");
            setValue("educationLevel", data.educationLevel || "");
            setValue("languagesSpoken", data.languagesSpoken || []);
            setValue("currentRole", data.currentRole || "");
            setValue("fieldOfInterest", data.fieldOfInterest || "");
            setValue("resume", data.resume || "");
            setValue("linkedinUrl", data.linkedinUrl || "");
            setValue("timezone", data.timezone || "");
            setValue(
              "skills",
              (data.skills || []).map((s) => ({
                ...s,
                proficiencyLevel: [
                  "Beginner",
                  "Intermediate",
                  "Advanced",
                ].includes(s.proficiencyLevel)
                  ? s.proficiencyLevel
                  : "Beginner",
              }))
            );
          })
          .catch(console.error)
          .finally(() => setIsReady(true));
      } else {
        setIsReady(true);
      }
    } else {
      setIsReady(true);
    }
  }, [user, mode, setValue]);

  const onSubmit = async (data: IntervieweeFormData) => {
    const token = JSON.parse(localStorage.getItem("user") || "{}").idToken;
    if (!token) return;

    if (mode === "edit") {
      await updateIntervieweeProfile(token, data);
      alert("Profile updated!");
    } else {
      await registerInterviewee(token, data);
      alert("Registered!");
    }
    router.push("/dashboard");
  };

  if (!isReady) return <p className="text-white text-center mt-32">Loading…</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-[#1a0b33] shadow-xl rounded-xl border border-gray-700 p-10 w-full max-w-5xl mx-auto mt-32 mb-24"
    >
      <h2 className="text-3xl font-extrabold text-center text-white mb-2">
        {mode === "edit" ? "Edit Interviewee Profile" : "Interviewee Profile"}
      </h2>
      <p className="text-center text-gray-300 mb-8">
        {mode === "edit"
          ? "Update your interviewee profile details below"
          : "Complete your interviewee profile to start booking interviews"}
      </p>

      <div className="flex flex-col items-center justify-center mb-6">
        {!showUploader && (
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl">
            <img
              src={profileImage || "/default-user-icon.png"}
              alt="profile"
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        {!showUploader ? (
          <div className="flex items-center justify-center space-x-4">
            <p className="text-gray-200 text-center">
              Want to update your profile picture?
            </p>
            <Button onClick={() => setShowUploader(true)}>Yes</Button>
          </div>
        ) : (
          <div className="mt-4">
            <ProfileImageUploader
              fullName={user?.fullName || "unknown"}
              userId={user?.userId || 0}
              initialImage={profileImage || "/default-user-icon.png"}
              onUpload={(url) => setValue("profileImage", url)}
            />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
        <Input
          label="Education Level"
          {...register("educationLevel")}
          error={errors.educationLevel?.message}
        />
        <Input
          label="Current Role"
          {...register("currentRole")}
          error={errors.currentRole?.message}
        />
        <Input
          label="Field of Interest"
          {...register("fieldOfInterest")}
          error={errors.fieldOfInterest?.message}
        />
        <Input
          label="Resume URL"
          {...register("resume")}
          error={errors.resume?.message}
        />
        <Input
          label="LinkedIn"
          {...register("linkedinUrl")}
          error={errors.linkedinUrl?.message}
        />

        <div>
          <p className="text-gray-200 mb-2 font-semibold">Timezone</p>
          <Controller
            name="timezone"
            control={control}
            render={({ field }) => (
              <Select<OptionType>
                {...field}
                components={animatedComponents}
                options={timezones}
                className="text-black"
                placeholder="Select your timezone…"
                onChange={(v) => field.onChange(v?.value)}
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : null
                }
              />
            )}
          />
          {errors.timezone && (
            <p className="text-red-400 text-sm mt-1">
              {errors.timezone.message}
            </p>
          )}
        </div>

        <SkillsSection
          control={control}
          errors={errors}
          availableSkills={availableSkills}
        />

        <Button
          type="submit"
          className="bg-primary hover:bg-buttonHover w-full p-5 text-lg font-bold rounded-lg transition"
        >
          {mode === "edit" ? "Save Changes" : "Submit"}
        </Button>
      </form>
    </motion.div>
  );
}

function SkillsSection({ control, errors, availableSkills }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const proficiencyOptions: OptionType[] = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ];

  return (
    <div>
      <p className="text-gray-200 mb-2 font-semibold">Skills</p>
      {fields.map((item: any, index: number) => (
        <div
          key={item.id}
          className="bg-gray-800 p-4 rounded-lg mb-4 space-y-3"
        >
          {}
          <Controller
            name={`skills.${index}.skillId`}
            control={control}
            render={({ field }: any) => (
              <Select<OptionType>
                {...field}
                options={availableSkills}
                className="text-black"
                placeholder="Select a skill..."
                onChange={(val) => field.onChange(Number(val?.value))}
                value={
                  availableSkills.find((s) => s.value === field.value) || null
                }
              />
            )}
          />
          {errors.skills?.[index]?.skillId && (
            <p className="text-red-400 text-sm">
              {String(errors.skills[index].skillId?.message)}
            </p>
          )}

          {}
          <Controller
            name={`skills.${index}.proficiencyLevel`}
            control={control}
            render={({ field }: any) => (
              <Select<OptionType>
                {...field}
                options={proficiencyOptions}
                className="text-black"
                placeholder="Select proficiency..."
                onChange={(option) => field.onChange(option?.value)}
                value={
                  field.value
                    ? { label: field.value, value: field.value }
                    : null
                }
              />
            )}
          />

          {}
          <Input
            label="Years of Experience"
            type="number"
            error={errors.skills?.[index]?.yearsOfExperience?.message}
            {...(field: any) => field}
          />

          {}
          <div className="flex items-center space-x-2">
            <p className="text-gray-200 font-semibold">Certified?</p>
            <Controller
              name={`skills.${index}.certified`}
              control={control}
              render={({ field }: any) => (
                <Switch
                  checked={field.value === true}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {}
          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(index)}
          >
            Remove Skill
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          append({
            skillId: 1,
            yearsOfExperience: 0,
            proficiencyLevel: "Beginner",
            certified: false,
          })
        }
      >
        + Add Skill
      </Button>
      <style jsx global>{`
        input {
          color: black !important;
          caret-color: black !important;
        }
      `}</style>
    </div>
  );
}
