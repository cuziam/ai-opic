require("dotenv").config();
const { OpenAI } = require("openai");

// const openai = new OpenAI({
//   apiKey: "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",
// });

// type Role = "system" | "user" | "assistant";
// type Model = "gpt-3.5-turbo" | "gpt-4-turbo-preview";
// interface ChatRecord {
//   role: Role;
//   content: string;
// }
// interface ChatCompletion {
//   model: Model;
//   messages: ChatRecord[];
//   response_format: {
//     type: "json_object";
//   };
// }

async function main() {
  const initialConfig = {
    name: "WeatherBot",
    model: "gpt-3.5-turbo",
    instructions:
      "you are a assistant and you are helping a user to get the current weather.",
    tools: [
      {
        type: "function",
        function: {
          name: "getCurrentWeather",
          description: "Get the weather in location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city or location to get the weather for",
              },
              unit: { type: "string", enum: ["c", "f"] },
            },
            required: ["location"],
          },
        },
      },
    ],
  };

  try {
    // 1. Create a assistant and a thread (for a conversation)
    const assistant = await openai.beta.assistants.create(initialConfig);
    const thread = await openai.beta.threads.create();

    // 2. add a message to the thread
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "What is the weather in New York?",
    });
    console.log(message.content);

    // 3. Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    let runData = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // 4. Wait for the assistant to respond(long polling)
    while (runData.required_action === null) {
      runData = await new Promise((resolve) =>
        setTimeout(async () => {
          resolve(await openai.beta.threads.runs.retrieve(thread.id, run.id));
        }, 500)
      );
    }
    console.log("current runData", runData);
    // 5. Get desired function ids from the assistant's response
    const functionIds =
      runData.required_action.submit_tool_outputs.tool_calls.map(
        (toolCall) => toolCall.id
      );
    console.log("desired functionIds", functionIds);

    // 6. submit the function outputs
    const submitToolOutputs = await openai.beta.threads.runs.submitToolOutputs(
      thread.id,
      run.id,
      {
        tool_outputs: functionIds.map((id) => ({
          tool_call_id: id,
          output: "72F",
        })),
      }
    );

    await new Promise((resolve) => {
      setTimeout(async () => {
        const messages = await openai.beta.threads.messages.list(thread.id);
        console.log("messages", JSON.stringify(messages.data, null, 2));
      }, 2500);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
