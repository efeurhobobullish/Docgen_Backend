import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateReadmeAI = async ({ name, analysis, files }) => {
  const prompt = `
You are a senior software engineer.

Generate a professional README.md for this project.

Project Name: ${name}
Language: ${analysis.language}
Framework: ${analysis.framework}
Project Type: ${analysis.type}

Main Files:
${files.slice(0, 30).join("\n")}

Include:
- Project Overview
- Installation
- Usage
- Folder Structure
- Tech Stack
- Contributing
- License

Return clean markdown only.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You generate high quality README files." },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content;
};