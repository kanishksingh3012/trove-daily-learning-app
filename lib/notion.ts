const NOTION_API_BASE = "https://api.notion.com/v1";

function getNotionToken(): string {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error("NOTION_TOKEN is not set");
  }
  return token;
}

export async function getPageMarkdown(pageId: string): Promise<string> {
  throw new Error("Not implemented");
}

export async function updatePageMarkdown(
  pageId: string,
  markdown: string
): Promise<void> {
  throw new Error("Not implemented");
}
