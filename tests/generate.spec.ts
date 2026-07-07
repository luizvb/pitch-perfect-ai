import { test, expect } from '@playwright/test';

test('should generate a pitch successfully', async ({ page }) => {
  // Go to the home page
  await page.goto('http://localhost:3000');

  // Expect the title to be present
  await expect(page.locator('h1')).toContainText('PitchPerfect AI');

  // Fill the form
  await page.fill('#prospectBio', 'Elon Musk is the CEO of Tesla and SpaceX.');
  await page.fill('#valueProp', 'I am selling a new AI software that helps astronauts sleep better.');

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for the response to appear (we look for the Generated Email section)
  // The loader should change back to "Generate Perfect Pitch" or we check for the text "Generated Email"
  await expect(page.getByText('Generated Email')).toBeVisible({ timeout: 15000 });

  // The generated text should contain something
  const generatedEmail = page.locator('.prose pre');
  await expect(generatedEmail).toBeVisible();
  
  const text = await generatedEmail.textContent();
  expect(text?.length).toBeGreaterThan(10);
});
