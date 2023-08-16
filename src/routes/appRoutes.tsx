import HomePage from "../pages/home/HomePage";
import { RouteType } from "./config";
import Encryption from "../pages/encrypt/Encryption";
import Decryption from "../pages/decrypt/Decryption";
import GenerateKeys from "../pages/generatekey/GenerateKeys";
import DistributionKeys from "../pages/distribution/DistributionKeys";
import KeyIcon from "@mui/icons-material/Key";
import SecurityIcon from "@mui/icons-material/Security";
import MailLockIcon from "@mui/icons-material/MailLock";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },
  {
    path: "/encryption",
    element: <Encryption />,
    state: "encryption",
    sidebarProps: {
      displayText: "Encryption (Alice)",
      icon: <MailLockIcon />,
    },
  },
  {
    path: "/decryption",
    element: <Decryption />,
    state: "decryption",
    sidebarProps: {
      displayText: "Decryption (Bob)",
      icon: <MarkEmailReadIcon />,
    },
  },
  {
    path: "/generate-keys",
    element: <GenerateKeys />,
    state: "generate-keys",
    sidebarProps: {
      displayText: "Generate Keys",
      icon: <KeyIcon />,
    },
  },
  {
    path: "/distribution",
    element: <DistributionKeys />,
    state: "distribution",
    sidebarProps: {
      displayText: "Distribution Keys",
      icon: <SecurityIcon />,
    },
  },
];

export default appRoutes;
