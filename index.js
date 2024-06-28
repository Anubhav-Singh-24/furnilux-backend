import express from "express";
import cors from "cors";
import ConnectToDb from "./db.js";
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();
app.use(
  helmet({
    crossOriginEmbedderPolicy: true,
    crossOriginResourcePolicy: { policy: "same-origin" },
    dnsPrefetchControl: { allow: false },
    expectCt: {
      enforce: true,
      maxAge: 86400,
    },
    frameguard: { action: "deny" }, // X-Frame-Options: DENY
    hidePoweredBy: true, // Removes X-Powered-By header
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    }, // Strict-Transport-Security
    ieNoOpen: true, // X-Download-Options: noopen
    noSniff: true, // X-Content-Type-Options: nosniff
    originAgentCluster: true,
    permittedCrossDomainPolicies: {
      permittedPolicies: "none",
    },
    referrerPolicy: { policy: "no-referrer" }, // Referrer-Policy
    xssFilter: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "https://furni-lux.netlify.app", credentials: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

ConnectToDb();
app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
