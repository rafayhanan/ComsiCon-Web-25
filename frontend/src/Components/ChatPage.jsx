import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SendHorizonal, User, Bot } from 'lucide-react';
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom'; // Assuming you're using react-router

export default function ChatPage() {
    const { projectId } = useParams(); // Get projectId from URL params
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState({});
    const [error, setError] = useState(null);
    const scrollAreaRef = useRef(null);
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Function to scroll to the bottom of the chat
    const scrollToBottom = () => {
        const scrollViewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    };

    // Initialize socket connection
    useEffect(() => {
        // Get token from localStorage or your authentication context
        const token = localStorage.getItem('token');
        
        if (!token) {
            setError('Authentication required. Please log in.');
            return;
        }

        // Connect to socket server with token
        const socketUrl = 'http://localhost:5000';
        socketRef.current = io(socketUrl, {
            query: { token }
        });

        // Socket connection events
        socketRef.current.on('connect', () => {
            console.log('Connected to socket server');
            setIsConnected(true);
            setError(null);
            
            // Join project channel once connected
            if (projectId) {
                socketRef.current.emit('joinProjectChannel', projectId);
            }
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from socket server');
            setIsConnected(false);
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Connection error:', err);
            setError('Failed to connect to the chat server. Please try again later.');
            setIsConnected(false);
        });

        // Chat specific events
        socketRef.current.on('messageHistory', (history) => {
            // Format message history to match our UI format
            const formattedHistory = history.map(msg => ({
                id: msg._id,
                sender: msg.senderId.fullName,
                avatar: `/api/users/${msg.senderId._id}/avatar`, // Assuming avatar URL pattern
                fallback: getInitials(msg.senderId.fullName),
                text: msg.content,
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: msg.senderId._id === getUserId() ? 'sent' : 'received'
            }));
            
            setMessages(formattedHistory);
            setTimeout(scrollToBottom, 100);
        });

        socketRef.current.on('receiveMessage', (msg) => {
            const newMsg = {
                id: msg._id,
                sender: msg.senderId.fullName,
                avatar: `/api/users/${msg.senderId._id}/avatar`,
                fallback: getInitials(msg.senderId.fullName),
                text: msg.content,
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: msg.senderId._id === getUserId() ? 'sent' : 'received'
            };
            
            setMessages(prev => [...prev, newMsg]);
            setTimeout(scrollToBottom, 100);
            
            // Clear typing indicator when message is received
            if (typingUsers[msg.senderId._id]) {
                setTypingUsers(prev => {
                    const newState = { ...prev };
                    delete newState[msg.senderId._id];
                    return newState;
                });
            }
        });

        socketRef.current.on('channelError', (errorMsg) => {
            console.error('Channel error:', errorMsg);
            setError(errorMsg);
        });

        socketRef.current.on('messageError', (errorMsg) => {
            console.error('Message error:', errorMsg);
            setError(errorMsg);
            // Clear error after 3 seconds
            setTimeout(() => setError(null), 3000);
        });

        // Typing indicators
        socketRef.current.on('userTyping', ({ userId, fullName, projectId: typingProjectId }) => {
            if (typingProjectId === projectId) {
                setTypingUsers(prev => ({
                    ...prev,
                    [userId]: { fullName, timestamp: Date.now() }
                }));
            }
        });

        socketRef.current.on('userStopTyping', ({ userId, projectId: typingProjectId }) => {
            if (typingProjectId === projectId) {
                setTypingUsers(prev => {
                    const newState = { ...prev };
                    delete newState[userId];
                    return newState;
                });
            }
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                if (projectId) {
                    socketRef.current.emit('leaveProjectChannel', projectId);
                }
                socketRef.current.disconnect();
            }
            
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [projectId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Helper function to get user initials from full name
    const getInitials = (fullName) => {
        if (!fullName) return 'U';
        return fullName
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Helper function to get current user ID
    const getUserId = () => {
        // Get user ID from your auth context or localStorage
        // This is just an example - implement according to your auth system
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user._id || '';
    };

    // Handle typing indicator
    const handleTyping = () => {
        if (socketRef.current && isConnected && projectId) {
            socketRef.current.emit('typing', projectId);
            
            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            
            // Set timeout to stop typing after 2 seconds of inactivity
            typingTimeoutRef.current = setTimeout(() => {
                socketRef.current.emit('stopTyping', projectId);
            }, 2000);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !isConnected || !projectId) return;

        // Send message through socket
        socketRef.current.emit('sendMessage', {
            projectId,
            content: newMessage
        });

        // Stop typing indicator
        socketRef.current.emit('stopTyping', projectId);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Clear input
        setNewMessage('');
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-3xl h-full flex flex-col shadow-lg dark:bg-gray-800">
                <CardHeader className="border-b dark:border-gray-700">
                    <CardTitle>Project Chat</CardTitle>
                    <CardDescription>
                        {isConnected 
                            ? 'Real-time discussion for the team.' 
                            : 'Connecting to chat server...'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            {messages.length === 0 && !error && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No messages yet. Start the conversation!
                                </div>
                            )}
                            
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${
                                        msg.type === 'sent' ? 'justify-end' : 'justify-start'
                                    } ${msg.type === 'system' ? 'justify-center' : ''}`}
                                >
                                    {/* Avatar for received messages */}
                                    {msg.type === 'received' && (
                                        <Avatar className="h-8 w-8 border dark:border-gray-600">
                                            <AvatarImage src={msg.avatar} alt={msg.sender} />
                                            <AvatarFallback className="text-xs">{msg.fallback}</AvatarFallback>
                                        </Avatar>
                                    )}

                                     {/* Message Bubble */}
                                    <div
                                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                                            msg.type === 'sent'
                                                ? 'bg-blue-600 text-white dark:bg-blue-700'
                                                : msg.type === 'received'
                                                ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                                                : 'bg-transparent text-gray-500 dark:text-gray-400 italic text-xs text-center w-full'
                                        }`}
                                    >
                                        {/* Sender name for received messages */}
                                        {msg.type === 'received' && (
                                            <p className="text-xs font-semibold mb-0.5">{msg.sender}</p>
                                        )}
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                        <p className={`text-xs mt-1 ${
                                             msg.type === 'sent' ? 'text-blue-200 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                                        } ${msg.type === 'system' ? 'hidden': ''} ${msg.type === 'sent' ? 'text-right' : 'text-left'}`}>
                                            {msg.timestamp}
                                        </p>
                                    </div>

                                    {/* Avatar for sent messages */}
                                     {msg.type === 'sent' && (
                                        <Avatar className="h-8 w-8 border dark:border-gray-600">
                                            <AvatarImage src={msg.avatar} alt={msg.sender} />
                                            <AvatarFallback className="text-xs">{msg.fallback}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            
                            {/* Typing indicators */}
                            {Object.entries(typingUsers).length > 0 && (
                                <div className="flex items-start gap-3 justify-start">
                                    <div className="max-w-[75%] rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 italic">
                                        {Object.entries(typingUsers).length === 1 
                                            ? `${Object.values(typingUsers)[0].fullName} is typing...` 
                                            : 'Several people are typing...'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="border-t pt-4 dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                        <Input
                            id="message"
                            placeholder={isConnected ? "Type your message..." : "Connecting..."}
                            className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            autoComplete="off"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleTyping}
                            disabled={!isConnected}
                        />
                        <Button 
                            type="submit" 
                            size="icon" 
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                            disabled={!isConnected || newMessage.trim() === ''}
                        >
                            <SendHorizonal className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}