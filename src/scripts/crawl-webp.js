import puppeteer from "puppeteer";
import fs from "fs";
import https from "https";
import path from "path";

const url_watch = "https://hoathinh3d.co/kiem-lai-phan-2";
const SAVE_DIR = "./assets";

if (!fs.existsSync(SAVE_DIR)) {
  fs.mkdirSync(SAVE_DIR, { recursive: true });
}

/* ===== DOWNLOAD FILE ===== */
const download = (url, filePath) =>
  new Promise((resolve) => {
    const file = fs.createWriteStream(filePath);
    https
      .get(url, (res) => {
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("✅ Saved:", filePath);
          resolve();
        });
      })
      .on("error", () => resolve());
  });

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url_watch, { waitUntil: "networkidle2" });

  /* ===== SCROLL XUỐNG ===== */
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  /* ===== CLICK "XEM BÌNH LUẬN" ===== */
  try {
    await page.waitForSelector(".wpd-load-comments", { timeout: 5000 });
    await page.click(".wpd-load-comments");
    console.log("💬 Click 'Xem bình luận'");
  } catch {
    console.log("⚠️ Không thấy class, thử click theo text...");

    const buttons = await page.$$("button, a");

    for (const b of buttons) {
      const text = await page.evaluate(el => el.innerText, b);
      if (text && text.toLowerCase().includes("xem")) {
        await b.click();
        console.log("💬 Click bằng text:", text);
        break;
      }
    }
  }

  await new Promise(r => setTimeout(r, 3000));
  let total = 20;

  /* ===== LOOP LOAD MORE COMMENTS ===== */
  while (total >= 20 && total < 40) {
    try {
      const btn = await page.$(".wpd-load-more-submit");

      if (!btn) {
        console.log("✅ Hết nút load thêm");
        break;
      }

      await btn.click();
      console.log("➕ Load thêm bình luận");
      total++;
      await new Promise(r => setTimeout(r, 3000));
    } catch {
      break;
    }
  }

  /* ===== SCROLL LẦN CUỐI ===== */
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await new Promise(r => setTimeout(r, 3000));

  /* ===== LẤY GIF ===== */
  const gifs = await page.$$eval("img", (imgs) =>
    imgs
      .map((img) => img.src)
      .filter((src) => {
      if (!src) return false;
      const s = src.toLowerCase();
      return s.includes(".gif") || s.includes(".webp");
    })
  );

  const uniqueGifs = [...new Set(gifs)];

  console.log("🎯 Found GIF:", uniqueGifs.length);

  /* ===== DOWNLOAD ===== */
  let index = 0;
  for (const img of uniqueGifs) {
  const urlObj = new URL(img);
  const fileName = path.basename(urlObj.pathname); // lấy tên từ URL
  const file = path.join(SAVE_DIR, fileName);

  await download(img, file);
}

  await browser.close();
})();