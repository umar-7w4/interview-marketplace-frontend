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
  registerInterviewer,
  updateInterviewerProfile,
} from "@/lib/profileService";
import { certifications, timezones, OptionType } from "@/constants/options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ProfileImageUploader from "./ProfileImageUploader";

const interviewerSchema = z.object({
  interviewerId: z.number().optional(),
  userId: z.number(),
  bio: z.string().max(500).optional(),
  currentCompany: z.string().optional(),
  yearsOfExperience: z.number().min(0),
  languagesSpoken: z.array(z.string()).optional(),
  certifications: z.array(z.string()),
  customCertification: z.string().optional(),
  sessionRate: z.number().min(0),
  timezone: z.string().min(1),
  linkedinUrl: z.string().optional(),
  profileImage: z.string().optional(),
  skills: z.array(
    z.object({
      skillId: z.number().min(1),
      yearsOfExperience: z.number().min(0),
      proficiencyLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
      certified: z.boolean(),
    })
  ),
});
type InterviewerFormData = z.infer<typeof interviewerSchema>;

type InterviewerFormProps = {
  mode?: "register" | "edit";
};

const animatedComponents = makeAnimated();

export default function InterviewerForm({
  mode = "register",
}: InterviewerFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [availableSkills, setAvailableSkills] = useState<OptionType[]>([]);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [interviewer, setInterviewer] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showUploader, setShowUploader] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InterviewerFormData>({
    resolver: zodResolver(interviewerSchema),
    defaultValues: {
      interviewerId: undefined,
      userId: user?.userId ?? 0,
      bio: "",
      sessionRate: 0,
      currentCompany: "",
      yearsOfExperience: 0,
      languagesSpoken: [],
      certifications: [],
      timezone: "",
      skills: [],
      linkedinUrl: "",
      profileImage: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "skills" });

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setIsAuthChecked(true);

      const skills = await getAllSkills();
      setAvailableSkills(skills);

      if (mode === "edit") {
        const stored = localStorage.getItem("user");
        if (!stored) return;
        const token = JSON.parse(stored).idToken;
        try {
          const res = await axios.get<any>(
            `/interviewers/user/${user.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const existing = res.data;
          setInterviewer(existing);
          setImageUrl(existing.profileImage);
          console.log(existing);

          const safeSkills = (existing.skills || []).map((s: any) => ({
            ...s,
            proficiencyLevel: ["Beginner", "Intermediate", "Advanced"].includes(
              s.proficiencyLevel
            )
              ? s.proficiencyLevel
              : "Beginner",
          }));

          setValue("interviewerId", existing.interviewerId || undefined);
          setValue("bio", existing.bio || "");
          setValue("currentCompany", existing.currentCompany || "");
          setValue("yearsOfExperience", existing.yearsOfExperience || 0);
          setValue("languagesSpoken", existing.languagesSpoken || []);
          setValue("certifications", existing.certifications || []);
          setValue("timezone", existing.timezone || "");
          setValue("sessionRate", existing.sessionRate || 0);
          setValue("skills", safeSkills);
          setValue("linkedinUrl", existing.linkedinUrl || "");
          setValue("profileImage", existing.profileImage || "");
        } catch (error) {
          console.error("Error fetching interviewer data:", error);
        }
      }
    }
    fetchData().catch(() => {});
  }, [user, mode, setValue]);

  const onSubmit = async (formData: InterviewerFormData) => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) {
        alert("No user data found. Cannot proceed.");
        return;
      }
      const parsed = JSON.parse(stored);
      const token = parsed.idToken;
      if (!token) {
        alert("No auth token found. Cannot proceed.");
        return;
      }

      const updatedCerts = formData.certifications.includes("Others")
        ? formData.certifications
            .filter((c) => c !== "Others")
            .concat(formData.customCertification || "")
        : formData.certifications;

      const payload = {
        ...formData,
        interviewerId: formData.interviewerId || undefined,
        certifications: updatedCerts,
        isVerified: false,
        averageRating: 0.0,
        profileCompletionStatus: true,
        status: "PENDING_VERIFICATION",
        linkedinUrl: formData.linkedinUrl || undefined,
        profileImage: formData.profileImage || undefined,
      };

      if (mode === "edit") {
        await updateInterviewerProfile(token, payload);
        alert("Profile updated successfully!");
        router.push("/dashboard");
      } else {
        await registerInterviewer(token, payload);
        alert("Profile registered successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      alert("Submission failed. See console for details.");
      console.error("Interviewer form submit error:", err);
    }
  };

  if (!isAuthChecked) {
    return <p className="text-white text-center">Loading user info...</p>;
  }

  const currentProfileImage = watch("profileImage");

  console.log(">" + imageUrl + "<");

  return (
    <div className="mt-32">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-[#1a0b33] shadow-xl rounded-xl border border-gray-700 p-10 w-full max-w-5xl mb-32"
      >
        <h2 className="text-3xl font-extrabold text-center text-white mb-2">
          {mode === "edit" ? "Edit Interviewer Profile" : "Interviewer Profile"}
        </h2>
        <p className="text-center text-gray-300 mb-8">
          {mode === "edit"
            ? "Update your profile details below"
            : "Complete your profile to start conducting interviews"}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center justify-center mb-6">
            {!showUploader && (
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl">
                <img
                  src={interviewer?.profileImage || "/default-user-icon.png"}
                  width={160}
                  height={160}
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
                  onUpload={(url: string) => setValue("profileImage", url)}
                />
              </div>
            )}
          </div>

          {}
          <Input label="Bio" {...register("bio")} error={errors.bio?.message} />

          {}
          <Input
            label="Session Rate"
            type="number"
            step="0.01"
            {...register("sessionRate", { valueAsNumber: true })}
            error={errors.sessionRate?.message}
          />

          {}
          <Input
            label="Current Company"
            {...register("currentCompany")}
            error={errors.currentCompany?.message}
          />

          {}
          <Input
            label="Years of Experience"
            type="number"
            {...register("yearsOfExperience", { valueAsNumber: true })}
            error={errors.yearsOfExperience?.message}
          />

          {}
          <Input
            label="LinkedIn"
            {...register("linkedinUrl")}
            error={errors.linkedinUrl?.message}
          />

          {}
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
                  placeholder="Select your timezone..."
                  onChange={(val) => field.onChange(val?.value)}
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

          {}
          <Controller
            name="certifications"
            control={control}
            render={({ field }) => (
              <div>
                <p className="text-gray-200 mb-2 font-semibold">
                  Certifications
                </p>
                <Select<OptionType, true>
                  {...field}
                  isMulti
                  components={animatedComponents}
                  options={certifications}
                  className="text-black"
                  placeholder="Select certifications..."
                  onChange={(vals) => field.onChange(vals.map((v) => v.value))}
                  value={
                    field.value?.map((val) => ({ label: val, value: val })) ||
                    []
                  }
                />
                {field.value?.includes("Others") && (
                  <Input
                    label="Specify Certification"
                    {...register("customCertification")}
                  />
                )}
              </div>
            )}
          />

          {}
          <SkillsSection
            control={control}
            errors={errors}
            availableSkills={availableSkills}
          />

          {}
          <Button
            type="submit"
            className="bg-primary hover:bg-buttonHover w-full p-5 text-lg font-bold rounded-lg transition"
          >
            {mode === "edit" ? "Save Changes" : "Submit"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

function SkillsSection({ control, errors, availableSkills }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const proficiencyOptions = [
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

          <Controller
            name={`skills.${index}.proficiencyLevel`}
            control={control}
            render={({ field }: any) => (
              <Select
                {...field}
                options={proficiencyOptions}
                className="text-black"
                placeholder="Select proficiency..."
                onChange={(option) => field.onChange(option?.value)}
                value={
                  proficiencyOptions.find((opt) => opt.value === field.value) ||
                  null
                }
              />
            )}
          />

          <Input
            label="Years of Experience"
            type="number"
            error={errors.skills?.[index]?.yearsOfExperience?.message}
            {...(field: any) => field}
          />

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
