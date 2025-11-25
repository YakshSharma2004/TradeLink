import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Send, Search, Loader2 } from 'lucide-react';
import { Message, ChatConversation } from '../types';
import { socket } from '../socket';
import { getConversations, getMessages, sendMessage, markMessageAsRead } from '../lib/api';
import { toast } from 'sonner';

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
  initialRecipientName,
}: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    initialRecipientId || null
  );
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial data fetch
  useEffect(() => {
    fetchConversations();
  }, [currentUserId]);

  // Fetch messages when conversation selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations(currentUserId);
      setConversations(data);

      // If we have an initial recipient but they are not in the conversation list yet (new chat),
      // we might need to handle that. For now, we assume the backend handles creating a conversation
      // or we just start with an empty message list for that user.
      if (initialRecipientId && !data.find(c => c.userId === initialRecipientId)) {
        // Optimistically add them to the list if we have their name
        if (initialRecipientName) {
          setConversations(prev => [
            {
              userId: initialRecipientId,
              userName: initialRecipientName,
              lastMessage: '',
              lastMessageTime: new Date(),
              unreadCount: 0
            },
            ...prev
          ]);
        }
      }

    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    try {
      const data = await getMessages(currentUserId, otherUserId);
      // Ensure timestamps are Date objects
      const parsedMessages = data.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
      setMessages(parsedMessages);

      // Mark unread messages as read
      const unreadMessages = parsedMessages.filter(m => !m.read && m.receiverId === currentUserId);
      unreadMessages.forEach(m => {
        markMessageAsRead(m.id).catch(console.error);
      });

      // Update unread count in conversation list locally
      setConversations(prev => prev.map(c =>
        c.userId === otherUserId ? { ...c, unreadCount: 0 } : c
      ));

    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log('Socket connected');
      socket.emit('join', currentUserId);
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('Socket disconnected');
    }

    function onReceiveMessage(message: any) {
      console.log('Received message:', message);
      const newMessage: Message = {
        ...message,
        timestamp: new Date(message.timestamp),
      };

      // If the message belongs to the current conversation, add it
      if (
        (newMessage.senderId === selectedConversation && newMessage.receiverId === currentUserId) ||
        (newMessage.senderId === currentUserId && newMessage.receiverId === selectedConversation)
      ) {
        setMessages((prev) => [...prev, newMessage]);
        // Mark as read immediately if we are viewing this conversation
        if (newMessage.receiverId === currentUserId) {
          markMessageAsRead(newMessage.id).catch(console.error);
        }
      }

      // Update conversations list (move to top, update last message)
      setConversations(prev => {
        const otherId = newMessage.senderId === currentUserId ? newMessage.receiverId : newMessage.senderId;
        const otherName = newMessage.senderId === currentUserId ? newMessage.receiverName : newMessage.senderName;

        const existingConvIndex = prev.findIndex(c => c.userId === otherId);
        const newConv: ChatConversation = {
          userId: otherId,
          userName: otherName,
          lastMessage: newMessage.message,
          lastMessageTime: newMessage.timestamp,
          unreadCount: (existingConvIndex !== -1 ? prev[existingConvIndex].unreadCount : 0) +
            (newMessage.receiverId === currentUserId && selectedConversation !== otherId ? 1 : 0)
        };

        if (existingConvIndex !== -1) {
          const newConvs = [...prev];
          newConvs.splice(existingConvIndex, 1);
          return [newConv, ...newConvs];
        } else {
          return [newConv, ...prev];
        }
      });
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
    };
  }, [currentUserId, selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !selectedConversation) return;

    const recipient = conversations.find(c => c.userId === selectedConversation);
    const recipientName = recipient ? recipient.userName : (initialRecipientId === selectedConversation ? initialRecipientName : 'Unknown');

    try {
      const messageData = {
        senderId: currentUserId,
        senderName: currentUserName,
        receiverId: selectedConversation,
        receiverName: recipientName || 'Unknown',
        message: messageInput.trim(),
        timestamp: new Date(),
      };

      // Optimistic update
      // setMessages(prev => [...prev, { ...messageData, id: 'temp-' + Date.now(), read: false }]);

      // Send via API (which should also emit socket event from server, or we emit it here? 
      // Usually API saves to DB and emits event. 
      // But for now, let's use the API to save and let the server emit back, 
      // OR we can just rely on the socket if we implemented it that way.
      // The `sendMessage` API in `api.ts` posts to `/messages`.

      const savedMessage = await sendMessage(messageData);

      // If the server emits 'receive_message' back to sender, we don't need to manually add it here 
      // to avoid duplicates, unless we filter duplicates.
      // Let's assume we need to add it manually for immediate feedback if the socket is slow,
      // but usually we wait for the socket or the API response.

      // Let's use the API response to add it to the list
      const newMessage = { ...savedMessage, timestamp: new Date(savedMessage.timestamp) };
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');

      // Also update conversation list
      setConversations(prev => {
        const existingConvIndex = prev.findIndex(c => c.userId === selectedConversation);
        const newConv: ChatConversation = {
          userId: selectedConversation,
          userName: recipientName || 'Unknown',
          lastMessage: newMessage.message,
          lastMessageTime: newMessage.timestamp,
          unreadCount: existingConvIndex !== -1 ? prev[existingConvIndex].unreadCount : 0
        };

        if (existingConvIndex !== -1) {
          const newConvs = [...prev];
          newConvs.splice(existingConvIndex, 1);
          return [newConv, ...newConvs];
        } else {
          return [newConv, ...prev];
        }
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    searchQuery === '' ||
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUser = conversations.find(c => c.userId === selectedConversation) ||
    (selectedConversation === initialRecipientId ? { userName: initialRecipientName, role: 'User' } : null);

  if (loading && conversations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl text-slate-900 mt-2 ml-4">Messages</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-600">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-24rem)]">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-slate-600">
                    No conversations found
                  </div>
                ) : (
                  <div>
                    {filteredConversations.map(conv => (
                      <div
                        key={conv.userId}
                        className={`p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors ${selectedConversation === conv.userId ? 'bg-slate-100' : ''
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
                              <p className="truncate font-medium">{conv.userName}</p>
                              {conv.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(conv.lastMessageTime).toLocaleTimeString([], {
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
                        {selectedUser?.userName?.split(' ').map((n: string) => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedUser?.userName || 'Unknown'}</CardTitle>
                      {/* <p className="text-sm text-slate-600">{selectedUser?.role}</p> */}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {messages.map(message => {
                        const isSent = message.senderId === currentUserId;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${isSent
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-200 text-slate-900'
                                }`}
                            >
                              <p className="break-words">{message.message}</p>
                              <p
                                className={`text-xs mt-1 ${isSent ? 'text-blue-100' : 'text-slate-600'
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
