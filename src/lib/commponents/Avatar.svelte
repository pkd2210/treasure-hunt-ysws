<script>
    import { onMount } from "svelte";

    let { slackId, class: className = '', style = '' } = $props();
    const url = $derived(`https://cachet.dunkirk.sh/users/${slackId}`);

    let logoUrl = $state('');
    onMount(() => {
        fetchLogo();
    });
    async function fetchLogo() {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                logoUrl = '';
                throw new Error(`Slack Logo: error status: ${response.status}`);
            }
            const data = await response.json();
            logoUrl = data.imageUrl || '';   
        } catch (error) {
            console.error('Slack Logo error:', error);
            logoUrl = '';
        }
    }
</script>
{#if logoUrl}
    <img src={logoUrl} alt="Slack Logo" class={className} style={style} />
{:else}
    <img src="https://l4-bucket.dunkirk.sh/5DjfoBI58Pfw.webp" alt="Default Avatar" class={className} style={style} />
{/if}
