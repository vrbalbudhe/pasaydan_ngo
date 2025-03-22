import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";

interface FormDataState {
  fullName: string;
  contact: string;
  school: string;
  standard: string;
  area: string;
  driveId: string;
}

const AddParticipantForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormDataState>({
    fullName: "",
    contact: "",
    school: "",
    standard: "",
    area: "",
    driveId: id || "",
  });
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    if (id) setFormData((prevData) => ({ ...prevData, driveId: id }));
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        formDataObj.append(key, value)
      );
      photos.forEach((photo) =>
        formDataObj.append("photos", photo, photo.name)
      );

      const response = await fetch("/api/drive/participants", {
        method: "POST",
        body: formDataObj,
      });
      const data = await response.json();
      if (response.ok) console.log("Participant added successfully!", data);
      else console.error("Error:", data.message);
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Register for Drive
      </h2>
      <div className="space-y-4">
        {Object.keys(formData)
          .slice(0, -1)
          .map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field as keyof FormDataState]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          ))}
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full border rounded-lg p-2"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddParticipantForm;
