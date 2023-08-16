import React, { useState, useEffect } from "react";
import bigInt from "big-integer";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Topbar from "../../components/common/Topbar";

const Decryption = (props) => {
  const [publicKey, setPublicKey] = useState(null);
  const [publicKeyString, setPublicKeyString] = useState("");
  const [privateKey, setPrivateKey] = useState(null);
  const [privateKeyString, setPrivateKeyString] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPublicKeyString(
      JSON.parse(localStorage.getItem("recipient-public-key")) || ""
    );
    setPrivateKeyString(
      JSON.parse(localStorage.getItem("recipient-private-key")) || ""
    );
    setEncryptedMessage(
      JSON.parse(localStorage.getItem("encrypt-message")) || ""
    );
    setDecryptedMessage(
      JSON.parse(localStorage.getItem("decrypt-message")) || ""
    );
  }, []);

  const arrayBufferToBase64 = (buffer) => {
    const binary = new Uint8Array(buffer);
    return btoa(String.fromCharCode.apply(null, binary));
  };

  const generateKeyPair = async () => {
    localStorage.clear();
    setDecryptedMessage("");
    setEncryptedMessage("");
    // Generate an RSA key pair using specified parameters
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP", // Algorithm name
        modulusLength: 2048, // Key length in bits
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // Public exponent (3)
        hash: { name: "SHA-256" }, // Hash algorithm for OAEP
      },
      true, // Whether the keys can be extracted
      ["encrypt", "decrypt"] // Key usages
    );

    // Export the generated public key in 'spki' format
    const publicKeyArrayBuffer = await crypto.subtle.exportKey(
      "spki", // Export format for public key
      keyPair.publicKey // Public key to export
    );

    // Export the generated private key in 'pkcs8' format
    const privateKeyArrayBuffer = await crypto.subtle.exportKey(
      "pkcs8", // Export format for private key
      keyPair.privateKey // Private key to export
    );

    // Convert the exported key data to base64 and log them
    console.log(arrayBufferToBase64(publicKeyArrayBuffer));
    console.log(arrayBufferToBase64(privateKeyArrayBuffer));
    setPublicKey(keyPair.publicKey);
    setPublicKeyString(arrayBufferToBase64(publicKeyArrayBuffer));
    setPrivateKey(keyPair.privateKey);
    setPrivateKeyString(arrayBufferToBase64(privateKeyArrayBuffer));

    localStorage.setItem(
      "recipient-public-key",
      JSON.stringify(arrayBufferToBase64(publicKeyArrayBuffer))
    );
    localStorage.setItem(
      "recipient-private-key",
      JSON.stringify(arrayBufferToBase64(privateKeyArrayBuffer))
    );
  };

  const decryptMessage = async () => {
    // Convert the base64-encoded encrypted message to an ArrayBuffer
    const encryptedArray = new Uint8Array(
      atob(encryptedMessage)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    // Convert the base64-encoded private key string to a Uint8Array
    const privateKeyBuffer = Uint8Array.from(atob(privateKeyString), (c) =>
      c.charCodeAt(0)
    );

    // Import the recipient's private key using the 'pkcs8' format
    const importedPrivateKey = await crypto.subtle.importKey(
      "pkcs8", // Private key format
      privateKeyBuffer, // Imported key data as Uint8Array
      {
        name: "RSA-OAEP", // Encryption algorithm
        hash: "SHA-256", // Hash algorithm
      },
      false, // Extractable flag
      ["decrypt"] // List of key usages
    );

    setPrivateKey(importedPrivateKey);
    // Decrypt the encrypted data using the imported private key
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP", // Decryption algorithm
      },
      importedPrivateKey, // Imported private key
      encryptedArray // Encrypted data to be decrypted
    );

    // Convert the decrypted ArrayBuffer to a string
    const encoder = new TextDecoder();
    const decryptedMessage = encoder.decode(decryptedBuffer);

    // Log the decrypted message
    console.log(decryptedMessage);
    setDecryptedMessage(decryptedMessage);
    localStorage.setItem("decrypt-message", JSON.stringify(decryptedMessage));
  };

  return (
    <Paper>
      <Topbar />
      <Box
        sx={{
          padding: "20px",
        }}
      >
        <Box sx={{ marginBottom: "20px" }}>
          <Button variant="contained" onClick={generateKeyPair}>
            Generate Pair Key
          </Button>
          <Button
            variant="contained"
            onClick={decryptMessage}
            sx={{ marginLeft: "20px" }}
          >
            Decrypt
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ paddingRight: "10px" }}>
            <div>
              <div>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "700" }}
                >
                  Decrypted Message:
                </Typography>
                <div>
                  <p style={{ overflowWrap: "break-word", marginTop: 0 }}>
                    {decryptedMessage}
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
                  Generated Private Key:
                </Typography>
                {privateKeyString !== null && (
                  <div>
                    <p style={{ overflowWrap: "break-word", marginTop: 0 }}>
                      {privateKeyString}
                    </p>
                  </div>
                )}
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
                  Generated Public Key:
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

export default Decryption;
