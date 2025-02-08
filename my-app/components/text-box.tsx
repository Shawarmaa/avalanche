import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
//import { processCommand } from "../src/ai/groq";


type DeFiCommand = {
  action: string;
  token: string;
  amount: number;
  slippage?: number;
};

export function TextareaWithButton() {
  const [message, setMessage] = useState(""); // Store input text
  const [response, setResponse] = useState<DeFiCommand | null>(null); // Store AI response
  const [error, setError] = useState<string | null>(null); // Store error message
  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty messages

    try {
      console.log("Sending message:", message);

      const res = await axios.post("http://localhost:3001/api/chat", { message });
      setResponse(res.data.reply); // Set AI response
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Error processing request.");
    }
    console.log("Message sent successfully.");

    setMessage(""); // Clear input field after sending
  };

  return (
    <div className="grid w-full gap-2">
      <Textarea 
        placeholder="Type your message here." 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={sendMessage}>Send message</Button>

      {/* Display AI Response */}
      {response && (
        <div className="p-3 mt-2 border rounded bg-gray-100">
          <strong>AI Response:</strong>
          <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="p-3 mt-2 border rounded bg-red-100">
          <strong>Error:</strong>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}