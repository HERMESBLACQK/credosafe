import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Search, Filter, MoreVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import supportChatService from '../api/supportChat';
import ChatInterface from '../components/chat/ChatInterface';
import CreateConversationModal from '../components/chat/CreateConversationModal';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

const SupportChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadConversations();
    // Get current user ID from localStorage or context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user.id);
  }, []);

  const loadConversations = async () => {
    try {
      console.log('🔍 [USER SUPPORT CHAT] Loading conversations...');
      setIsLoading(true);
      const response = await supportChatService.getConversations();
      console.log('📥 [USER SUPPORT CHAT] Conversations loaded:', response);
      setConversations(response.data || []);
      console.log('📥 [USER SUPPORT CHAT] Conversations state updated:', response.data?.length || 0, 'conversations');
    } catch (error) {
      console.error('❌ [USER SUPPORT CHAT] Error loading conversations:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateConversation = async (conversationData) => {
    try {
      console.log('🔍 [USER SUPPORT CHAT] Creating conversation...');
      console.log('📤 [USER SUPPORT CHAT] Conversation data:', conversationData);
      
      const response = await supportChatService.createConversation(conversationData);
      console.log('📥 [USER SUPPORT CHAT] Conversation created:', response);
      
      toast.success('Conversation created successfully');
      setShowCreateModal(false);
      
      // Reload conversations
      await loadConversations();
      
      // Select the new conversation
      const newConversation = conversations.find(c => c.id === response.data.conversationId);
      if (newConversation) {
        console.log('📥 [USER SUPPORT CHAT] Selecting new conversation:', newConversation);
        setSelectedConversation(newConversation);
      }
    } catch (error) {
      console.error('❌ [USER SUPPORT CHAT] Error creating conversation:', error);
      toast.error(error.message);
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

  const getIssueTypeIcon = (issueType) => {
    switch (issueType) {
      case 'account':
        return '👤';
      case 'transaction':
        return '💰';
      case 'voucher':
        return '🎫';
      case 'dispute':
        return '⚖️';
      case 'general':
        return '💬';
      default:
        return '📝';
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.issue_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || conversation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-white border-r border-gray-200 flex-col`}>
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-gray-900">Support Chat</h1>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations found</p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={cn(
                        "p-4 rounded-lg cursor-pointer transition-colors",
                        selectedConversation?.id === conversation.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50 border border-transparent"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getIssueTypeIcon(conversation.issue_type)}</span>
                            <h3 className="font-medium text-gray-900 truncate">
                              {conversation.subject}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {conversation.issue_type} • {conversation.message_count || 0} messages
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              getStatusColor(conversation.status)
                            )} />
                            <span className="text-xs text-gray-500">
                              {getStatusText(conversation.status)}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {conversation.last_message_at 
                                ? format(new Date(conversation.last_message_at), 'MMM dd')
                                : format(new Date(conversation.created_at), 'MMM dd')
                              }
                            </span>
                          </div>
                        </div>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1">
            {selectedConversation ? (
              <ChatInterface
                conversation={selectedConversation}
                onBack={() => setSelectedConversation(null)}
                currentUserId={currentUserId}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center hidden md:block">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to Support Chat
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Select a conversation to start chatting or create a new one
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start New Conversation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Conversation Modal */}
      {showCreateModal && (
        <CreateConversationModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateConversation}
        />
      )}
    </div>
  );
};

export default SupportChat;
