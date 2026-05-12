import { submitProjectForReview, getSlackId } from '$lib/db/airtableClient';

// Debug POST to submit a project for review. Accepts JSON: { projectId, useMock }
export async function POST({ request }) {
  try {
    const body = await request.json();
    const { projectId, useMock } = body;
    if (!projectId) return new Response(JSON.stringify({ error: 'projectId required' }), { status: 400 });

    if (useMock) {
      return new Response(JSON.stringify({ submissionId: `subMOCK-${Date.now()}`, projectId, mocked: true }), { status: 200 });
    }

    const slackId = await getSlackId(request);
    if (!slackId) return new Response(JSON.stringify({ error: 'Missing slackId (are you authenticated?)' }), { status: 401 });

    await submitProjectForReview(slackId, projectId);
    return new Response(JSON.stringify({ projectId, submitted: true }), { status: 200 });
  } catch (err) {
    console.error('debug/submitProject error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
