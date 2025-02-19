import React, { useState } from "react";
import axios from "axios";

export default function UserSearch({ onUserSelected }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const userWithToken = JSON.parse(localStorage.getItem("userWithToken"));
      const token = userWithToken?.token; // Récupérer le token JWT

      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.get(
        `http://localhost:8081/api/users/search?q=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token JWT
          },
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a user..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((user) => (
          <li key={user.id} onClick={() => onUserSelected(user)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
