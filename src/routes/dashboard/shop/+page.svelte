<script>
    import { onMount } from 'svelte';
    import ItemCard from '$lib/commponents/itemCard.svelte';

    let items = $state([]);
    let isLoading = $state(true);
    let error = $state('');

    onMount(async () => {
        try {
            const response = await fetch('/api/shop/getItems');
            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(`Failed to load shop items (${response.status}): ${responseText || 'No response body'}`);
            }

            const data = await response.json();
            items = Array.isArray(data) ? data.filter((entry) => entry && typeof entry === 'object') : [];
        } catch (err) {
            error = err instanceof Error ? err.message : 'Unknown error while loading shop items';
        } finally {
            isLoading = false;
        }
    });
</script>

{#if isLoading}
    <p>Loading shop items...</p>
{:else if error}
    <p>{error}</p>
{:else if items.length === 0}
    <p>No shop items available.</p>
{:else}
    <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
        {#each items as item, index (item.recId ?? item.id ?? index)}
            <ItemCard itemData={item} />
        {/each}
    </div>
{/if}
