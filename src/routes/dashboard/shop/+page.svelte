<script>
    import { invalidateAll } from '$app/navigation';
    import ItemAlert from '$lib/commponents/ItemAlert.svelte';
    import ItemCard from '$lib/commponents/itemCard.svelte';

    let { data } = $props();
    let items = $derived(data.items);
    let error = $derived(data.error);
    let isLoading = $derived(false);
    let selectedItem = $state(null);

    function openItemAlert(event) {
        selectedItem = event.detail.item;
    }

    async function closeItemAlert(event) {
        if (event.detail?.reason === 'success') {
            await invalidateAll();
        }

        selectedItem = null;
    }
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
            <ItemCard itemData={item} on:buy={openItemAlert} />
        {/each}
    </div>
{/if}

{#if selectedItem}
    <ItemAlert item={selectedItem} on:close={closeItemAlert} />
{/if}
