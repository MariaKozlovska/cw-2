import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button, Avatar } from "@mui/material";

export default function ProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(storedUser.name || "");
  const [email, setEmail] = useState(storedUser.email || "");
  const [photo, setPhoto] = useState(storedUser.photo || null);

  // При зміні — зберігаємо у localStorage
  useEffect(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...storedUser,
        name,
        email,
        photo,
      })
    );
  }, [name, email, photo]);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  return (
    <Box
      sx={{
        maxWidth: 520,
        mx: "auto",
        mt: 4,
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: 600, mb: 3 }}
      >
        Profile
      </Typography>

      <Paper sx={{ p: 3, textAlign: "center" }}>
        {/* Фото */}
        <Avatar
          src={photo || ""}
          sx={{
            width: 120,
            height: 120,
            mx: "auto",
            mb: 2,
            bgcolor: "#e5e7eb",
            fontSize: 40,
          }}
        >
          {!photo ? "👤" : ""}
        </Avatar>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
          <Button variant="contained" component="label" sx={{ textTransform: "none" }}>
            Upload Photo
            <input hidden type="file" accept="image/*" onChange={handlePhotoUpload} />
          </Button>

          {photo && (
            <Button
              variant="outlined"
              color="error"
              onClick={removePhoto}
              sx={{ textTransform: "none" }}
            >
              Remove
            </Button>
          )}
        </Box>

        {/* Імʼя */}
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Email */}
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Paper>
    </Box>
  );
}
