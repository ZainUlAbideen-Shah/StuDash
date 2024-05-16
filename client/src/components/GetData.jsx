import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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

  useEffect(() => {
    // Function to fetch JSON data from Firestore
    const fetchJsonData = async () => {
      try {
        const dataRef = doc(firestore, "data", "jsonDataDocument");
        const docSnap = await getDoc(dataRef);
        if (docSnap.exists()) {
          // If document exists, extract JSON data
          setJsonData(docSnap.data().data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    // Call the fetchJsonData function when component mounts
    fetchJsonData();
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div>
      <h1>JSON Data from Firestore</h1>
      <ul>
        {jsonData.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default GetData;
