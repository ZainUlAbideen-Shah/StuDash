import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config here
  apiKey: "AIzaSyC6C3PBs_8s4D4vL-ViI2tiN0A3StFjwIE",
  authDomain: "studash-69952.firebaseapp.com",
  databaseURL: "https://studash-69952-default-rtdb.firebaseio.com",
  projectId: "studash-69952",
  storageBucket: "studash-69952.appspot.com",
  messagingSenderId: "824733926731",
  appId: "1:824733926731:web:049ad47c0917b5c1ced4ce",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore from the Firebase app instance
const firestore = getFirestore(app);

const GetData = () => {
  const [jsonData, setJsonData] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const dataRef = doc(firestore, "data", "jsonDataDocument");

    // Real-time listener for Firestore data
    const unsubscribe = onSnapshot(dataRef, (docSnap) => {
      if (docSnap.exists()) {
        // If document exists, extract JSON data
        setJsonData(docSnap.data().data);
      } else {
        console.log("No such document!");
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleEditClick = (index) => {
    setIsEditing(index);
    setEditData(jsonData[index]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditSave = async (index) => {
    const updatedData = [...jsonData];
    updatedData[index] = editData;

    try {
      const dataRef = doc(firestore, "data", "jsonDataDocument");
      await updateDoc(dataRef, { data: updatedData });
      setJsonData(updatedData);
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleDelete = async (index) => {
    const updatedData = jsonData.filter((_, i) => i !== index);

    try {
      const dataRef = doc(firestore, "data", "jsonDataDocument");
      await updateDoc(dataRef, { data: updatedData });
      setJsonData(updatedData);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const orderedKeys = ["name", "id", "age", "gender", "language.grade"];

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          {orderedKeys.map((key) => (
            <th key={key}>{key}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
    );
  };

  const renderTableBody = (data) => {
    return (
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {orderedKeys.map((key, i) => (
              <td key={i}>
                {isEditing === index ? (
                  <input
                    type="text"
                    name={key}
                    value={editData[key] || ""}
                    onChange={handleEditChange}
                  />
                ) : (
                  JSON.stringify(item[key])
                )}
              </td>
            ))}
            <td>
              {isEditing === index ? (
                <>
                  <button onClick={() => handleEditSave(index)}>Save</button>
                  <button onClick={() => setIsEditing(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEditClick(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div>
      <h1>JSON Data from Firestore</h1>
      {jsonData.length > 0 ? (
        <table>
          {renderTableHeader()}
          {renderTableBody(jsonData)}
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default GetData;
