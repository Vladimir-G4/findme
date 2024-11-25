const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();

router.post('/voter-record', async (req, res) => {

  const { firstName, lastName, state } = req.body;

  if (!firstName || !lastName || !state) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://stevemorse.org/voterrecords/voterrecords.html', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await page.waitForSelector('input[name="firstnameMax"]', { timeout: 30000 });

    await page.fill('input[name="firstnameMax"]', firstName);
    await page.fill('input[name="lastnameMax"]', lastName);
    await page.selectOption('select[name="stateMax"]', state);

    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('input[type="button"][value="search"]'),
    ]);

    await newPage.waitForSelector('table', { timeout: 30000 });

    const data = await newPage.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      return rows.slice(1).map(row => {
        const cells = row.querySelectorAll('td');
        return {
          name: cells[2]?.textContent.trim(),
          address: `${cells[4]?.textContent.trim()} ${cells[6]?.textContent.trim()} ${cells[8]?.textContent.trim()}`,
          dob: cells[10]?.textContent.trim(),
          party: cells[12]?.textContent.trim(),
          county: cells[14]?.textContent.trim(),
        };
      });
    });

    await browser.close();

    res.json(data);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

module.exports = router;
