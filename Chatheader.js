import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Hash, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatHeader({ conversationId, onRefresh, isRefreshing }) {
  const conversationName = conversationId === 'team' ? 'Team Discussion' : 'General Chat';
  const ConversationIcon = conversationId === 'team' ? Users : Hash;

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-slate-200/60 bg-white/90 backdrop-blur-sm px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
            <ConversationIcon className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{conversationName}</h1>
            <p className="text-sm text-slate-500">
              {conversationId === 'team' ? 'Team collaboration space' : 'Open discussion for everyone'}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-700 rounded-lg"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    </motion.div>
  );
}
