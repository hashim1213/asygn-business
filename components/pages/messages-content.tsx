"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare,
  Send,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Video,
  Calendar,
  MapPin,
  Clock,
  Users,
  Coffee,
  Utensils,
  Package,
  Headphones,
  CheckCircle,
  AlertCircle,
  Star,
  Paperclip,
  Image,
  Loader2,
  ArrowLeft,
  X,
  Pin,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  Circle
} from 'lucide-react'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderRole: 'client' | 'staff'
  timestamp: Date
  read: boolean
  messageType: 'text' | 'image' | 'file' | 'system'
}

interface Conversation {
  id: string
  bookingId: string
  staffId: string
  staffName: string
  staffRole: string
  staffAvatar: string
  staffPhone: string
  staffEmail: string
  eventTitle: string
  eventDate: string
  eventVenue: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isPinned: boolean
  isArchived: boolean
  status: 'active' | 'completed' | 'cancelled'
  messages: Message[]
}

const getStaffIcon = (role: string) => {
  switch (role.toLowerCase()) {
    case 'bartender': return Coffee
    case 'server': return Utensils
    case 'barback': return Package
    case 'event crew': return Headphones
    default: return Users
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 border-green-200'
    case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showArchived, setShowArchived] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    try {
      setLoading(true)
      // Fetch all bookings and create conversations from them
      const bookingsResponse = await fetch('/api/bookings/my-bookings')
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        const mockConversations: Conversation[] = []

        // Create conversations for each staff member in each booking
        for (const booking of bookingsData.bookings) {
          for (const staff of booking.staffMembers) {
            const conversation: Conversation = {
              id: `${booking.id}-${staff.id}`,
              bookingId: booking.id,
              staffId: staff.id,
              staffName: staff.name,
              staffRole: staff.role,
              staffAvatar: staff.profileImg,
              staffPhone: staff.phone,
              staffEmail: staff.email,
              eventTitle: booking.eventTitle,
              eventDate: booking.date,
              eventVenue: booking.venue,
              lastMessage: staff.lastMessage || 'No messages yet',
              lastMessageTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
              unreadCount: Math.floor(Math.random() * 3),
              isPinned: Math.random() > 0.8,
              isArchived: Math.random() > 0.9,
              status: booking.status === 'completed' ? 'completed' : 
                      booking.status === 'cancelled' ? 'cancelled' : 'active',
              messages: [
                {
                  id: '1',
                  content: staff.lastMessage || 'Looking forward to working with you!',
                  senderId: staff.id,
                  senderName: staff.name,
                  senderRole: 'staff',
                  timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
                  read: true,
                  messageType: 'text'
                }
              ]
            }
            mockConversations.push(conversation)
          }
        }

        setConversations(mockConversations)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || sending) return

    setSending(true)
    const conversation = conversations.find(c => c.id === selectedConversation)
    if (!conversation) return

    try {
      const response = await fetch(`/api/bookings/${conversation.bookingId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: conversation.staffId,
          message: messageText
        })
      })

      if (response.ok) {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: messageText,
          senderId: 'current-user',
          senderName: 'You',
          senderRole: 'client',
          timestamp: new Date(),
          read: true,
          messageType: 'text'
        }

        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessage: messageText,
                lastMessageTime: new Date()
              }
            : conv
        ))

        setMessageText('')
        setTimeout(scrollToBottom, 100)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ))
  }

  const togglePin = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
    ))
  }

  const toggleArchive = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, isArchived: !conv.isArchived } : conv
    ))
  }

  const filteredConversations = conversations
    .filter(conv => showArchived ? conv.isArchived : !conv.isArchived)
    .filter(conv => {
      const matchesSearch = conv.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conv.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || conv.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
    })

  const selectedConv = conversations.find(c => c.id === selectedConversation)
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading your messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              {totalUnread > 0 && (
                <Badge className="bg-red-500 text-white">
                  {totalUnread}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant={showArchived ? "default" : "outline"}
                size="sm"
                onClick={() => setShowArchived(!showArchived)}
                className="text-sm"
              >
                <Archive className="w-4 h-4 mr-2" />
                {showArchived ? 'Show Active' : 'Show Archived'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 flex flex-col">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="all">All Conversations</option>
                <option value="active">Active Events</option>
                <option value="completed">Completed Events</option>
                <option value="cancelled">Cancelled Events</option>
              </select>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => {
                const Icon = getStaffIcon(conv.staffRole)
                const isSelected = selectedConversation === conv.id
                
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv.id)
                      markAsRead(conv.id)
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-orange-50 border-r-2 border-r-orange-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        {conv.status === 'active' && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 truncate text-sm">
                              {conv.staffName}
                            </h3>
                            {conv.isPinned && <Pin className="w-3 h-3 text-orange-500" />}
                          </div>
                          <div className="flex items-center gap-1">
                            {conv.unreadCount > 0 && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-500">
                              {conv.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getStatusColor(conv.status)} text-xs`}>
                            {conv.staffRole}
                          </Badge>
                          <span className="text-xs text-gray-500 truncate">
                            {conv.eventTitle}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePin(conv.id)
                          }}
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                        {conv.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {filteredConversations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No conversations found</p>
                  <p className="text-xs mt-1">
                    {showArchived ? 'No archived conversations' : 'Start by creating a booking with staff'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 flex flex-col">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden p-2"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        {React.createElement(getStaffIcon(selectedConv.staffRole), { className: "w-5 h-5 text-white" })}
                      </div>
                      
                      <div>
                        <h2 className="font-semibold text-gray-900">{selectedConv.staffName}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{selectedConv.staffRole}</span>
                          <span>•</span>
                          <span>{selectedConv.eventTitle}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`tel:${selectedConv.staffPhone}`)}
                        className="p-2"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `/booking/${selectedConv.bookingId}`}
                        className="p-2"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleArchive(selectedConv.id)}
                        className="p-2"
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Event Info Bar */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedConv.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedConv.eventVenue}</span>
                      </div>
                      <Badge className={`${getStatusColor(selectedConv.status)} text-xs`}>
                        {selectedConv.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConv.messages.map((message) => {
                    const isOwnMessage = message.senderRole === 'client'
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${
                          isOwnMessage 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        } rounded-lg px-4 py-2`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isOwnMessage && message.read && (
                              <CheckCircle className="w-3 h-3 inline ml-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-gray-500"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex-1">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        rows={1}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                      />
                    </div>
                    
                    <Button
                      onClick={sendMessage}
                      disabled={!messageText.trim() || sending}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* No Conversation Selected */
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-sm">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}