import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_KEY,
});

export const AIHelper = {
  sendResponse: async (watched_movies_row: string) => {
    const promt = `Based on my list of imdb_id's movies, search on the web for detailed information including title, rating, genre, similar actor cast, director. films should not be repetitive, be unique and don't show the ones I've seen. For each movie, construct an object with the following structure. RESULT must contained 10 movies:

{
  "title": "<movie title>",
  "rating": "<movie rating>",
  "year": "<release year>",
  "imdb_url": "https://www.imdb.com/title/<imdb_id a new movie that you recommend. should not include id from my list>/"
}

Please provide the output strictly as a raw JSON array of such objects without any extra text or explanation, exactly in this format:

[
  {
    "title": "",
    "rating": "",
    "year": "",
    "imdb_url": ""
  }
]
my list: ${watched_movies_row}
`;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promt,
      });
      return response.text;
    } catch (error) {
      throw error;
    }
  },
};
