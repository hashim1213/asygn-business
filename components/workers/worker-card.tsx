"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageCircle, Plus, MapPin, Clock } from "lucide-react"

interface Worker {
  id: string
  name: string
  avatar: string
  rating: number
  distance: string
  skills: string[]
  hourlyRate: number
  responseTime: string
  available: boolean
  completedJobs?: number
  lastActive?: string
}

interface WorkerCardProps {
  worker: Worker
  onMessage: (workerId: string) => void
  onHire: (workerId: string) => void
}

export function WorkerCard({ worker, onMessage, onHire }: WorkerCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <CardContent className="p-5">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={worker.avatar || "/placeholder.svg"} alt={worker.name} />
                <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                  {worker.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {worker.available && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{worker.name}</h4>
              <div className="flex items-center space-x-2 mt-0.5">
                <div className="flex items-center space-x-1">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{worker.rating}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-sm text-gray-500">{worker.distance}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Badge className={worker.available 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-gray-50 text-gray-600 border border-gray-200"
          }>
            {worker.available ? "Available" : "Busy"}
          </Badge>
        </div>

        {/* Skills Section */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {worker.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-700 border-gray-200">
                {skill}
              </Badge>
            ))}
            {worker.skills.length > 4 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200">
                +{worker.skills.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">${worker.hourlyRate}</p>
            <p className="text-xs text-gray-500">per hour</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{worker.completedJobs || 0}</p>
            <p className="text-xs text-gray-500">jobs done</p>
          </div>
        </div>

        {/* Response Time */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
          <Clock className="h-3.5 w-3.5" />
          <span>Responds in {worker.responseTime}</span>
          {worker.lastActive && (
            <>
              <span className="text-gray-300">•</span>
              <span>Active {worker.lastActive}</span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 hover:bg-gray-50" 
            onClick={() => onMessage(worker.id)}
          >
            <MessageCircle className="h-4 w-4 mr-1.5" />
            Message
          </Button>
          <Button
            size="sm"
            className={`flex-1 ${
              worker.available 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!worker.available}
            onClick={() => onHire(worker.id)}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Hire
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}