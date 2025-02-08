import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
 
export function TextareaWithButton() {
  const [message, setMessage] = useState("") // State to store the text value

  const handleSendMessage = () => {
    console.log("Message:", message) // Handle the value here (e.g., send to an API)
    setMessage("") // Optionally clear the textarea after sending
  }

  return (
    <div className="grid w-full gap-2">
      <Textarea 
        placeholder="Type your message here." 
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Update state on change
      />
      <Button onClick={handleSendMessage}>Send message</Button>
    </div>
  )
}