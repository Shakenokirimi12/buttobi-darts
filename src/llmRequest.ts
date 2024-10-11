const postToGenerativeModel = async ({
  user_prompt,
}: {
  user_prompt: string;
}) => {
  const system_prompt = `
      以下の指示に従って、リストを作成してください。
      ユーザーからは緯度と経度が与えられます。その位置から半径50kmの範囲内で、観光地やそれに類するものを考えてください。
      そして、その場所で楽しむのに必要なものをリストアップしてください。
      なお、目的地の名前や目的地それ自体の情報は含めず、リストだけを返してください。
      リストは・で始めてください。`;

  try {
    const resultText = await fetchApiResponse(user_prompt, system_prompt);
    console.log(resultText);
    return resultText;
  } catch (error) {
    console.error("Error fetching response:", error);
    return "回答を取得できませんでした。";
  }
};

async function fetchApiResponse(
  questionText: string,
  systemInstruction: string
) {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    console.error("API key not found.");
    return "APIキーが見つかりませんでした。";
  }
  return await getGeminiFlashResponse(apiKey, questionText, systemInstruction);
}

async function getGeminiFlashResponse(
  apiKey: string,
  questionText: string,
  systemInstruction: string
) {
  const model_name = "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model_name}:generateContent?key=${apiKey}`;

  const payload = {
    systemInstruction: {
      role: "system",
      parts: [
        {
          text: systemInstruction,
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: questionText,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 1,
      topK: 64,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      // 'candidates'配列からテキストを取得
      const answerText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "回答を取得できませんでした。";
      return answerText;
    } else {
      return "回答を取得できませんでした。";
    }
  } catch (error) {
    console.error("Error fetching from API:", error);
    return "APIの呼び出しに失敗しました。";
  }
}

export default postToGenerativeModel;
