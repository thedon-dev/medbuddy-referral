"use client";

import { ReactNode } from "react";

interface FormWrapperProps {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function FormWrapper({
  onSubmit,
  children,
  title,
  subtitle,
}: FormWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <form onSubmit={onSubmit} className="space-y-6">
              {children}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
