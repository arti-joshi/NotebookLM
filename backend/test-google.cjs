file// test-google.cjs
require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

(async () => {
	try {
		const apiKey = process.env.GOOGLE_API_KEY;
		if (!apiKey) {
			throw new Error("GOOGLE_API_KEY environment variable is not set.");
		}
		const genAI = new GoogleGenerativeAI(apiKey);

		// Chat test
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		const chat = await model.generateContent({ contents: [{ parts: [{ text: "Say hi in 3 words." }] }] });
		console.log("Chat:", chat.response?.text?.() || chat.response?.candidates?.[0]?.content?.parts?.[0]?.text || "<no text>");

		// Embedding test
		const embModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
		const emb = await embModel.embedContent({ content: { parts: [{ text: "The quick brown fox." }] } });
		const length = emb?.embedding?.values?.length || emb?.data?.[0]?.embedding?.length || 0;
		console.log("Embedding length:", length);
	} catch (err) {
		console.error("Test failed:", err?.message || err);
		process.exit(1);
	}
})();
