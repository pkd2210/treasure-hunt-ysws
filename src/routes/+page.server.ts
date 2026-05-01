import { getSlackId } from "$lib/db/airtableClient";
// put into +page.svelte the getSlackId (this is the +page.server.ts file) and pass it down to the components that need it, instead of calling getSlackId separately in each component. This way, you only call getSlackId once per page load, instead of once per component that needs it.
// give it as props
export async function load({ request }) {
  const slackId = await getSlackId(request);
  return {
    slackId,
  };
}