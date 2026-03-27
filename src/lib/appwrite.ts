import {
  Account,
  Client,
  ID,
  Permission,
  Query,
  Role,
  TablesDB
} from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint) {
  throw new Error("Missing VITE_APPWRITE_ENDPOINT");
}

if (!projectId) {
  throw new Error("Missing VITE_APPWRITE_PROJECT_ID");
}

export const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);

export { ID, Permission, Query, Role };