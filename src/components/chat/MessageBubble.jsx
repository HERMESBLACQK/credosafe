import React from 'react';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';
import { 
  User, 
  Shield, 
  MessageSquare, 
  FileImage, 
  Download,
  ExternalLink
} from 'lucide-react';

const MessageBubble = ({ message, isOwnMessage, participants, currentUserId }) => {
  const getParticipantIcon = (senderType) => {
    switch (senderType) {
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'voucher_owner':
        return <User className="w-4 h-4 text-green-600" />;
      case 'voucher_recipient':
        return <User className="w-4 h-4 text-purple-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getParticipantLabel = (senderType, senderId) => {
    if (senderType === 'admin') return 'Admin';
    const participant = participants?.find(p => p.user_id === senderId);
    if (participant) {
      const name = `${participant.first_name || ''} ${participant.last_name || ''}`.trim();
      if (name) return name;
      if (participant.email) return participant.email;
    }
    switch (senderType) {
      case 'voucher_owner':
        return 'Voucher Owner';
      case 'voucher_recipient':
        return 'Voucher Recipient';
      default:
        return 'User';
    }
  };

  const getParticipantColor = (senderType) => {
    switch (senderType) {
      case 'admin':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'voucher_owner':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'voucher_recipient':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'user':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getParticipantImage = () => {
    if (message.sender_type === 'admin') {
      return null; // Admin uses support icon
    }
    
    // Find participant with matching sender_id
    const participant = participants?.find(p => p.user_id === message.sender_id);
    
    // Only show image if it's not the current user's message or if admin is viewing
    if (participant && participant.avatar_url && (isOwnMessage || currentUserId === 'admin')) {
      return participant.avatar_url;
    }
    
    return null;
  };

  const isImage = message.message?.startsWith('![image]') || message.message?.includes('image/') || 
                  (message.file_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(message.file_url));
  const isFile = message.message?.startsWith('![file]') || message.file_url;

  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isOwnMessage ? "flex-row-reverse justify-end" : "flex-row justify-start"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isOwnMessage ? "order-2" : "order-1"
      )}>
        {getParticipantImage() ? (
          <img 
            src={getParticipantImage()} 
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          getParticipantImage() ? "hidden" : "bg-gradient-to-br from-blue-500 to-purple-600"
        )}>
          {getParticipantIcon(message.sender_type)}
        </div>
      </div>

      {/* Message Content */}
      <div className={cn(
         "flex-1 max-w-[80%] md:max-w-[70%]",
        isOwnMessage ? "order-1" : "order-2"
      )}>
        {/* Participant Label */}
        <div className={cn(
          "flex items-center gap-2 mb-1 text-xs font-medium",
          isOwnMessage ? "justify-end" : "justify-start"
        )}>
          {getParticipantIcon(message.sender_type)}
          <span className={cn(
            "px-2 py-1 rounded-full border",
            getParticipantColor(message.sender_type)
          )}>
            {getParticipantLabel(message.sender_type, message.sender_id)}
          </span>
        </div>

        {/* Message Bubble */}
        <div className={cn(
          "rounded-2xl px-4 py-3 shadow-sm",
          isOwnMessage 
            ? "bg-blue-600 text-white ml-auto border border-blue-600 shadow-md"
            : "bg-white border border-gray-200 text-gray-900 shadow-sm"
        )}>
          {/* Image Message */}
          {isImage && (
            <div className="mb-2">
              <img 
                src={message.file_url || message.message.replace('![image]', '')} 
                alt="Uploaded image"
                className="max-w-full h-auto rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* File Message */}
          {isFile && !isImage && (
            <div className="mb-2 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-3">
                <FileImage className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {message.file_name || 'Attached File'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Click to download
                  </p>
                </div>
                <button 
                  onClick={() => window.open(message.file_url || message.message.replace('![file]', ''), '_blank')}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* Text Message */}
          {!isImage && !isFile && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.message}
            </p>
          )}

          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isOwnMessage ? "text-right" : "text-left"
          )}>
            {format(new Date(message.created_at), 'MMM dd, yyyy HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
