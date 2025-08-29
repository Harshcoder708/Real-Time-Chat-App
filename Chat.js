import React, { useState, useEffect, useRef } from "react";
import { Message } from "@/entities/Message";
import { User } from "@/entities/User";
import { motion, AnimatePresence } from "framer-motion";

import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";
import ChatHeader from "../components/chat/ChatHeader";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Get conversation ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const conversationId = urlParams.get('conversation') || 'general';

  useEffect(() => {
    initializeChat();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const user = await User.me();
      setCurrentUser(user);
      
      // Load messages for this conversation
      await loadMessages();
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
    setIsLoading(false);
  };

  const loadMessages = async () => {
    try {
      const fetchedMessages = await Message.filter(
        { conversation_id: conversationId }, 
        'created_date', 
        100
      );
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async (content, convId) => {
    if (!currentUser || !content.trim()) return;
    
    try {
      const newMessage = await Message.create({
        content: content.trim(),
        sender_name: currentUser.full_name || currentUser.email.split('@')[0],
        conversation_id: convId || conversationId
      });
      
      // Add the new message to the list
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadMessages();
    setIsRefreshing(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 text-slate-600"
        >
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Loading chat...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ChatHeader 
        conversationId={conversationId}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-slate-50/30 to-blue-50/20">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Start the conversation
                </h3>
                <p className="text-slate-500">
                  Be the first to send a message in {conversationId === 'team' ? 'Team Discussion' : 'General Chat'}
                </p>
              </motion.div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        conversationId={conversationId}
      />
    </div>
  );
}
