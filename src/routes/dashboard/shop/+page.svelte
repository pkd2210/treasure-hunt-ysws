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
    <div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
        <a href="/dashboard/shop/orders" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.9rem 1.4rem; background: #FFB400; color: #1B2D48; border: 4px solid #1B2D48; border-radius: 12px; font-family: 'Comic Sans MS', sans-serif; font-weight: 900; text-decoration: none; box-shadow: 0 6px 0 #1B2D48; transition: transform 0.05s ease, box-shadow 0.05s ease;">
            VIEW ORDERS
        </a>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">
        {#each items as item, index (item.recId ?? item.id ?? index)}
            <ItemCard itemData={item} on:buy={openItemAlert} />
        {/each}
    </div>
{/if}

{#if selectedItem}
    <ItemAlert item={selectedItem} on:close={closeItemAlert} />
{/if}
