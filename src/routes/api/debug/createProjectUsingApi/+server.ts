import { createProject, getSlackId } from "$lib/db/airtableClient";

export async function GET(event) {
  // Simple mock GET for debug purposes. Accepts optional query params: projectName, journeyNumber
  // If `createReal=true` query param is present, attempt to create a real project in Airtable
  const { url, request } = event;
  const projectName = url.searchParams.get("projectName") || "Mock Project";
  const journeyNumber = Number(url.searchParams.get("journeyNumber") || 1);
  // treat request as "create real" when either query param is set OR an auth cookie is present
  const cookieHeader = (request && request.headers && request.headers.get('cookie')) || '';
  const hasAccessToken = cookieHeader.includes('access_token=');
  const createReal = url.searchParams.get("createReal") === "true" || hasAccessToken;

  const mockProject = {
    projectName: projectName,
    description: 'This is a mock project created for debug.',
    codeUrl: `https://github.com/hackclub/ysws-mock-project-${journeyNumber}`,
    readmeUrl: `https://raw.githubusercontent.com/hackclub/ysws-mock-project-${journeyNumber}/main/README.md`,
    demoUrl: `https://hackclub.github.io/ysws-mock-project-${journeyNumber}`,
    screenshot: `https://cdn.example.com/ysws/mock-${journeyNumber}-screenshot.png`,
    aiUsage: 'No AI usage',
    hackatimeProject: `Mock Hackatime Project ${journeyNumber}`,
    user: 'recMOCK',
    journeyNumber,
    status: 'unreviewed',
    submission: null,
    yswsEligible: false,
  } as any;

  if (!createReal) {
    const mockId = `recMOCK-${Date.now()}`;
    return new Response(JSON.stringify({ projectId: mockId, project: mockProject }), { status: 200 });
  }

  try {
    const slackId = await getSlackId(request);
    if (!slackId) {
      return new Response(JSON.stringify({ error: 'Missing slackId (are you authenticated?)' }), { status: 401 });
    }

    const projectId = await createProject(slackId, {
      projectName: projectName,
      description: mockProject.description,
      journeyNumber,
      readmeUrl: '',
      demoUrl: '',
      screenshot: '',
      aiUsage: '',
      hackatimeProject: '',
    } as any);

    return new Response(JSON.stringify({ projectId, created: true }), { status: 201 });
  } catch (err) {
    console.error('debug/createProjectUsingApi GET createReal error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const payload = await request.json();
    const {
      projectName,
      description,
      journeyNumber,
      readmeUrl,
      demoUrl,
      screenshot,
      aiUsage,
      hackatimeProject,
      useMock,
    } = payload;
    // If `useMock` is truthy, return mock data instead of hitting Airtable
    if (useMock) {
      const mockProject = {
        projectName: projectName || 'Mock Project',
        description: description || 'This is a mock project created for debug.',
        codeUrl: readmeUrl || `https://github.com/hackclub/ysws-mock-project-${journeyNumber || 1}`,
        readmeUrl: readmeUrl || `https://raw.githubusercontent.com/hackclub/ysws-mock-project-${journeyNumber || 1}/main/README.md`,
        demoUrl: demoUrl || `https://hackclub.github.io/ysws-mock-project-${journeyNumber || 1}`,
        screenshot: screenshot || `https://cdn.example.com/ysws/mock-${journeyNumber || 1}-screenshot.png`,
        aiUsage: aiUsage || 'No AI usage',
        hackatimeProject: hackatimeProject || `Mock Hackatime Project ${journeyNumber || 1}`,
        user: 'recMOCK',
        journeyNumber: journeyNumber || 1,
        status: 'unreviewed',
        submission: null,
        yswsEligible: false,
      } as any;

      // simulate created record id
      const mockId = `recMOCK-${Date.now()}`;
      return new Response(JSON.stringify({ projectId: mockId, project: mockProject }), { status: 201 });
    }

    const slackId = await getSlackId(request);
    if (!slackId) {
      return new Response(JSON.stringify({ error: 'Missing slackId' }), { status: 400 });
    }

    const projectId = await createProject(slackId, {
      projectName,
      description,
      journeyNumber,
      readmeUrl,
      demoUrl,
      screenshot,
      aiUsage,
      hackatimeProject,
    } as any);

    return new Response(JSON.stringify({ projectId }), { status: 201 });
  } catch (err) {
    console.error('debug/createProjectUsingApi error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
