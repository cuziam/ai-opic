import { getRandomSurveyData } from "@/lib/OpicDbHandler";
import Survey from "./page";
interface Props {
  children: React.ReactNode;
}
export default async function backgroundSurvey({ children }: Props) {
  const surveyData = await getRandomSurveyData();
  return (
    <>
      <Survey surveyData={surveyData}>{children}</Survey>
    </>
  );
}
