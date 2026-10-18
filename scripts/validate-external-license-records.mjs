import { validateExternalLicenseRecordsFile } from "./external-license-records.mjs";

const document = await validateExternalLicenseRecordsFile(process.argv[2]);
console.log(`validated ${document.records.length} external license records (${document.schemaVersion})`);
