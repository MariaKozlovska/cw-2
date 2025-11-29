// src/pages/Profile.jsx
import React, { useState } from "react";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "",
    email: "",
    avatar: null,
  };

  const [name, setName] = useState(storedUser.name);
  const [email, setEmail] = useState(storedUser.email);
  const [avatar, setAvatar] = useState(storedUser.avatar);

  const handleSave = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ name, email, avatar })
    );
    alert("Профіль збережено ✔️");
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page fade-in">
      <h2>Profile</h2>

      <div className="profile-content">
        <img
          src={avatar || "/default-avatar.png"}
          alt="avatar"
          className="profile-avatar"
        />

        <label className="avatar-upload">
          Змінити фото
          <input type="file" accept="image/*" onChange={handleAvatar} />
        </label>

        <input
          className="profile-input"
          value={name}
          placeholder="Ваше імʼя"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="profile-input"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="profile-save" onClick={handleSave}>
          Зберегти
        </button>
      </div>
    </div>
  );
}
