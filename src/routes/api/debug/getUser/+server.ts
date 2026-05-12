// Debug endpoint: returns a mock user record; optional query params: slackId
export async function GET({ url }) {
  const slackId = url.searchParams.get('slackId') || 'U091DE0M4NB';
  const user = {
    id: 'recMOCK',
    slackId,
    goldBars: 2500,
    firstName: 'Peleg',
    lastName: 'User',
    email: 'pkd2210@gmail.com',
    journeyNumber: 1,
    admin: true,
    reviewer: true,
  };
  return new Response(JSON.stringify(user), { status: 200 });
}
