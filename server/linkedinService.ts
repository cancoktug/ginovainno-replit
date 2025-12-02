import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export class LinkedInService {
  /**
   * Extract profile photo URL from LinkedIn profile page
   * This method scrapes the public LinkedIn profile page to get the profile photo
   */
  static async extractProfilePhoto(linkedinUrl: string): Promise<string | null> {
    try {
      // Validate LinkedIn URL
      if (!linkedinUrl.includes('linkedin.com/in/')) {
        throw new Error('Invalid LinkedIn profile URL');
      }

      // Try multiple user agents and methods
      const userAgents = [
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
        'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      ];

      let response: any = null;
      let lastError: any = null;

      // Try different user agents
      for (const userAgent of userAgents) {
        try {
          response = await fetch(linkedinUrl, {
            headers: {
              'User-Agent': userAgent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
              'Accept-Encoding': 'gzip, deflate, br',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'none',
              'Sec-Fetch-User': '?1',
              'Upgrade-Insecure-Requests': '1',
            },
            timeout: 15000,
          });

          if (response.ok) {
            break;
          }
        } catch (error) {
          lastError = error;
          continue;
        }
      }

      if (!response || !response.ok) {
        // If direct scraping fails, try alternative approach
        return this.extractFromOpenGraph(linkedinUrl);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Try multiple selectors to find profile image
      const selectors = [
        'img[data-delayed-url*="profile-displayphoto"]',
        'img.profile-photo-edit__preview',
        'img.presence-entity__image',
        'button.profile-photo-edit__edit-btn img',
        'img[alt*="profile photo"]',
        '.profile-photo img',
        '.pv-top-card__photo img',
        'img.profile-photo-edit__preview',
        'img[src*="profile-displayphoto"]'
      ];

      let profileImageUrl: string | null = null;

      for (const selector of selectors) {
        const imgElement = $(selector).first();
        if (imgElement.length > 0) {
          const src = imgElement.attr('src') || imgElement.attr('data-delayed-url') || imgElement.attr('data-src');
          if (src && src.includes('profile-displayphoto')) {
            profileImageUrl = src;
            break;
          }
        }
      }

      // Fallback: look for any image with profile-displayphoto in src
      if (!profileImageUrl) {
        $('img').each((_, element) => {
          const src = $(element).attr('src') || $(element).attr('data-delayed-url') || $(element).attr('data-src');
          if (src && src.includes('profile-displayphoto')) {
            profileImageUrl = src;
            return false; // break
          }
        });
      }

      // Clean and validate the URL
      if (profileImageUrl) {
        // Remove query parameters and ensure HTTPS
        profileImageUrl = profileImageUrl.split('?')[0];
        if (profileImageUrl.startsWith('//')) {
          profileImageUrl = 'https:' + profileImageUrl;
        } else if (profileImageUrl.startsWith('/')) {
          profileImageUrl = 'https://linkedin.com' + profileImageUrl;
        }

        // Verify it's a valid image URL
        if (profileImageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) || profileImageUrl.includes('profile-displayphoto')) {
          return profileImageUrl;
        }
      }

      return null;
    } catch (error) {
      console.error('Error extracting LinkedIn profile photo:', error);
      return null;
    }
  }

  /**
   * Extract basic profile info from LinkedIn URL
   */
  /**
   * Alternative method using Open Graph tags and meta information
   */
  static async extractFromOpenGraph(linkedinUrl: string): Promise<string | null> {
    try {
      const response = await fetch(linkedinUrl, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        },
        timeout: 10000,
      });

      if (!response.ok) {
        return null;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Try Open Graph image
      const ogImage = $('meta[property="og:image"]').attr('content');
      if (ogImage && ogImage.includes('profile')) {
        return ogImage;
      }

      // Try Twitter card image
      const twitterImage = $('meta[name="twitter:image"]').attr('content');
      if (twitterImage && twitterImage.includes('profile')) {
        return twitterImage;
      }

      return null;
    } catch (error) {
      console.error('Error extracting from Open Graph:', error);
      return null;
    }
  }

  /**
   * Generate a professional avatar using initials as fallback
   */
  static generateAvatarUrl(name: string): string {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    // Use a placeholder avatar service with initials
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=200&background=0d6efd&color=fff&bold=true`;
  }

  static async extractProfileInfo(linkedinUrl: string): Promise<{
    name?: string;
    title?: string;
    profilePhoto?: string;
  }> {
    try {
      // First try direct extraction
      const profilePhoto = await this.extractProfilePhoto(linkedinUrl);
      
      if (profilePhoto) {
        return { profilePhoto };
      }

      // If that fails, try Open Graph method
      const ogPhoto = await this.extractFromOpenGraph(linkedinUrl);
      if (ogPhoto) {
        return { profilePhoto: ogPhoto };
      }

      // Extract username from URL for fallback
      const match = linkedinUrl.match(/linkedin\.com\/in\/([^/?]+)/);
      if (match) {
        const username = match[1].replace(/[-_]/g, ' ');
        const name = username.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return {
          name,
          profilePhoto: this.generateAvatarUrl(name)
        };
      }

      return {};
    } catch (error) {
      console.error('Error extracting LinkedIn profile info:', error);
      
      // Fallback: extract username and create avatar
      const match = linkedinUrl.match(/linkedin\.com\/in\/([^/?]+)/);
      if (match) {
        const username = match[1].replace(/[-_]/g, ' ');
        const name = username.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return {
          name,
          profilePhoto: this.generateAvatarUrl(name)
        };
      }
      
      return {};
    }
  }

  /**
   * Legacy method kept for compatibility
   */
  static async extractProfileInfoLegacy(linkedinUrl: string): Promise<{
    name?: string;
    title?: string;
    profilePhoto?: string;
  }> {
    try {
      const response = await fetch(linkedinUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
        timeout: 10000,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const info: { name?: string; title?: string; profilePhoto?: string } = {};

      // Extract name
      const nameSelectors = [
        'h1.text-heading-xlarge',
        'h1.top-card-layout__title',
        '.pv-text-details__left-panel h1',
        'h1[data-anonymize="person-name"]'
      ];

      for (const selector of nameSelectors) {
        const nameElement = $(selector).first();
        if (nameElement.length > 0) {
          info.name = nameElement.text().trim();
          break;
        }
      }

      // Extract title
      const titleSelectors = [
        '.text-body-medium.break-words',
        '.top-card-layout__headline',
        '.pv-text-details__left-panel .text-body-medium',
        'div[data-anonymize="headline"]'
      ];

      for (const selector of titleSelectors) {
        const titleElement = $(selector).first();
        if (titleElement.length > 0) {
          info.title = titleElement.text().trim();
          break;
        }
      }

      // Extract profile photo
      info.profilePhoto = await this.extractProfilePhoto(linkedinUrl);

      return info;
    } catch (error) {
      console.error('Error extracting LinkedIn profile info:', error);
      return {};
    }
  }
}