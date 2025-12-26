import { chromium } from 'playwright';

export async function POST(req) {
  const { url } = await req.json();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  const data = await page.evaluate(() => {
    const regex = /R\$ ?\d+([.,]\d+)?/;

    return {
      nome:
        document.querySelector('meta[property="og:title"]')?.content ||
        document.querySelector('h1')?.innerText ||
        document.title,
      preco: document.body.innerText.match(regex)?.[0] || null
    };
  });

  await browser.close();

  return Response.json(data);
}
