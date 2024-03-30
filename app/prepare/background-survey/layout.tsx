import { getRandomSurveyData } from "@/lib/OpicDbHandler";
import Survey from "./page";

export default async function backgroundSurvey() {
  const surveyData = await getRandomSurveyData();
  return (
    <>
      <Survey surveyData={surveyData}></Survey>
    </>
  );
}
