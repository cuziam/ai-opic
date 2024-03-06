"use client";
import { useState } from "react";
export default function PrepareSteps({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="flex gap-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`${
            index === currentStep - 1
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-600"
          } px-4 py-1`}
        >
          Step {index + 1}
          <br />
          {step}
        </div>
      ))}
    </div>
  );
}
