import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SendHorizonal, User, Bot } from 'lucide-react'; // Using SendHorizonal icon

// Mock messages data
const initialMessages = [
    { id: 1, sender: 'Alice', avatar: '/path/to/alice-avatar.png', fallback: 'AL', text: 'Hey Bob, how is the login bug fix going?', timestamp: '10:30 AM', type: 'received' },
    { id: 2, sender: 'You', avatar: '/path/to/your-avatar.png', fallback: 'YO', text: 'Hi Alice! Almost done, just testing the final edge cases.', timestamp: '10:31 AM', type: 'sent' },
    { id: 3, sender: 'Alice', avatar: '/path/to/alice-avatar.png', fallback: 'AL', text: 'Great! Let me know when it\'s ready for review.', timestamp: '10:32 AM', type: 'received' },
    { id: 4, sender: 'Bob', avatar: '/path/to/bob-avatar.png', fallback: 'BO', text: 'Can someone look at the deployment script?', timestamp: '10:35 AM', type: 'received' },
    { id: 5, sender: 'You', avatar: '/path/to/your-avatar.png', fallback: 'YO', text: 'Sure Bob, I can take a look after this bug fix.', timestamp: '10:36 AM', type: 'sent' },
    { id: 6, sender: 'System', avatar: null, fallback: 'SYS', text: 'Task "Fix login bug" deadline updated to 2025-04-26.', timestamp: '10:40 AM', type: 'system' },
];

export default function ChatPage() {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const scrollAreaRef = useRef(null);

    // Function to scroll to the bottom of the chat
    const scrollToBottom = () => {
        const scrollViewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const messageToSend = {
            id: Date.now(), // Simple unique ID generation
            sender: 'You',
            avatar: '/path/to/your-avatar.png', // Replace with actual user avatar
            fallback: 'YO', // Replace with actual user initials
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'sent',
        };

        setMessages(prevMessages => [...prevMessages, messageToSend]);
        setNewMessage('');
    };

    return (
        // Adjust height calculation if Navbar is sticky (e.g., h-[calc(100vh-4rem)])
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-3xl h-full flex flex-col shadow-lg dark:bg-gray-800">
                <CardHeader className="border-b dark:border-gray-700">
                    <CardTitle>Project Chat</CardTitle>
                    <CardDescription>Real-time discussion for the team.</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 p-0 overflow-hidden"> {/* Remove padding, ScrollArea handles it */}
                    <ScrollArea className="h-full p-4" ref={scrollAreaRef}> {/* Add padding here */}
                        <div className="space-y-4">
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
                                                : 'bg-transparent text-gray-500 dark:text-gray-400 italic text-xs text-center w-full' // System message style
                                        }`}
                                    >
                                        {/* Sender name for received messages */}
                                        {msg.type === 'received' && (
                                            <p className="text-xs font-semibold mb-0.5">{msg.sender}</p>
                                        )}
                                        <p className="whitespace-pre-wrap">{msg.text}</p> {/* Preserve line breaks */}
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
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="border-t pt-4 dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                        <Input
                            id="message"
                            placeholder="Type your message..."
                            className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            autoComplete="off"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                            <SendHorizonal className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}