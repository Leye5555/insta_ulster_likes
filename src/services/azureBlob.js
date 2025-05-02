const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} = require("@azure/storage-blob");

require("dotenv").config();
const sharedKeyCredential = new StorageSharedKeyCredential(
  process.env.AZURE_STORAGE_ACCOUNT_NAME,
  process.env.AZURE_STORAGE_ACCOUNT_KEY
);

const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  sharedKeyCredential
);

const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_CONTAINER_NAME
);

function getAzureBlobSAS() {
  const sas = generateBlobSASQueryParameters(
    {
      containerName: process.env.AZURE_CONTAINER_NAME,
      permissions: "r",
      startsOn: new Date(),
      expiresOn: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour
    },
    sharedKeyCredential
  );
  return sas;
}

async function verifySasToken(sas_token) {
  try {
    // Try listing blobs as a simple check
    const sasUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${sas_token}`;
    const _blobServiceClient = new BlobServiceClient(
      sasUrl,
      sharedKeyCredential
    );
    const _containerClient = _blobServiceClient.getContainerClient(
      process.env.AZURE_CONTAINER_NAME
    );
    for await (const blob of _containerClient.listBlobsFlat()) {
      // If we can list blobs, token is valid
      console.log("Token is valid");
      return true;
    }
  } catch (err) {
    // If we get an error, token is likely invalid or expired
    console.error("Token is invalid or expired:", err.message);
    return false;
  }
}

module.exports = { containerClient, getAzureBlobSAS, verifySasToken };
