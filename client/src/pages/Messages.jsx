import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiInfo, FiMessageSquare } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import PageLoader from '../components/PageLoader';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Messages = () => {
  const { user, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('app');
  
  const [inbox, setInbox] = useState([]);
  const [activeChat, setActiveChat] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchInbox();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchInbox = async () => {
    try {
      const res = await api.get('/messages/inbox');
      setInbox(res.data.inbox);
      if (res.data.inbox.length > 0 && !activeChat) {
        setActiveChat(res.data.inbox[0].user._id);
      }
    } catch (err) {
      toast.error('Failed to load inbox');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data.messages);
    } catch (err) {
      toast.error('Failed to load messages');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!activeChat && !isAdmin) {
      return toast.error('You cannot start a new conversation right now.');
    }
    
    if (!activeChat) return;

    setSending(true);
    try {
      const res = await api.post('/messages/send', {
        receiverId: activeChat,
        content: newMessage,
        applicationId: appId || undefined
      });
      setMessages([...messages, res.data.data]);
      setNewMessage('');
      fetchInbox(); 
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter flex flex-col">
      <Navbar />
      <main className="container-max max-w-6xl mx-auto navbar-padding pb-10 px-4 md:px-8 flex-1 flex flex-col min-h-[calc(100vh-160px)]">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Chat directly with Veritasco support experts.</p>
        </div>

        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-gray-100 flex overflow-hidden min-h-[500px]">
          
          {/* Sidebar (Inbox) */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-5 border-b border-gray-100 bg-white">
              <h2 className="font-bold text-gray-900 text-[15px]">Conversations</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {inbox.length === 0 ? (
                <div className="p-6 text-[13px] text-center text-gray-400 font-medium">
                  No conversations yet.
                  {!isAdmin && <p className="mt-2 text-[11px] leading-relaxed text-gray-400">Admin will contact you if more information is needed.</p>}
                </div>
              ) : (
                inbox.map((chat) => (
                  <button 
                    key={chat.user._id}
                    onClick={() => setActiveChat(chat.user._id)}
                    className={`w-full text-left p-5 border-b border-gray-50 flex items-center justify-between transition-colors ${
                      activeChat === chat.user._id ? 'bg-white shadow-sm' : 'hover:bg-gray-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-[13px] font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>
                        {chat.user.name[0]?.toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-[14px] text-gray-900 truncate">{chat.user.name}</div>
                        <div className="text-[12px] text-gray-400 font-medium truncate mt-0.5">{chat.lastMessage?.content}</div>
                      </div>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {chat.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-[13px] font-bold" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>
                      {inbox.find(c => c.user._id === activeChat)?.user.name[0]?.toUpperCase() || <FiUser />}
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-gray-900">
                        {inbox.find(c => c.user._id === activeChat)?.user.name || 'User'}
                      </div>
                      <div className="text-[11px] text-gray-400 font-semibold mt-0.5">Active Conversation</div>
                    </div>
                  </div>
                  {appId && (
                    <div className="text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-blue-50 text-blue-600">
                      <FiInfo size={12} /> Application-linked
                    </div>
                  )}
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20">
                  {messages.map((msg) => {
                    const isMe = msg.senderId._id === user._id;
                    return (
                      <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-[20px] px-4.5 py-3 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.02)] ${
                          isMe ? 'bg-black text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                        }`}>
                          <p className="text-[14px] leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
                          <div className={`text-[10px] mt-1.5 text-right font-semibold ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                            {format(new Date(msg.createdAt), 'hh:mm a')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-5 border-t border-gray-100 bg-white">
                  <form onSubmit={handleSend} className="flex gap-3">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-full py-3.5 px-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                    <button 
                      type="submit" 
                      disabled={sending || !newMessage.trim()}
                      className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-40 disabled:hover:bg-black"
                    >
                      <FiSend size={16} className={sending ? 'opacity-50 animate-pulse' : ''} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 bg-gray-50 border border-gray-100 shadow-sm text-gray-300">
                  <FiMessageSquare size={24} />
                </div>
                <p className="text-[14px] font-medium max-w-xs leading-relaxed">Select a conversation from the sidebar to view messages.</p>
              </div>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Messages;
