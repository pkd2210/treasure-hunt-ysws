
<script lang="ts">
    const { data } = $props<{ data: { slackId: string } }>();
    const slackId = $derived(() => data?.slackId);
</script>

Welcome to Treasure hunt

{#if slackId()}
    <p>Welcome back, {slackId()}!</p>
{:else}
    <a href="/api/login">Login with Hack Club Account</a>
{/if}