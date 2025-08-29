import React from "react";
import { format } from "date-fns";
import { User } from "@/entities/User";
import { motion } from "framer-motion";

export default function MessageBubble({ message }) {
  const [currentUser, setCurrentUser] = React.useState(null);
  
  React.useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        // User not logged in
      }
    };
    getCurrentUser();
  }, []);

  const isOwnMessage = currentUser && message.created_by === currentUser.email;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex gap-3 max-w-[85%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isOwnMessage 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
            : 'bg-gradient-to-r from-slate-400 to-slate-500'
        }`}>
          <span className="text-white font-semibold text-xs">
            {message.sender_name?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        
        {/* Message content */}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-2xl px-4 py-3 shadow-sm ${
            isOwnMessage 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' 
              : 'bg-white text-slate-900 border border-slate-200/60'
          }`}>
            {!isOwnMessage && (
              <p className="text-xs font-semibold text-slate-600 mb-1">
                {message.sender_name}
              </p>
            )}
            <p className={`text-sm leading-relaxed ${
              isOwnMessage ? 'text-white' : 'text-slate-900'
            }`}>
              {message.content}
            </p>
          </div>
          
          {/* Timestamp */}
          <p className={`text-xs text-slate-400 mt-1 px-1 ${
            isOwnMessage ? 'text-right' : 'text-left'
          }`}>
            {format(new Date(message.created_date), 'HH:mm')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
