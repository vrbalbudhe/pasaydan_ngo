"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CopyIcon, CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMessageTemplate } from "@/utils/messageTemplates";

interface Drive {
  id: string;
  title: string;
  location: string;
  startDate: string;
  EndDate: string;
  description: string;
  status: string;
  dtype: string;
  timeInterval: string;
  photos: string[];
  placeLink?: string;
  createdAt: string;
}

interface ContactPerson {
  name: string;
  phone: string;
}

export default function CustomMessageGenerator() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [selectedDriveId, setSelectedDriveId] = useState<string>("");
  const [selectedDrive, setSelectedDrive] = useState<Drive | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState("english");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contacts, setContacts] = useState<ContactPerson[]>([{ name: "", phone: "" }]);
  const { toast } = useToast();

  // Fetch all drives
  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const response = await fetch("/api/drive");
        const data = await response.json();
        setDrives(data);
      } catch (error) {
        console.error("Error fetching drives:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch drives",
        });
      }
    };

    fetchDrives();
  }, []);

  // Fetch selected drive details
  useEffect(() => {
    if (!selectedDriveId) {
      setSelectedDrive(null);
      setMessage("");
      return;
    }

    const fetchDriveDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/drive/${selectedDriveId}`);
        const data = await response.json();
        setSelectedDrive(data);
        generateMessage(data, currentLanguage);
      } catch (error) {
        console.error("Error fetching drive details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch drive details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDriveDetails();
  }, [selectedDriveId]);

  // Generate message based on selected drive and language
  const generateMessage = (drive: Drive, language: string) => {
    if (!drive) return;
    
    // Filter out empty contacts
    const validContacts = contacts.filter(contact => contact.name.trim() !== "" && contact.phone.trim() !== "");
    
    const generatedMessage = getMessageTemplate(drive, language, validContacts);
    setMessage(generatedMessage);
  };

  // Handle language change
  useEffect(() => {
    if (selectedDrive) {
      generateMessage(selectedDrive, currentLanguage);
    }
  }, [currentLanguage, selectedDrive, contacts]);

  // Add contact field
  const addContact = () => {
    setContacts([...contacts, { name: "", phone: "" }]);
  };

  // Remove contact field
  const removeContact = (index: number) => {
    const newContacts = [...contacts];
    newContacts.splice(index, 1);
    setContacts(newContacts);
  };

  // Update contact field
  const updateContact = (index: number, field: "name" | "phone", value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  // Copy message to clipboard
  const copyToClipboard = () => {
    if (!message) return;
    
    navigator.clipboard.writeText(message)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Message has been copied to clipboard",
        });
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy message",
        });
      });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Donation Drive
          </label>
          <Select 
            value={selectedDriveId} 
            onValueChange={setSelectedDriveId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a drive" />
            </SelectTrigger>
            <SelectContent>
              {drives.map((drive) => (
                <SelectItem key={drive.id} value={drive.id}>
                  {drive.title} - {drive.dtype}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedDrive && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Drive Type: {selectedDrive.dtype}</h3>
          <p className="text-sm text-blue-700">
            The message will be customized based on this drive type with relevant messaging to inspire donations.
          </p>
        </div>
      )}

      {/* Contact Persons Section */}
      {selectedDrive && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 className="text-lg font-medium mb-3">Contact Persons (Optional)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add contact details for people managing this drive. These will appear in the message for easy communication.
          </p>

          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="grid gap-2 flex-1">
                  <Label htmlFor={`contact-name-${index}`}>Name</Label>
                  <Input
                    id={`contact-name-${index}`}
                    value={contact.name}
                    onChange={(e) => updateContact(index, "name", e.target.value)}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="grid gap-2 flex-1">
                  <Label htmlFor={`contact-phone-${index}`}>Phone</Label>
                  <Input
                    id={`contact-phone-${index}`}
                    value={contact.phone}
                    onChange={(e) => updateContact(index, "phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-7"
                  onClick={() => removeContact(index)}
                  disabled={contacts.length === 1}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={addContact}
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add Contact Person
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"></div>
        </div>
      ) : selectedDrive ? (
        <div className="space-y-6">
          <Tabs defaultValue="english" value={currentLanguage} onValueChange={setCurrentLanguage}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="english">English</TabsTrigger>
              <TabsTrigger value="marathi">मराठी</TabsTrigger>
              <TabsTrigger value="hindi">हिंदी</TabsTrigger>
            </TabsList>
            
            <TabsContent value="english" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-gray-800 text-sm">
                      {message}
                    </pre>
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="marathi" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-gray-800 text-sm">
                      {message}
                    </pre>
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="hindi" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-gray-800 text-sm">
                      {message}
                    </pre>
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">Message Preview</h3>
            <p className="text-sm text-blue-700">
              This message includes all essential information about your drive formatted for WhatsApp sharing.
              Select your preferred language and click the copy icon to copy the message to your clipboard.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-md text-center">
          <p className="text-gray-500">
            Select a donation drive to generate a custom message
          </p>
        </div>
      )}
    </div>
  );
}