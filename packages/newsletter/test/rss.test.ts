import { afterEach, describe, expect, it, vi } from "vitest";
import { collectRssArticles, verifyRssSources } from "../src/collect/rss";

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Robotics Feed</title>
    <item>
      <title>Robots learn safer navigation</title>
      <link>https://example.com/robots-navigation</link>
      <description><![CDATA[<p>A lab showed a robot navigation system that handles crowded hallways and doesn&#039;t cut words in weird places.</p>]]></description>
      <media:thumbnail url="https://example.com/robots-navigation.jpg" />
      <pubDate>Mon, 04 May 2026 12:00:00 GMT</pubDate>
    </item>
    <item>
      <title>General AI benchmark improves</title>
      <link>https://example.com/general-ai</link>
      <description>This is about benchmark math without machines in the physical world.</description>
      <pubDate>Mon, 04 May 2026 13:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

describe("RSS collection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches RSS feeds and maps entries to newsletter articles", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(feed, {
            status: 200,
            headers: { "content-type": "application/rss+xml" },
          }),
      ),
    );

    const articles = await collectRssArticles([
      {
        key: "robotics-feed",
        name: "Robotics Feed",
        type: "rss",
        url: "https://example.com/feed.xml",
      },
    ]);

    expect(articles).toEqual([
      expect.objectContaining({
        title: "Robots learn safer navigation",
        url: "https://example.com/robots-navigation",
        source: "Robotics Feed",
        imageUrl: "https://example.com/robots-navigation.jpg",
        summary:
          "A lab showed a robot navigation system that handles crowded hallways and doesn't cut words in weird places.",
      }),
    ]);
  });

  it("reports source verification failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );

    const results = await verifyRssSources([
      {
        key: "broken",
        name: "Broken Feed",
        type: "rss",
        url: "https://example.com/feed.xml",
      },
    ]);

    expect(results).toEqual([
      {
        key: "broken",
        ok: false,
        count: 0,
        error: "HTTP 500 while fetching https://example.com/feed.xml",
      },
    ]);
  });
});
