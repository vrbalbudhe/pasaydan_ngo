import React, { useState, useRef } from "react";
import { Camera, Upload, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddParticipantsForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    school: "",
    standard: "",
    area: "",
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startCamera = async () => {
    try {
      // Check if the browser supports media devices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera access is not supported on this browser.");
        return;
      }

      // Request permission explicitly
      const permissions = await navigator.permissions.query({ name: "camera" });
      if (permissions.state === "denied") {
        alert("Camera permission is denied. Please enable it in settings.");
        return;
      }

      // Camera constraints (adjust for better compatibility)
      const constraints = {
        video: {
          facingMode: "environment", // Use "user" for the front camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      // Start the camera
      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
      setShowCamera(true);
    } catch (err: any) {
      console.error("Camera error:", err);
      alert(`Camera error: ${err.name} - ${err.message}`);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const photoUrl = canvas.toDataURL("image/jpeg");
      setPhotos((prevPhotos) => [...prevPhotos, photoUrl]);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
    setStream(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newPhotos: string[] = [];

      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result && typeof reader.result === "string") {
            newPhotos.push(reader.result);
            if (newPhotos.length === filesArray.length) {
              setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/drive/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, photos }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Participant added successfully!", data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-y-visible">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Participants Registration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            className="w-full"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Contact Number</Label>
          <Input
            id="contact"
            type="tel"
            placeholder="Enter contact number"
            className="w-full"
            value={formData.contact}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="school">School Name</Label>
          <Input
            id="school"
            placeholder="Enter school name"
            className="w-full"
            value={formData.school}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="standard">Standard/Class</Label>
          <Input
            id="standard"
            placeholder="Enter your class"
            className="w-full"
            value={formData.standard}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="area">Area</Label>
          <Input
            id="area"
            placeholder="Enter your area"
            className="w-full"
            value={formData.area}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Photos</Label>
          <div className="flex flex-wrap gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={photo}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          {showCamera ? (
            <div>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto rounded-lg"
              />
              <Button onClick={capturePhoto}>Capture</Button>
              <Button variant="outline" onClick={stopCamera}>
                Close Camera
              </Button>
            </div>
          ) : (
            <div className="flex md:flex-row flex-col gap-2 md:gap-4">
              <Button onClick={startCamera}>
                <Camera className="w-4 h-4 mr-2" />
                Open Camera
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </div>
          )}
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Submit Registration
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddParticipantsForm;
