<script>
    import ItemCard from '$lib/commponents/itemCard.svelte';

    let { data } = $props();
    let items = $derived(data.items);
    let error = $derived(data.error);
    let isLoading = $derived(false);
</script>

{#if isLoading}
    <p>Loading shop items...</p>
{:else if error}
    <p>{error}</p>
{:else if items.length === 0}
    <p>No shop items available.</p>
{:else}
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
        {#each items as item, index (item.recId ?? item.id ?? index)}
            <ItemCard itemData={item} />
        {/each}
    </div>
{/if}
