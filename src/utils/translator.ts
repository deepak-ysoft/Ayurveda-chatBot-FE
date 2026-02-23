/**
 * Simple translation utility using MyMemory Translation API
 * Support for Hindi (hi), Gujarati (gu), and English (en)
 */

const API_URL =
  "https://api.mymemory.translated.net/get";

const MAX_CHUNK_SIZE = 450; // API safe limit

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = "Autodetect",
) {
  if (!text) return "";

  // Only skip if source and target are explicitly the same and not Autodetect
  if (
    sourceLang !== "Autodetect" &&
    targetLang === sourceLang
  )
    return text;

  // If text is within limits, translate directly
  if (text.length <= MAX_CHUNK_SIZE) {
    return await fetchTranslation(
      text,
      targetLang,
      sourceLang,
    );
  }

  // Otherwise, split into chunks and translate each
  const chunks = splitTextIntoChunks(
    text,
    MAX_CHUNK_SIZE,
  );
  const translatedChunks = [];

  for (const chunk of chunks) {
    const translated = await fetchTranslation(
      chunk,
      targetLang,
      sourceLang,
    );
    translatedChunks.push(translated);
    // Tiny delay to be nice to free API
    await new Promise((resolve) =>
      setTimeout(resolve, 50),
    );
  }

  return translatedChunks.join(" ");
}

async function fetchTranslation(
  text: string,
  targetLang: string,
  sourceLang: string,
) {
  try {
    const response = await fetch(
      `${API_URL}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`,
    );
    const data = await response.json();

    if (
      data.responseData &&
      data.responseData.translatedText
    ) {
      return data.responseData.translatedText;
    }
    throw new Error("Translation failed");
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

function splitTextIntoChunks(
  text: string,
  maxLength: number,
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // Split by sentences or spaces to avoid breaking words
  const sentences = text.split(/([.!?]\s+)/);

  for (const sentence of sentences) {
    if (
      (currentChunk + sentence).length <=
      maxLength
    ) {
      currentChunk += sentence;
    } else {
      if (currentChunk)
        chunks.push(currentChunk.trim());

      if (sentence.length > maxLength) {
        // Fallback for extremely long "sentences" (break by space)
        const words = sentence.split(" ");
        let subChunk = "";
        for (const word of words) {
          if (
            (subChunk + word).length <= maxLength
          ) {
            subChunk += word + " ";
          } else {
            chunks.push(subChunk.trim());
            subChunk = word + " ";
          }
        }
        currentChunk = subChunk;
      } else {
        currentChunk = sentence;
      }
    }
  }
  if (currentChunk)
    chunks.push(currentChunk.trim());

  return chunks;
}

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
];

export const SAME_LANGUAGE_MESSAGES: Record<
  string,
  string
> = {
  en: "Text is already in the selected language",
  hi: "पाठ पहले से ही चयनित भाषा में है",
  gu: "પાઠ પહેલેથી જ પસંદ કરેલી ભાષામાં છે",
};
