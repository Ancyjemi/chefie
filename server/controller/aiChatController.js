import axios from "axios";
export const handleAIChat = async (req, res) => {
  try {
    const { message, currentOrder = [] } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `
You are Chefie, an AI waiter. Always reply in friendly tone. If user is placing an order, respond with this exact JSON format:

{
  "items": [
    {
      "name": "Veg Soup",
      "quantity": 2,
      "customization": "extra spice"
    }
  ]
}

If it's not an order, just respond normally. NEVER include a recipe. Only return JSON if user is placing an order.
            `.trim(),
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content;

    res.json({ reply });
  } catch (err) {
    console.error("Groq AI Error:", err.message);
    res.status(500).json({ error: "AI failed" });
  }
};
