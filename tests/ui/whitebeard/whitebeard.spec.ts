import { test, expect } from '../../../fixtures';

test.describe('Whitebeard - Home / Testimonial', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://whitebeard.dev/');
  });

  test('deve exibir o depoimento com o texto e autor corretos', async ({
    page,
  }) => {
    const testimonialQuote =
      'I highly recommend Whitebeard Technology. Their expertise and guidance have been invaluable in driving growth and efficiency in our company.';
    const testimonialAuthor = 'Mark Jackson';

    const blockquote = page.locator(
      'xpath=//*[@id="root"]/div/div/div[2]/section[3]/div/div/blockquote'
    );

    await expect(blockquote).toBeVisible();

    await expect(blockquote).toContainText(testimonialQuote);
    await expect(blockquote).toContainText(testimonialAuthor);
  });
});
