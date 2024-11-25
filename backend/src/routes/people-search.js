const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();

const stateMapping = {
  "AL": "alabama", "AK": "alaska", "AZ": "arizona", "AR": "arkansas", "CA": "california",
  "CO": "colorado", "CT": "connecticut", "DE": "delaware", "DC": "district-of-columbia",
  "FL": "florida", "GA": "georgia", "HI": "hawaii", "ID": "idaho", "IL": "illinois",
  "IN": "indiana", "IA": "iowa", "KS": "kansas", "KY": "kentucky", "LA": "louisiana",
  "ME": "maine", "MD": "maryland", "MA": "massachusetts", "MI": "michigan", "MN": "minnesota",
  "MS": "mississippi", "MO": "missouri", "MT": "montana", "NE": "nebraska", "NV": "nevada",
  "NH": "new-hampshire", "NJ": "new-jersey", "NM": "new-mexico", "NY": "new-york", "NC": "north-carolina",
  "ND": "north-dakota", "OH": "ohio", "OK": "oklahoma", "OR": "oregon", "PA": "pennsylvania",
  "RI": "rhode-island", "SC": "south-carolina", "SD": "south-dakota", "TN": "tennessee",
  "TX": "texas", "UT": "utah", "VT": "vermont", "VA": "virginia", "WA": "washington",
  "WV": "west-virginia", "WI": "wisconsin", "WY": "wyoming"
};

router.post('/people-search', async (req, res) => {

  const { firstName, lastName, state } = req.body;

  if (!firstName || !lastName || !state) {
    return res.status(400).json({ error: 'Missing required parameters: firstName, lastName, or state' });
  }

  if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
    return res.status(400).json({ error: 'Invalid firstName or lastName format' });
  }

  const stateFullName = stateMapping[state.toUpperCase()];
  if (!stateFullName) {
    return res.status(400).json({ error: 'Invalid state abbreviation' });
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ timeout: 60000 });
    const page = await context.newPage();

    await page.goto('https://idcrawl.com/', { waitUntil: 'load' });

    await page.fill('input[name="search-keyword"]', `${firstName} ${lastName}`);
    await page.selectOption('#search-state', { value: stateFullName });

    await page.click('button[type="submit"]');
    await page.waitForSelector('div#truthfinder .c p', { timeout: 30000 });

    const results = await page.evaluate(() => {
      let data = {
        addresses: [],
        relatives: [],
        emails: [],
        phoneNumbers: [],
        socialProfiles: [],
        usernames: []
      };

      try {
        document.querySelectorAll('div.c p').forEach(el => {
          let text = el.textContent;
          if (text.includes('Lived in:')) {
            data.addresses.push(...text.replace('Lived in:', '').split(',').map(addr => addr.trim()));
          } else if (text.includes('Relatives:')) {
            data.relatives.push(...text.replace('Relatives: ', '').split(',').map(rel => rel.trim()));
          }
        });

        document.querySelectorAll('p.x').forEach(el => {
            const emailMatch = el.textContent.match(/[\w.-]+(\*{2,})?@[\w.-]+\.\w+/);
            const phoneMatch = el.textContent.match(/\(\d{3}\) \d{3}-(\d{4}|\*{4})/);
        
            if (emailMatch) data.emails.push(emailMatch[0]);
            if (phoneMatch) data.phoneNumbers.push(phoneMatch[0]);
        });        

        const instagramSection = document.querySelector('#instagram .gl-accordion-details .panel-body');
        const firstInstagramProfile = instagramSection?.querySelector('.i');

        if (firstInstagramProfile) {
          const network = "Instagram";
          const image = firstInstagramProfile.querySelector('img')?.src || null;
          const name = firstInstagramProfile.querySelector('h3 a')?.textContent.trim() || null;
          const link = firstInstagramProfile.querySelector('h3 a')?.getAttribute('href') || null;

          if (image && name) {
            data.socialProfiles.push({ network, name, image, link });
          }
        }

        const twitterSection = document.querySelector('#twitter .gl-accordion-details .panel-body');
        const firstTwitterProfile = twitterSection?.querySelector('.i');

        if (firstTwitterProfile) {
          const network = "Twitter";
          const image = firstTwitterProfile.querySelector('img')?.src || null;
          const name = firstTwitterProfile.querySelector('h3 a')?.textContent.trim() || null;
          const link = firstTwitterProfile.querySelector('h3 a')?.getAttribute('href') || null;

          if (image && name) {
            data.socialProfiles.push({ network, name, image, link });
          }
        }

        const linkedinSection = document.querySelector('#linkedin .gl-accordion-details .panel-body');
        const firstLinkedinProfile = linkedinSection?.querySelector('.i');

        if (firstLinkedinProfile) {
        const network = "LinkedIn";
        const image = firstLinkedinProfile.querySelector('img')?.src || null;
        const name = firstLinkedinProfile.querySelector('h3 a')?.textContent.trim() || null;
        const link = firstLinkedinProfile.querySelector('h3 a')?.getAttribute('href') || null;

        if (image && name) {
            data.socialProfiles.push({ network, name, image, link });
        }
        }

        const facebookSection = document.querySelector('#facebook .gl-accordion-details .panel-body');
        const firstFacebookProfile = facebookSection?.querySelector('.i');

        if (firstFacebookProfile) {
        const network = "Facebook";
        const image = firstFacebookProfile.querySelector('img')?.src || null;
        const name = firstFacebookProfile.querySelector('h3 a')?.textContent.trim() || null;
        const link = firstLinkedinProfile.querySelector('h3 a')?.getAttribute('href') || null;

        if (image && name) {
            data.socialProfiles.push({ network, name, image, link });
        }
        }

        let count = 0;
        document.querySelectorAll('#usernames a.w').forEach(usernames => {
          if (count >= 8) return;
          const username = usernames.textContent.trim() || null;
          if (username) {
            data.usernames.push({ username });
            count++;
          }
        });

        const normalize = arr => Array.from(new Set(arr.map(item => item.trim())));
        const normalizeAddresses = arr => Array.from(
          new Set(
            arr.map(item => {
              const parts = item.split(" ");
              if (parts.length > 1) {
                const state = parts.pop();
                const town = parts.join(" ");
                return `${town}, ${state}`;
              }
              return item;
            })
          )
        );

        data.addresses = normalizeAddresses(data.addresses);
        data.relatives = normalize(data.relatives);
        data.emails = normalize(data.emails);
        data.phoneNumbers = normalize(data.phoneNumbers);
        return data;
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error:`, error);
        return { error: 'Failed to fetch data' };
      }
    });

    return res.status(200).json(results);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error);
    return res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;