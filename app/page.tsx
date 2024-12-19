"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  teamName: z.string().min(2, { message: "Team name is required." }),
  leaderName: z.string().min(2, { message: "Leader name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function HomePage() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const [showSuccess, setShowSuccess] = useState(false); // Show success animation
  const [animationTriggered, setAnimationTriggered] = useState(false); // Trigger animation
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/register-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowSuccess(true); // Show the success message
        setTimeout(() => {
          setAnimationTriggered(true); // Trigger animation once success is visible
        }, 50); // Add a short delay to ensure the animation starts after rendering
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow relative">
        {/* Success Animation */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            showSuccess ? "bg-white" : "hidden"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={animationTriggered ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center p-8 bg-gray-50 rounded-lg shadow-lg"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-24 h-24 text-green-500"
              initial={{ scale: 0.5, rotate: -180 }}
              animate={
                animationTriggered
                  ? { scale: 1, rotate: 0, strokeDasharray: "62.8, 0" }
                  : {}
              }
              transition={{ duration: 1 }}
            >
              <motion.path
                d="M9 12l2 2 4-4"
                initial={{ pathLength: 0 }}
                animate={animationTriggered ? { pathLength: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                initial={{ strokeDasharray: "0, 62.8" }}
                animate={
                  animationTriggered ? { strokeDasharray: "62.8, 0" } : {}
                }
                transition={{ duration: 0.8 }}
              />
            </motion.svg>
            <h1 className="text-3xl font-bold text-gray-700 mt-6">
              Submission Successful
            </h1>
            <p className="text-gray-500 mt-4 text-center">
              Thank you for registering your team. The admin will review your
              submission soon.
            </p>
          </motion.div>
        </div>

        {/* Form */}
        {!showSuccess && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              Register Your Team
            </h1>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team Name
              </label>
              <Input
                {...register("teamName")}
                placeholder="Enter your team name"
              />
              {formState.errors.teamName && (
                <p className="mt-1 text-sm text-red-600">
                  {formState.errors.teamName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Leader Name
              </label>
              <Input
                {...register("leaderName")}
                placeholder="Enter leader's name"
              />
              {formState.errors.leaderName && (
                <p className="mt-1 text-sm text-red-600">
                  {formState.errors.leaderName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                {...register("email")}
                placeholder="Enter your email address"
              />
              {formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
