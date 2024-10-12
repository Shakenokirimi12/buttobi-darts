const postToGenerativeModel = async ({ user_prompt }) => {
  const system_prompt = `
    以下の指示に従って、リストを作成してください。
    ユーザーからは緯度と経度が与えられます。その位置から半径50kmの範囲内で、観光地やそれに類するものを考えてください。
    そして、その場所で楽しむのに必要なものだけをリストアップしてください。
    特に、海や山など、特有の場所で使用するものが好ましいです。また、逆に旅行には必須で、書くまでもないものは書かないでください。
    例えば、水着、替えの服、などが好ましく、逆に、靴、スマートフォンなどは書かないでください。
    なお、回答にはリストだけを返してください。
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

async function fetchApiResponse(questionText, systemInstruction) {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    console.error("API key not found.");
    return "APIキーが見つかりませんでした。";
  }
  return await getGeminiFlashResponse(apiKey, questionText, systemInstruction);
}

async function getGeminiFlashResponse(apiKey, questionText, systemInstruction) {
  const model_name = "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model_name}:generateContent?key=${apiKey}`;

  const payload = {
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
    systemInstruction: {
      role: "system",
      parts: [
        {
          text: systemInstruction,
        },
      ],
    },
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
