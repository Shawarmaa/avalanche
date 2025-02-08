import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

export function TextareaWithButton() {
  const [message, setMessage] = useState(""); // Store input text
  const [response, setResponse] = useState(""); // Store AI response

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty messages

    try {
      const res = await axios.post("http://localhost:3000/api/chat", { message });
      setResponse(JSON.stringify(res.data.reply, null, 2)); // Format AI response
    } catch (error) {
      console.error("Error sending message:", error);
      setResponse("Error processing request.");
    }

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
          <pre className="text-sm">{response}</pre>
        </div>
      )}
    </div>
  );
}