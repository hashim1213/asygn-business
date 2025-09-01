"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Building, 
  Bell, 
  MapPin, 
  CreditCard, 
  Users, 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Globe,
  Phone,
  Mail,
  Clock,
  Plus
} from "lucide-react"

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("business")
  const [verificationStatus, setVerificationStatus] = useState({
    businessInfo: true,
    documents: false,
    banking: false,
    identity: true
  })

  const tabs = [
    { key: "business", label: "Business Profile", icon: Building },
    { key: "verification", label: "Verification", icon: Shield },
    { key: "locations", label: "Locations", icon: MapPin },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "billing", label: "Billing", icon: CreditCard },
    { key: "team", label: "Team Management", icon: Users },
  ]

  const renderVerificationBadge = (status: boolean) => (
    <Badge className={`ml-2 ${status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
      {status ? (
        <>
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </>
      ) : (
        <>
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </>
      )}
    </Badge>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "business":
        return (
          <div className="space-y-8">
            {/* Business Logo & Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                Business Information
                {renderVerificationBadge(verificationStatus.businessInfo)}
              </h3>
              
              <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-20 w-20 border-2 border-gray-200">
                  <AvatarImage src="/abstract-business-logo.png" alt="Business Logo" />
                  <AvatarFallback className="bg-orange-100 text-orange-600 text-lg font-semibold">
                    DR
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="mb-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-gray-500">PNG, JPG up to 2MB. Square format recommended.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="legalBusinessName">Legal Business Name *</Label>
                  <Input id="legalBusinessName" placeholder="As registered with government" defaultValue="Downtown Restaurant Group LLC" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbaName">DBA / Trade Name</Label>
                  <Input id="dbaName" placeholder="Doing business as..." defaultValue="Downtown Restaurant Group" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessRegNumber">Business Registration Number *</Label>
                  <Input id="businessRegNumber" placeholder="State registration number" defaultValue="LLC-123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Federal Tax ID (EIN) *</Label>
                  <Input id="taxId" placeholder="XX-XXXXXXX" defaultValue="12-3456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry Category *</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Food & Beverage</option>
                    <option>Retail</option>
                    <option>Hospitality</option>
                    <option>Healthcare</option>
                    <option>Events & Entertainment</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>LLC</option>
                    <option>Corporation</option>
                    <option>Partnership</option>
                    <option>Sole Proprietorship</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Business Description */}
            <div className="space-y-4">
              <Label htmlFor="description">Business Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your business, services, and what makes you unique..."
                defaultValue="A premier restaurant group operating multiple locations across the city, specializing in fine dining and exceptional service. We focus on creating memorable experiences through quality cuisine and professional hospitality."
                rows={4}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="businessPhone" className="pl-10" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="businessEmail" className="pl-10" defaultValue="contact@restaurant.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="website" className="pl-10" placeholder="https://yourwebsite.com" defaultValue="https://downtonrestaurant.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Year Established</Label>
                  <Input id="foundedYear" placeholder="YYYY" defaultValue="2018" />
                </div>
              </div>
            </div>

            {/* Business Address */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Business Address</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address *</Label>
                  <Input id="streetAddress" defaultValue="123 Main Street" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" defaultValue="Brandon" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Province/State *</Label>
                    <Input id="state" defaultValue="MB" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input id="postalCode" defaultValue="R7A 1A1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Size */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Number of Employees</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-500</option>
                    <option>500+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locations">Number of Locations</Label>
                  <Input id="locations" type="number" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Pacific Time (PT)</option>
                  </select>
                </div>
              </div>
            </div>

            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Save Business Information
            </Button>
          </div>
        )

      case "verification":
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Business Verification Required</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Complete verification to access all features and build trust with workers. This process typically takes 1-3 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
              
              <div className="grid gap-6">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium">Business License</h4>
                        <p className="text-sm text-gray-600">Current business license or registration certificate</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderVerificationBadge(false)}
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium">Tax Documents</h4>
                        <p className="text-sm text-gray-600">EIN confirmation letter or tax filing</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderVerificationBadge(false)}
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium">Proof of Address</h4>
                        <p className="text-sm text-gray-600">Utility bill or lease agreement</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderVerificationBadge(true)}
                      <Badge className="bg-green-100 text-green-700">Uploaded</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium">Identity Verification</h4>
                        <p className="text-sm text-gray-600">Government-issued ID for business owner</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderVerificationBadge(true)}
                      <Badge className="bg-green-100 text-green-700">Verified</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Banking Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                Banking Information
                {renderVerificationBadge(false)}
              </h3>
              
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Banking Setup Required</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      Add your business banking information to receive payouts and manage transactions.
                    </p>
                    <Button className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white" size="sm">
                      Connect Bank Account
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Verification Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Verification Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Business Information</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Complete</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Identity Verification</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Complete</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Document Review</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">In Review</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Banking Setup</span>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600">Pending</Badge>
                </div>
              </div>
            </div>
          </div>
        )

      case "locations":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Business Locations</h3>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            </div>

            <div className="grid gap-4">
              {[
                { name: "Downtown Restaurant", address: "123 Main St, Brandon, MB", active: true, type: "Primary" },
                { name: "Uptown Bistro", address: "456 Oak Ave, Brandon, MB", active: true, type: "Branch" },
                { name: "City Convention Center", address: "789 Convention Blvd, Brandon, MB", active: false, type: "Event Venue" },
              ].map((location, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{location.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {location.type}
                          </Badge>
                          {location.active && (
                            <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {location.address}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch defaultChecked={location.active} />
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { title: "Urgent Shift Alerts", desc: "Get notified when shifts need immediate filling", enabled: true },
                  { title: "Staff Check-in Updates", desc: "Receive updates when staff check in/out", enabled: true },
                  { title: "Worker Applications", desc: "New worker applications and responses", enabled: true },
                  { title: "Weekly Performance Reports", desc: "Weekly summaries of your staffing metrics", enabled: false },
                  { title: "Payment Notifications", desc: "Transaction confirmations and payment updates", enabled: true },
                  { title: "System Maintenance", desc: "Platform updates and scheduled maintenance", enabled: false }
                ].map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.desc}</p>
                    </div>
                    <Switch defaultChecked={notification.enabled} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
              <div className="space-y-4">
                {[
                  { title: "Real-time Alerts", desc: "Instant notifications for urgent matters", enabled: true },
                  { title: "Daily Summaries", desc: "Daily overview of your operations", enabled: true },
                  { title: "Shift Reminders", desc: "Reminders for upcoming shifts", enabled: false }
                ].map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.desc}</p>
                    </div>
                    <Switch defaultChecked={notification.enabled} />
                  </div>
                ))}
              </div>
            </div>

            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Save Notification Settings
            </Button>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">Settings for {activeTab} will be available soon.</p>
          </div>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card className="shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center text-xl">
                {(() => {
                  const activeTabData = tabs.find((tab) => tab.key === activeTab)
                  const Icon = activeTabData?.icon || Building
                  return (
                    <>
                      <Icon className="w-6 h-6 mr-3 text-orange-500" />
                      {activeTabData?.label}
                    </>
                  )
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}