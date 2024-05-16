import React, { useState } from "react";
import axios from "axios";
import GetData from "./GetData";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://studash.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error uploading the file.");
      console.error("Error uploading the file:", error);
    }
  };

  return (
    <>
      <div className="flex mb-4 justify-center items-center pt-[100px]">
        <input type="file" name="file" onChange={handleFileChange} />
        <button
          className="border border-blue-200 bg-blue-300 rounded-lg p-2"
          onClick={handleFileUpload}
        >
          Upload
        </button>
        {message && <p>{message}</p>}
      </div>
      <hr />
      <GetData />
    </>
  );
};

export default UploadCSV;
