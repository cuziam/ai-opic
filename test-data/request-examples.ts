import dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "openai";

process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Role = "system" | "user" | "assistant";
type Model = "gpt-3.5-turbo" | "gpt-4-turbo-preview";
interface ChatRecord {
  role: Role;
  content: string;
}
interface ChatCompletion {
  model: Model;
  messages: ChatRecord[];
}
const initialSystemInstruction: string = ``;
const initialUserMessage: string = ``;

async function main() {
  const initialConfig: ChatCompletion = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: initialSystemInstruction,
      },
      {
        role: "user",
        content: initialUserMessage,
      },
    ],
  };

  const completion = await openai.chat.completions.create(initialConfig);
  console.log(completion.choices[0]); //save this to a file
}
