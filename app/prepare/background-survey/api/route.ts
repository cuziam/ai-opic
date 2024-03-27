import { storeSurveyRecords } from "@/lib/OpicDbHandler";
export async function POST(request: Request) {
  const body = await request.json();
  const { id, surveyRecords } = body;
  try {
    await storeSurveyRecords(id, surveyRecords);
    return new Response("Survey data is stored", { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response("Failed to store survey data", { status: 500 });
  }
}
