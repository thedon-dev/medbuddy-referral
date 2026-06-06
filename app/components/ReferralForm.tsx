"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import FormField from "./FormField";
import Input from "./Input";
import Select from "./Select";
import FormWrapper from "./FormWrapper";

const referralSchema = z.object({
  userName: z.string().min(1, "Name is required"),
  userEmail: z.string().email("Invalid email address"),
  referredUserName: z.string().min(1, "Referred user name is required"),
  courseName: z.string().min(1, "Course name is required"),
  currency: z.string().min(1, "Currency is required"),
  referralAmount: z.number().positive("Amount must be positive"),
});

type ReferralFormData = z.infer<typeof referralSchema>;

const currencyOptions = [
  { value: "USD", label: "💵 US Dollar (USD)" },
  { value: "EUR", label: "💶 Euro (EUR)" },
  { value: "GBP", label: "💷 British Pound (GBP)" },
  { value: "NGN", label: "🇳🇬 Nigerian Naira (NGN)" },
  { value: "KES", label: "🇰🇪 Kenyan Shilling (KES)" },
  { value: "ZAR", label: "🇿🇦 South African Rand (ZAR)" },
];

export default function ReferralForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      currency: "USD",
      referralAmount: 25,
    },
  });

  const selectedCurrency = watch("currency");

  const onSubmit = async (data: ReferralFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/send-referral-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.error || "Failed to send email");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper
      onSubmit={handleSubmit(onSubmit)}
      title="Send Referral Email"
      subtitle="Reward your users when they bring new learners to Medbuddy"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FormField
            label="Your Full Name"
            name="userName"
            error={errors.userName?.message}
            required
          >
            <Input {...register("userName")} placeholder="e.g., John Doe" />
          </FormField>

          <FormField
            label="Your Email Address"
            name="userEmail"
            error={errors.userEmail?.message}
            required
          >
            <Input
              type="email"
              {...register("userEmail")}
              placeholder="you@example.com"
            />
          </FormField>

          <FormField
            label="Referred User's Name"
            name="referredUserName"
            error={errors.referredUserName?.message}
            required
          >
            <Input
              {...register("referredUserName")}
              placeholder="e.g., Jane Smith"
            />
          </FormField>
        </div>

        <div className="space-y-6">
          <FormField
            label="Course Name"
            name="courseName"
            error={errors.courseName?.message}
            required
          >
            <Input
              {...register("courseName")}
              placeholder="e.g., Full Stack Development"
            />
          </FormField>

          <FormField
            label="Currency"
            name="currency"
            error={errors.currency?.message}
            required
          >
            <Select {...register("currency")} options={currencyOptions} />
          </FormField>

          <FormField
            label="Referral Amount"
            name="referralAmount"
            error={errors.referralAmount?.message}
            required
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">
                  {selectedCurrency === "USD" && "$"}
                  {selectedCurrency === "EUR" && "€"}
                  {selectedCurrency === "GBP" && "£"}
                  {selectedCurrency === "NGN" && "₦"}
                  {selectedCurrency === "KES" && "KSh"}
                  {selectedCurrency === "ZAR" && "R"}
                </span>
              </div>
              <Input
                type="number"
                step="0.01"
                {...register("referralAmount", { valueAsNumber: true })}
                className="pl-12"
                placeholder="0.00"
              />
            </div>
          </FormField>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold text-white
            transition-all duration-200 transform
            flex items-center justify-center gap-2
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            }
          `}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending Email...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Send Referral Email
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-green-800 font-medium">
              ✅ Email sent successfully! The user will receive their referral
              notification.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-800 font-medium">❌ {error}</p>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}
