import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Send, Search } from 'lucide-react';
import { Message, ChatConversation } from '../types';
import { mockMessages, mockUsers } from '../lib/mockData';

interface ChatInterfaceProps {
  currentUserId: string;
  currentUserName: string;
  onBack: () => void;
  initialRecipientId?: string;
  initialRecipientName?: string;
}

export function ChatInterface({ 
  currentUserId, 
  currentUserName, 
  onBack,
  initialRecipientId,
  initialRecipientName 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    initialRecipientId || null
  );
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  // Get conversations
  const conversations: ChatConversation[] = mockUsers
    .filter(user => user.id !== currentUserId)
    .map(user => {
      const userMessages = messages.filter(
        m => (m.senderId === user.id || m.receiverId === user.id) &&
             (m.senderId === currentUserId || m.receiverId === currentUserId)
      );
      const lastMessage = userMessages.sort((a, b) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      )[0];
      
      return {
        userId: user.id,
        userName: user.name,
        lastMessage: lastMessage?.message || 'No messages yet',
        lastMessageTime: lastMessage?.timestamp || new Date(),
        unreadCount: userMessages.filter(m => !m.read && m.receiverId === currentUserId).length,
      };
    })
    .filter(conv => 
      searchQuery === '' || 
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Get messages for selected conversation
  const conversationMessages = selectedConversation
    ? messages
        .filter(
          m => (m.senderId === selectedConversation && m.receiverId === currentUserId) ||
               (m.senderId === currentUserId && m.receiverId === selectedConversation)
        )
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    : [];

  const selectedUser = mockUsers.find(u => u.id === selectedConversation);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      receiverId: selectedConversation,
      receiverName: selectedUser?.name || '',
      message: messageInput.trim(),
      timestamp: new Date(),
      read: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl text-slate-900 mt-2">Messages</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-24rem)]">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-slate-600">
                    No conversations found
                  </div>
                ) : (
                  <div>
                    {conversations.map(conv => (
                      <div
                        key={conv.userId}
                        className={`p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors ${
                          selectedConversation === conv.userId ? 'bg-slate-100' : ''
                        }`}
                        onClick={() => setSelectedConversation(conv.userId)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {conv.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="truncate">{conv.userName}</p>
                              {conv.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {conv.lastMessageTime.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedUser?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedUser?.name}</CardTitle>
                      <p className="text-sm text-slate-600">{selectedUser?.role}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {conversationMessages.map(message => {
                        const isSent = message.senderId === currentUserId;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isSent
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-200 text-slate-900'
                              }`}
                            >
                              <p className="break-words">{message.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isSent ? 'text-blue-100' : 'text-slate-600'
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-slate-600">
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
