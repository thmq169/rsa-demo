import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Topbar from "../../components/common/Topbar";

const Encryption = (props) => {
  const [publicKeyString, setPublicKeyString] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [message, setMessage] = useState("");

  const getRecipientPublicKey = () => {
    setPublicKeyString(
      JSON.parse(localStorage.getItem("recipient-public-key"))
    );
  };

  const encryptMessage = async () => {
    // Convert the base64-encoded public key string to an ArrayBuffer
    const publicKeyData = new Uint8Array(
      atob(publicKeyString)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    // Import the recipient's public key using the 'spki' format
    const publicKeyOrigin = await crypto.subtle.importKey(
      "spki", // Public key format
      publicKeyData, // Imported key data as ArrayBuffer
      {
        name: "RSA-OAEP", // Encryption algorithm
        hash: "SHA-256", // Hash algorithm
      },
      false, // Extractable flag
      ["encrypt"] // List of key usages
    );

    // Convert the message string to an ArrayBuffer using TextEncoder
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // Encrypt the data using the imported public key
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP", // Encryption algorithm
      },
      publicKeyOrigin, // Imported public key
      data // Data to be encrypted
    );

    // Convert the encrypted ArrayBuffer to a base64-encoded string
    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
    const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));

    // Log the encrypted message in base64 format
    console.log(encryptedBase64);
    setEncryptedMessage(encryptedBase64);
    localStorage.setItem("encrypt-message", JSON.stringify(encryptedBase64));
    localStorage.setItem("message", JSON.stringify(message));
  };

  useEffect(() => {
    setEncryptedMessage(
      JSON.parse(localStorage.getItem("encrypt-message")) || ""
    );
    setMessage(JSON.parse(localStorage.getItem("message")) || "");
  }, []);

  return (
    <Paper>
      <Topbar />
      <Box
        sx={{
          padding: "20px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={9} sx={{ paddingRight: "10px" }}>
            <div>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "700" }}>
                Encrypt Message
              </Typography>
              <Box sx={{ margin: "20px 0", display: "flex" }}>
                <TextField
                  sx={{ marginRight: "10px", flexGrow: 1 }}
                  onChange={(e) => setMessage(e.target.value)}
                  id="outlined-basic"
                  value={message}
                  label="Write message"
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={encryptMessage}
                  sx={{ marginRight: "10px" }}
                >
                  Encrypt and Send
                </Button>
                <Button variant="contained" onClick={getRecipientPublicKey}>
                  Get Recipient Public Key (Bob)
                </Button>
              </Box>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ paddingRight: "10px" }}>
            <div>
              <div>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "700" }}
                >
                  Encrypted Message:
                </Typography>
                <div>
                  <p style={{ overflowWrap: "break-word", marginTop: 0 }}>
                    {encryptedMessage}
                  </p>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={6} sx={{ paddingRight: "10px" }}>
            <div>
              <div>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "700" }}
                >
                  Recipient Public Key (Bob):
                </Typography>
                {publicKeyString !== null && (
                  <div>
                    <p style={{ overflowWrap: "break-word", marginTop: 0 }}>
                      {publicKeyString}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Encryption;
