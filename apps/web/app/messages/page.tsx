'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MainLayout } from '../components/MainLayout';
import { Mail, Search, MoreHorizontal, Send } from 'lucide-react';
import api from '../lib/api';
import Link from 'next/link';

interface Conversation {
  id: string;
  updatedAt: string;
  participants: {
    user: {
      id: string;
      name: string;
      username: string;
      avatar: string | null;
    }
  }[];
  messages: {
    content: string;
    createdAt: string;
  }[];
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
  };
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/profile');
      setCurrentUser(res.data);
    } catch (error) {
      console.error('Failed to fetch user', error);
    }
  };

  const fetchConversations = async () => {
    try {
        const res = await api.get('/conversations');
        setConversations(res.data);
    } catch (error) {
        console.error('Failed to fetch conversations', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
        const res = await api.get(`/conversations/${conversationId}/messages`);
        setMessages(res.data);
    } catch (error) {
        console.error('Failed to fetch messages', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim()) return;

    try {
        const res = await api.post(`/conversations/${selectedConversation.id}/messages`, {
            content: newMessage
        });
        setMessages([...messages, res.data]);
        setNewMessage('');
        fetchConversations(); // Update list to show latest message snippet
    } catch (error) {
        console.error('Failed to send message', error);
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
      return conversation.participants.find(p => p.user.id !== currentUser?.id)?.user;
  };

  return (
    <MainLayout>
      <div className="flex h-screen w-full">
        {/* Conversation List */}
        <div className={`w-full flex-col border-r border-gray-800 lg:w-[380px] ${selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
            <div className="flex h-[53px] items-center justify-between px-4">
                <h1 className="text-xl font-bold text-white">Messages</h1>
                <div className="flex gap-4 text-white">
                    <Mail />
                    <Search />
                </div>
            </div>
            <div className="overflow-y-auto">
                {conversations.map(conversation => {
                    const otherUser = getOtherParticipant(conversation);
                    if (!otherUser) return null;
                    return (
                        <div 
                            key={conversation.id} 
                            onClick={() => setSelectedConversation(conversation)}
                            className={`flex cursor-pointer items-center gap-3 p-4 hover:bg-white/5 ${selectedConversation?.id === conversation.id ? 'bg-white/5 border-r-2 border-blue-500' : ''}`}
                        >
                            <div className="h-10 w-10 rounded-full bg-gray-700 bg-cover bg-center" style={{ backgroundImage: otherUser.avatar ? `url(${otherUser.avatar})` : undefined }} />
                            <div className="flex flex-col overflow-hidden">
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-white">{otherUser.name}</span>
                                    <span className="text-gray-500">@{otherUser.username}</span>
                                </div>
                                <span className="text-sm text-gray-500 truncate">
                                    {conversation.messages[0]?.content || 'Start a conversation'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Chat Window */}
        <div className={`flex w-full flex-col ${!selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
            {selectedConversation ? (
                <>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3 backdrop-blur-md">
                         <div className="flex items-center gap-4">
                             <button onClick={() => setSelectedConversation(null)} className="lg:hidden text-white">Back</button>
                             <h2 className="text-lg font-bold text-white">{getOtherParticipant(selectedConversation)?.name}</h2>
                         </div>
                         <MoreHorizontal className="text-blue-500" />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {messages.map((msg) => {
                            const isMe = msg.senderId === currentUser?.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
                                    {!isMe && (
                                         <div className="h-8 w-8 rounded-full bg-gray-700 bg-cover bg-center mr-2" style={{ backgroundImage: msg.sender.avatar ? `url(${msg.sender.avatar})` : undefined }} />
                                    )}
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-800 text-white rounded-bl-none'}`}>
                                        <p>{msg.content}</p>
                                        <span className="text-xs opacity-50 mt-1 block">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="border-t border-gray-800 p-4">
                        <div className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2">
                             <input 
                                type="text" 
                                className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
                                placeholder="Start a new message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                             />
                             <button 
                                type="submit" 
                                disabled={!newMessage.trim()}
                                className="text-blue-500 disabled:opacity-50"
                             >
                                <Send size={20} />
                             </button>
                        </div>
                    </form>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
                     <h2 className="text-3xl font-bold text-white mb-2">Select a message</h2>
                     <p className="text-gray-500">Choose from your existing conversations, start a new one, or get swiping.</p>
                     <button className="mt-8 rounded-full bg-blue-500 px-8 py-3 font-bold text-white hover:bg-blue-600 transition">
                        New Message
                     </button>
                </div>
            )}
        </div>
      </div>
    </MainLayout>
  );
}
