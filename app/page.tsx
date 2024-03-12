"use client";
import Link from "next/link";
import { getSurveys } from "../lib/actions";
import { useState, useEffect } from "react";

export default function Home() {
  const [surveyGenerated, setSurveyGenerated] = useState(false);

  return (
    <div>
      <h1>Home</h1>
      <Link href="login" className="text-red-600">
        Test
      </Link>
      <button
        onClick={() => {
          getSurveys();
          setSurveyGenerated(true);
        }}
      >
        Generate Survey
      </button>
      {surveyGenerated && <p>Survey Generated</p>}
    </div>
  );
}
