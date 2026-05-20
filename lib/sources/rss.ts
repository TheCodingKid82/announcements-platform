export async function fetchRssItems(feedUrl: string) {
  const response = await fetch(feedUrl, { next: { revalidate: 60 } });
  const xml = await response.text();
  const titles = Array.from(xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/g)).slice(1, 6);
  return titles.map((match, index) => ({ id: `rss_${index}`, title: match[1] ?? match[2] ?? "Untitled item" }));
}
