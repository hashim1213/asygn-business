"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"

interface WorkerFiltersProps {
  isOpen: boolean
  onClose: () => void
  filters: {
    availability: string[]
    skills: string[]
    maxDistance: number
    minRating: number
    maxHourlyRate: number
  }
  onFiltersChange: (filters: any) => void
}

export function WorkerFilters({ isOpen, onClose, filters, onFiltersChange }: WorkerFiltersProps) {
  if (!isOpen) return null

  const availabilityOptions = ["Available Now", "Available Today", "Available This Week"]
  const skillOptions = ["Server", "Kitchen", "Bartender", "Cashier", "Customer Service", "Prep", "Manager"]

  const handleAvailabilityChange = (option: string, checked: boolean) => {
    const newAvailability = checked
      ? [...filters.availability, option]
      : filters.availability.filter((item) => item !== option)
    onFiltersChange({ ...filters, availability: newAvailability })
  }

  const handleSkillChange = (skill: string, checked: boolean) => {
    const newSkills = checked ? [...filters.skills, skill] : filters.skills.filter((item) => item !== skill)
    onFiltersChange({ ...filters, skills: newSkills })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      availability: [],
      skills: [],
      maxDistance: 50,
      minRating: 0,
      maxHourlyRate: 50,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filter Workers</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Availability */}
          <div>
            <h4 className="font-medium mb-3">Availability</h4>
            <div className="space-y-2">
              {availabilityOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={filters.availability.includes(option)}
                    onCheckedChange={(checked) => handleAvailabilityChange(option, checked as boolean)}
                  />
                  <label htmlFor={option} className="text-sm">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-medium mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <Badge
                  key={skill}
                  variant={filters.skills.includes(skill) ? "default" : "outline"}
                  className={`cursor-pointer ${filters.skills.includes(skill) ? "bg-orange-600 text-white" : ""}`}
                  onClick={() => handleSkillChange(skill, !filters.skills.includes(skill))}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div>
            <h4 className="font-medium mb-3">Max Distance: {filters.maxDistance} miles</h4>
            <Slider
              value={[filters.maxDistance]}
              onValueChange={([value]) => onFiltersChange({ ...filters, maxDistance: value })}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Rating */}
          <div>
            <h4 className="font-medium mb-3">Minimum Rating: {filters.minRating} stars</h4>
            <Slider
              value={[filters.minRating]}
              onValueChange={([value]) => onFiltersChange({ ...filters, minRating: value })}
              max={5}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Hourly Rate */}
          <div>
            <h4 className="font-medium mb-3">Max Hourly Rate: ${filters.maxHourlyRate}</h4>
            <Slider
              value={[filters.maxHourlyRate]}
              onValueChange={([value]) => onFiltersChange({ ...filters, maxHourlyRate: value })}
              max={50}
              min={10}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={clearAllFilters}>
              Clear All
            </Button>
            <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" onClick={onClose}>
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
