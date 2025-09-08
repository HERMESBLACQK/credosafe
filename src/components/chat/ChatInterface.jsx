import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Paperclip, ArrowLeft } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import MessageBubble from './MessageBubble';
import FileUpload from './FileUpload';
import supportChatService from '../../api/supportChat';
import { showError } from '../../utils/toast';
import { cn } from '../../utils/cn';

const ChatInterface = ({ conversation, onBack, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { ref: loadingRef, inView } = useInView();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation messages
  useEffect(() => {
    if (conversation?.id) {
      loadMessages();
    }
  }, [conversation?.id]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await supportChatService.getConversationDetails(conversation.id);
      setMessages(response.data.messages || []);
      // Update participants on the conversation object so header can show correct count
      if (response.data.participants && Array.isArray(response.data.participants)) {
        conversation.participants = response.data.participants;
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time message polling
  useEffect(() => {
    if (!conversation?.id) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await supportChatService.getConversationDetails(conversation.id);
        const newMessages = response.data.messages || [];
        
        // Only update if there are new messages
        if (newMessages.length !== messages.length) {
          setMessages(newMessages);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [conversation?.id, messages.length]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    // Check if conversation is open
    if (conversation.status !== 'open') {
      showError('Cannot send messages in closed or resolved conversations');
      return;
    }

    try {
      setIsTyping(true);
      await supportChatService.sendMessage(conversation.id, newMessage.trim());
      setNewMessage('');
      
      // Reload messages to get the latest
      await loadMessages();
    } catch (error) {
      showError(error.message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setIsTyping(true);
      await supportChatService.uploadFile(conversation.id, file);
      
      // Reload messages to get the latest
      await loadMessages();
    } catch (error) {
      showError(error.message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-500';
      case 'closed':
        return 'bg-red-500';
      case 'resolved':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'closed':
        return 'Closed';
      case 'resolved':
        return 'Resolved';
      default:
        return 'Unknown';
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {conversation.subject}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  getStatusColor(conversation.status)
                )} />
                <span className="text-sm text-gray-500">
                  {getStatusText(conversation.status)}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {conversation.issue_type}
                </span>
                {Array.isArray(conversation.participants) && (
                  <>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {conversation.participants.length} participant{conversation.participants.length === 1 ? '' : 's'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Removed call, video call, and options buttons as requested */}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {isLoading && (
          <div ref={loadingRef} className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.sender_id === currentUserId}
            participants={conversation.participants}
            currentUserId={currentUserId}
          />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>Typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        {conversation.status === 'open' ? (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="1"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFileUpload(true)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isTyping}
              >
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">
              This conversation is {conversation.status}. You cannot send messages.
            </p>
          </div>
        )}
      </div>

      {/* File Upload Modal */}
      {showFileUpload && (
        <FileUpload
          onFileUpload={handleFileUpload}
          onClose={() => setShowFileUpload(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;
