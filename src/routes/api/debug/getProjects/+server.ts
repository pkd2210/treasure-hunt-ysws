// Debug endpoint: returns mock list of projects. Optional query `useMock=false&createReal=true` not implemented here.
export async function GET() {
  const projects = [
    {
      user: 'recMOCK',
      projectName: 'Journey 1 Mock Project',
      description: 'Mock project for journey 1',
      codeUrl: 'https://github.com/hackclub/ysws-mock-project-1',
      readmeUrl: 'https://raw.githubusercontent.com/hackclub/ysws-mock-project-1/main/README.md',
      demoUrl: 'https://hackclub.github.io/ysws-mock-project-1',
      screenshot: 'https://cdn.example.com/ysws/mock-1-screenshot.png',
      aiUsage: 'No AI usage',
      hackatimeProject: 'Mock Hackatime Project 1',
      journeyNumber: 1,
      status: 'unreviewed',
      submission: null,
      yswsEligible: false,
    },
    {
      user: 'recMOCK',
      projectName: 'Journey 3 Mock Project',
      description: 'Mock approved project for journey 3',
      codeUrl: 'https://github.com/hackclub/ysws-mock-project-3',
      readmeUrl: 'https://raw.githubusercontent.com/hackclub/ysws-mock-project-3/main/README.md',
      demoUrl: 'https://hackclub.github.io/ysws-mock-project-3',
      screenshot: 'https://cdn.example.com/ysws/mock-3-screenshot.png',
      aiUsage: 'No AI usage',
      hackatimeProject: 'Mock Hackatime Project 3',
      journeyNumber: 3,
      status: 'approved',
      submission: null,
      yswsEligible: false,
    }
  ];

  return new Response(JSON.stringify(projects), { status: 200 });
}
