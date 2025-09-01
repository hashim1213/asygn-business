"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Plus } from "lucide-react"

interface WorkerSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onFilterClick: () => void
  onInviteWorker: () => void
}

export function WorkerSearch({ searchQuery, onSearchChange, onFilterClick, onInviteWorker }: WorkerSearchProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search workers by name or skills..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline" onClick={onFilterClick}>
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
      <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={onInviteWorker}>
        <Plus className="h-4 w-4 mr-2" />
        Invite Worker
      </Button>
    </div>
  )
}
