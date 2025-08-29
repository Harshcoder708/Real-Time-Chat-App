import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function MessageInput({ onSendMessage, conversationId }) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(message.trim(), conversationId);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-t border-slate-200/60 bg-white/90 backdrop-blur-sm p-6"
    >
      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send)"
            className="chat-input resize-none border-slate-200/60 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl bg-slate-50/50"
            rows={1}
            disabled={isSending}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!message.trim() || isSending}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </motion.div>
  );
}
