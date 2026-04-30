
<script lang="ts">
    const { data } = $props<{ data: { slackId: string; firstName: string; goldBars: number; isAdmin: boolean; isReviewer: boolean; homeAddress: string; emailAddress: string; country: string } }>();
    const slackId = $derived(() => data?.slackId);
    const firstName = $derived(() => data?.firstName);
    const goldBars = $derived(() => data?.goldBars);
    const isAdmin = $derived(() => data?.isAdmin);
    const isReviewer = $derived(() => data?.isReviewer);
    const homeAddress = $derived(() => data?.homeAddress);
    const emailAddress = $derived(() => data?.emailAddress);
    const country = $derived(() => data?.country);
    const phoneNumber = $derived(() => data?.phoneNumber);
</script>

Welcome to Treasure hunt

{#if slackId()}
    <p>Welcome back, {firstName()}!</p>
    <p>You have {goldBars()} gold bars!</p>
{:else}
    <a href="/api/login">Login with Hack Club Account</a>
{/if}
{#if isAdmin()}
    <p>You are an admin!</p>
{/if}
{#if isReviewer()}
    <p>You are a reviewer!</p>
{/if}
{#if emailAddress()}
    <p>Your email address is: {emailAddress()}</p>
{/if}
{#if homeAddress()}
    <p>Your home address is: {homeAddress()}</p>
{/if}
{#if country()}
    <p>Your country is: {country()}</p>
{/if}
{#if phoneNumber()}
    <p>Your phone number is: {phoneNumber()}</p>
{/if}