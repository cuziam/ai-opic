"use client";
import Link from "next/link";
import { getSurveys, getRandomSurveys } from "../lib/actions";
import { useState, useEffect } from "react";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="login" className="text-red-600">
        Test
      </Link>
      <button
        onClick={() => {
          getSurveys();
        }}
      >
        Generate Survey
      </button>
      <button
        onClick={() => {
          getRandomSurveys();
        }}
      >
        getRandomSurveys
      </button>
    </div>
  );
}
