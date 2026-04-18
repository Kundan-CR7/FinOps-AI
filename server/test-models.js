const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
async function run() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'];
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      await model.generateContent("hello");
      console.log("SUCCESS:", m);
    } catch(e) {
      console.log("FAILED:", m, e.message);
    }
  }
}
run();
