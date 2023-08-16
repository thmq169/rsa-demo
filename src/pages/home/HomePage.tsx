import React from "react";

import assets from "../../assets";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <Box
      sx={{
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontWeight: "unset" }} variant="h6">
        GENERAL CONFEDERATION OF LABOR OF VIETNAM
      </Typography>
      <Typography variant="h6">TON DUC THANG UNIVERSITY</Typography>
      <Typography variant="h6" gutterBottom>
        FACULTY OF INFORMATION TECHNOLOGY
      </Typography>
      <Avatar
        sx={{
          "&": {
            width: "max-content",
            height: "80px",
            margin: "50px auto",
          },
          "& img": {
            width: "100%",
            objectFit: "cover",
          },
        }}
        variant="rounded"
        src={assets.images.logo}
      />
      <Typography variant="h6" gutterBottom>
        FINAL DEMO
        <br />
        INTRODUCTION INFORMATION SECURITY
      </Typography>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "700",
          marginTop: "30px",
        }}
      >
        RSA Algorithm
      </Typography>
      <Box
        sx={{
          textAlign: "right",
          margin: "50px 50px 0 0",
          "& h6": {
            display: "inline-block",
            marginLeft: "10px",
            fontWeight: "600",
          },
        }}
      >
        <Box>
          Instructing Lecturer:
          <Typography variant="h6" gutterBottom>
            PhD BUI QUY ANH
          </Typography>
        </Box>
        <Box>
          Student Name:
          <Typography variant="h6" gutterBottom>
            TO HOANG MINH QUAN - 520H0671
          </Typography>
        </Box>
        <Box>
          Course:
          <Typography variant="h6" gutterBottom>
            24
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
