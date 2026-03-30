import { Client, TablesDB, Query, Permission, Role } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  try {
    const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT;
    const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID;
    const apiKey = process.env.APPWRITE_FUNCTION_API_KEY;

    const databaseId = process.env.APPWRITE_DATABASE_ID;
    const postsTableId = process.env.APPWRITE_POSTS_TABLE_ID;
    const adminTeamId = process.env.APPWRITE_ADMIN_TEAM_ID || "";

    if (!endpoint || !projectId || !apiKey) {
      return res.json({ ok: false, error: "Missing Appwrite function auth envs." }, 500);
    }

    if (!databaseId || !postsTableId) {
      return res.json({ ok: false, error: "Missing APPWRITE_DATABASE_ID or APPWRITE_POSTS_TABLE_ID." }, 500);
    }

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const tablesDB = new TablesDB(client);

    const nowIso = new Date().toISOString();

    const result = await tablesDB.listRows({
      databaseId,
      tableId: postsTableId,
      queries: [
        Query.equal("status", ["draft"]),
        Query.lessThanEqual("publishedAt", nowIso),
        Query.limit(100)
      ]
    });

    let updatedCount = 0;

    for (const row of result.rows) {
      const permissions = adminTeamId
        ? [
            Permission.read(Role.any()),
            Permission.update(Role.team(adminTeamId)),
            Permission.delete(Role.team(adminTeamId))
          ]
        : row.$permissions;

      await tablesDB.updateRow({
        databaseId,
        tableId: postsTableId,
        rowId: row.$id,
        data: {
          status: "published",
          updatedAt: new Date().toISOString()
        },
        permissions
      });

      updatedCount += 1;
    }

    log(`Published ${updatedCount} scheduled post(s).`);

    return res.json({
      ok: true,
      published: updatedCount,
      checkedAt: nowIso
    }, 200);
  } catch (err) {
    error(err?.message || String(err));
    return res.json({
      ok: false,
      error: err?.message || "Unexpected server error."
    }, 500);
  }
};