// Zips and uploads the extension to the Chrome Web Store

import { readFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execp = promisify(exec);

const EXTENSION_ID = "edfgbcbepiiknachpjkhknnmfgmacfdk";
const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

console.log("Reading manifest...");
const manifestFile = await readFile("./src/manifest.json", "utf-8");
const manifest = JSON.parse(manifestFile);

const version = manifest.version;

// Generate the Google API token
console.log("Generating token...");
const tokenRes = await fetch(
  "https://accounts.google.com/o/oauth2/token",
  {
    method: "POST",
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token"
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
);
const tokenData = await tokenRes.json();

const accessToken = tokenData.access_token;

console.log("Querying draft info...");
const draftInfoRes = await fetch(
  `https://www.googleapis.com/chromewebstore/v1.1/items/${EXTENSION_ID}?projection=DRAFT`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
);
const draftInfo = await draftInfoRes.json();
const uploadedVersion = draftInfo.crxVersion;

if (uploadedVersion) {
  console.warn("Overwriting exiting uploaded CRX");
}

// Get the current published version of the extension
console.log("Querying published version...");
const detailsRes = await fetch(
  `https://chrome.google.com/webstore/ajax/detail?id=${EXTENSION_ID}&hl=en&pv=20210820`,
  {
    method: "POST"
  }
);
const rawDetails = await detailsRes.text();
// Remove the prefix Google adds to the response
const details = JSON.parse(rawDetails.replace(")]}'", ""));
const [, [, itemDetails]] = details;
const publishedVersion = itemDetails[6];

if (publishedVersion === version) {
  console.error("Version already published");
  process.exit(1);
}

// Zip up the extension
console.log("Zipping...");
await execp("zip -r ../edficiensee.zip .", { cwd: "./src" });
const zipFile = await readFile("./edficiensee.zip");

console.log("Uploading...");
const uploadRes = await fetch(
  `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${EXTENSION_ID}?uploadType=media`,
  {
    method: "PUT",
    body: zipFile,
    headers: {
      "Content-Type": "application/zip",
      Authorization: `Bearer ${accessToken}`,
      "x-goog-api-version": 2
    }
  }
);
const uploadData = await uploadRes.json();

if (uploadData.uploadState === "SUCCESS") {
  console.log(`Successfully uploaded version ${version}.`);
} else {
  console.error("Failed to upload", JSON.stringify(uploadData));
}

// Note: We still need to log in and publish manually