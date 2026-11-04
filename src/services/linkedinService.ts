import { LINKEDIN } from '../config/env';

export async function publishToLinkedIn(commentary: string) {
  const authorUrn = LINKEDIN.orgUrn || LINKEDIN.personUrn;
  console.log('LinkedIn URN:', authorUrn);
  if (!authorUrn) throw new Error('LinkedIn URN is missing');
  console.log('Publishing to LinkedIn with commentary:', commentary);
  const response = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINKEDIN.accessToken}`,
      'Content-Type': 'application/json',
      'Linkedin-Version': LINKEDIN.version,
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: authorUrn,
      commentary: commentary,
      visibility: 'PUBLIC',
      distribution: { feedDistribution: 'MAIN_FEED' },
      lifecycleState: 'PUBLISHED',
    }),
  });
  console.log('LinkedIn API Response:', response);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn API Error: ${response.status} - ${error}`);
  }
  return response.headers.get('x-restli-id');
}