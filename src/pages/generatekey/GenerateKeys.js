import React, { useState } from "react";
import Topbar from "../../components/common/Topbar";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

const GenerateKeys = (props) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [generationTime, setGenerationTime] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const arrayBufferToBase64 = (buffer) => {
    const binary = new Uint8Array(buffer);
    return btoa(String.fromCharCode.apply(null, binary));
  };
  const measureKeyGenerationTime = async (keySize) => {
    const startTime = performance.now(); // Record the starting time

    try {
      // Generate an RSA key pair using specified parameters
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5", // Algorithm name
          modulusLength: keySize, // Key length in bits
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // Public exponent (3)
          hash: "SHA-256", // Hash algorithm for signing
        },
        true, // Whether the keys can be extracted
        ["sign", "verify"] // Key usages
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
      setPublicKey(arrayBufferToBase64(publicKeyArrayBuffer));
      setPrivateKey(arrayBufferToBase64(privateKeyArrayBuffer));

      const endTime = performance.now(); // Record the ending time
      const elapsed = endTime - startTime; // Calculate the elapsed time

      setLoading(false);
      setGenerationTime(elapsed);
      // Log the exported key data, along with the elapsed time
      console.log(arrayBufferToBase64(publicKeyArrayBuffer));
      console.log(arrayBufferToBase64(privateKeyArrayBuffer));
      console.log(elapsed);
    } catch (error) {
      console.error("Key generation error:", error);
    }
  };

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText("");
    setError(false);
    setLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value === "") {
      setHelperText("Please choose a number of bit");
      setError(true);
      return;
    }
    setLoading(true);
    console.log(Number.parseInt(value));
    measureKeyGenerationTime(Number.parseInt(value));
  };

  return (
    <div>
      <Topbar />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <form style={{ width: "100%" }} onSubmit={handleSubmit}>
              <FormControl
                sx={{
                  width: "100%",
                }}
              >
                <Card
                  sx={{
                    backgroundColor: "#f8f8f8f",
                    borderRadius: "20px",
                    padding: "20px",
                  }}
                >
                  <CardContent>
                    <FormLabel id="demo-error-radios">
                      RSA Generate Keys
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-error-radios"
                      name="quiz"
                      value={value}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel
                        value="512"
                        control={<Radio />}
                        label="512"
                      />
                      <FormControlLabel
                        value="1024"
                        control={<Radio />}
                        label="1024"
                      />
                      <FormControlLabel
                        value="2048"
                        control={<Radio />}
                        label="2048"
                      />
                      <FormControlLabel
                        value="4096"
                        control={<Radio />}
                        label="4096"
                      />
                      <FormControlLabel
                        value="8192"
                        control={<Radio />}
                        label="8192"
                      />
                    </RadioGroup>
                    <FormHelperText>{helperText}</FormHelperText>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      sx={{
                        margin: "10px 0",
                        // background: "red",
                        padding: "15px",
                        fontSize: "16px",
                      }}
                      type="submit"
                    >
                      {loading ? (
                        <CircularProgress
                          sx={{
                            "&.MuiCircularProgress-root": {
                              color: "#fff",
                              width: "30px !important",
                              height: "30px !important",
                            },
                          }}
                        />
                      ) : (
                        "Generate Keys"
                      )}
                    </Button>
                  </CardActions>
                </Card>
              </FormControl>
            </form>
          </Grid>
          <Grid item xs={6}>
            {generationTime !== null && loading === false && (
              <p>Key generation time: {generationTime.toFixed(2)} ms</p>
            )}

            {publicKey !== null && loading === false && (
              <div>
                <h2>Public Key</h2>
                <p style={{ overflowWrap: "break-word" }}>{publicKey}</p>
              </div>
            )}
            {privateKey !== null && loading === false && (
              <div>
                <h2>Private Key</h2>
                <p style={{ overflowWrap: "break-word" }}> {privateKey}</p>
              </div>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default GenerateKeys;
