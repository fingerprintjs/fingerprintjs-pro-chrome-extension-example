import { Page } from 'playwright';
import { getPopupUrl } from './url';

export const navigateToPopup = async (page: Page) => {
  const url = await getPopupUrl(page.context());

  await page.goto(url.toString(), {
    waitUntil: 'networkidle',
  });
};
