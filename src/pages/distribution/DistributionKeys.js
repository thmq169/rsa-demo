import React, { useState, useEffect } from "react";
import Topbar from "../../components/common/Topbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const DistributionKeys = (props) => {
  const [message, setMessage] = useState("To Hoang Minh Quan");
  const [senderPrivateKey, setSenderPrivateKey] = useState("");
  const [senderPublicKey, setSenderPublicKey] = useState("");
  const [senderPrivateKeyString, setSenderPrivateKeyString] = useState("");
  const [senderPublicKeyString, setSenderPublicKeyString] = useState("");
  const [recipientPrivateKey, setRecipientPrivateKey] = useState("");
  const [recipientPublicKey, setRecipientPublicKey] = useState("");
  const [recipientPrivateKeyString, setRecipientPrivateKeyString] =
    useState("");
  const [recipientPublicKeyString, setRecipientPublicKeyString] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState(false);

  function createData(name, publicKey, privateKey) {
    return { name, publicKey, privateKey };
  }

  const rows = [
    createData("Public Key", senderPublicKeyString, recipientPublicKeyString),
    createData(
      "Private Key",
      senderPrivateKeyString,
      recipientPrivateKeyString
    ),
  ];

  const arrayBufferToBase64 = (buffer) => {
    const binary = new Uint8Array(buffer);
    return btoa(String.fromCharCode.apply(null, binary));
  };

  useEffect(() => {
    generateKeyPairs(2048);
  }, []);

  const generateKeyPairs = async (keySize) => {
    const senderKeyPair = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: keySize,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-256" },
      },
      true,
      ["sign", "verify"]
    );

    const recipientKeyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: keySize,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-256" },
      },
      true,
      ["encrypt", "decrypt"]
    );

    const senderPublicKeyArrayBuffer = await crypto.subtle.exportKey(
      "spki",
      senderKeyPair.publicKey
    );
    const senderPrivateKeyArrayBuffer = await crypto.subtle.exportKey(
      "pkcs8",
      senderKeyPair.privateKey
    );

    const recipientPublicKeyArrayBuffer = await crypto.subtle.exportKey(
      "spki",
      recipientKeyPair.publicKey
    );
    const recipientPrivateKeyArrayBuffer = await crypto.subtle.exportKey(
      "pkcs8",
      recipientKeyPair.privateKey
    );

    setSenderPrivateKey(senderKeyPair.privateKey);
    setSenderPublicKey(senderKeyPair.publicKey);
    setSenderPrivateKeyString(arrayBufferToBase64(senderPrivateKeyArrayBuffer));
    setSenderPublicKeyString(arrayBufferToBase64(senderPublicKeyArrayBuffer));

    setRecipientPrivateKey(recipientKeyPair.privateKey);
    setRecipientPublicKey(recipientKeyPair.publicKey);
    setRecipientPrivateKeyString(
      arrayBufferToBase64(recipientPrivateKeyArrayBuffer)
    );
    setRecipientPublicKeyString(
      arrayBufferToBase64(recipientPublicKeyArrayBuffer)
    );
  };

  const signAndEncrypt = async () => {
    setDecryptedMessage("");
    setVerified(false);
    // Convert the message string to an ArrayBuffer using TextEncoder
    const encoder = new TextEncoder();
    const messageBuffer = encoder.encode(message);

    // Sign the message using the sender's private key
    const signatureBuffer = await crypto.subtle.sign(
      {
        name: "RSASSA-PKCS1-v1_5", // Signing algorithm
      },
      senderPrivateKey, // Sender's private key
      messageBuffer // Message to sign
    );

    // Encrypt the message using the recipient's public key
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP", // Encryption algorithm
      },
      recipientPublicKey, // Recipient's public key
      messageBuffer // Message to encrypt
    );

    // Convert the signature and encrypted message to base64 strings
    const signatureArray = new Uint8Array(signatureBuffer);
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray));

    const encryptedArray = new Uint8Array(encryptedBuffer);
    const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));

    console.log(signatureBase64); // Log the signature
    console.log(encryptedBase64); // Log the encrypted message
    setSignature(signatureBase64);
    setEncryptedMessage(encryptedBase64);
  };

  const decryptAndVerify = async () => {
    // Decrypt the encrypted message using the recipient's private key
    const encryptedArray = new Uint8Array(
      atob(encryptedMessage)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP", // Decryption algorithm
      },
      recipientPrivateKey, // Recipient's private key
      encryptedArray // Encrypted data to be decrypted
    );

    // Convert the decrypted ArrayBuffer to a string
    const encoder = new TextDecoder();
    const decryptedMessage = encoder.decode(decryptedBuffer);
    setDecryptedMessage(decryptedMessage);

    // Verify the signature using the sender's public key
    const signatureArray = new Uint8Array(
      atob(signature)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    const isValid = await crypto.subtle.verify(
      {
        name: "RSASSA-PKCS1-v1_5", // Verification algorithm
      },
      senderPublicKey, // Sender's public key
      signatureArray, // Signature to verify
      decryptedBuffer // Data to verify against the signature
    );

    setVerified(isValid);
    console.log(decryptedMessage); // Log the decrypted message
    console.log(isValid); // Log whether the signature is valid
  };

  return (
    <div>
      <Topbar />
      <Paper sx={{ marginBottom: "10px", padding: "0 20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ paddingRight: "10px" }}>
            <div style={{ margin: "30px" }}>
              <Typography variant="h6" gutterBottom>
                Sign and Encrypt
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
                <Button variant="contained" onClick={signAndEncrypt}>
                  Sign and Encrypt
                </Button>
              </Box>
              <div>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: "700" }}
                >
                  Encrypted Message:
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ overflowWrap: "break-word" }}
                >
                  {encryptedMessage}
                </Typography>
              </div>
              <div>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: "700" }}
                >
                  Signature:
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ overflowWrap: "break-word" }}
                >
                  {signature}
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div style={{ margin: "30px" }}>
              <Typography variant="h6" gutterBottom>
                Decrypt and Verify
              </Typography>
              <Box sx={{ margin: "20px 0" }}>
                <Button onClick={decryptAndVerify} variant="contained">
                  Decrypt and Verify
                </Button>
              </Box>

              <Typography
                variant="body1"
                gutterBottom
                sx={{ fontWeight: "700" }}
              >
                Decrypted Message: {decryptedMessage}
              </Typography>

              <Typography
                variant="body1"
                gutterBottom
                sx={{ fontWeight: "700" }}
              >
                Signature:
                {verified ? (
                  <span style={{ color: "green" }}> Verified </span>
                ) : (
                  <span style={{ color: "red" }}> Not Verified </span>
                )}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer
        sx={{ width: "100%", maxHeight: "440" }}
        component={Paper}
      >
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Keys</TableCell>
              <TableCell>Sender</TableCell>
              <TableCell>Recipient</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  sx={{ width: "10%", verticalAlign: "top" }}
                  component="th"
                  scope="row"
                >
                  {row.name}
                </TableCell>
                <TableCell sx={{ width: "45%" }}>
                  <p style={{ overflowWrap: "break-word", width: "400px" }}>
                    {row.publicKey}
                  </p>
                </TableCell>
                <TableCell sx={{ width: "45%" }}>
                  <p style={{ overflowWrap: "break-word", width: "400px" }}>
                    {row.privateKey}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DistributionKeys;
