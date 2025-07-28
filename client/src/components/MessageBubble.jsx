export default function MessageBubble({ from, text }) {
  const isBot = from === "bot";
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`p-3 rounded-xl max-w-xs ${
          isBot ? "bg-orange-100" : "bg-green-200"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
