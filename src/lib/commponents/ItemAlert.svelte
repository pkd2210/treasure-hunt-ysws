<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let { item = {
    name: "Golden Compass",
    description: "A mysterious tool that points toward the nearest treasure. Slightly scratched.",
    price: 150,
    id: "",
    recId: "",
    imageUrl: "https://via.placeholder.com/100"
  } } = $props();

  let amount = $state(1);
  let totalPrice = $derived(amount * item.price);
  let isSubmitting = $state(false);
  let errorMessage = $state('');

  function close(reason = 'cancel') {
    if (isSubmitting) {
      return;
    }

    dispatch('close', { reason, item, amount, totalPrice });
  }

  async function confirm() {
    const itemId = item.id || item.recId;

    if (!itemId) {
      errorMessage = 'This item is missing an ID, so it cannot be purchased.';
      return;
    }

    isSubmitting = true;
    errorMessage = '';

    try {
      const params = new URLSearchParams({
        itemId,
        amount: String(amount)
      });
      const response = await fetch(`/api/shop/buy?${params.toString()}`);

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Purchase failed');
      }

      dispatch('close', { reason: 'success', item, amount, totalPrice });
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Purchase failed';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div class="relative w-full max-w-lg filter drop-shadow-xl">
    
    <svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
      <path d="M30,40 Q50,10 200,20 L450,15 Q485,25 475,100 L485,520 Q450,580 250,570 L50,585 Q20,570 35,350 L25,80 Q20,35 30,40 Z" 
            fill="#F3E1AD" stroke="#1B2D48" stroke-width="5" stroke-linejoin="round" />
      
      <circle cx="250" cy="60" r="30" fill="#EC3750" stroke="#1B2D48" stroke-width="3" />
      <text x="250" y="70" text-anchor="middle" font-family="serif" font-weight="900" font-size="30" fill="#F3E1AD">!</text>
    </svg>

    <div class="absolute inset-0 flex flex-col p-10 pt-24 text-[#1B2D48]">
      
      <div class="flex gap-4 items-start mb-6">
        <div class="relative group">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <path d="M5,5 Q10,2 50,5 L90,2 Q98,10 95,50 L98,90 Q50,98 10,95 L2,50 Z" fill="white" stroke="#1B2D48" stroke-width="3" />
          </svg>
          <img src={item.imageUrl} alt={item.name} class="absolute inset-0 m-auto w-16 h-16 object-contain" />
        </div>
        
        <div class="flex-1">
          <h2 class="text-2xl font-black uppercase tracking-tight leading-none mb-1">{item.name}</h2>
          <p class="text-xs font-bold opacity-70 italic leading-tight">{item.description}</p>
          <p class="mt-2 font-black text-lg text-[#EC3750]">{item.price} Gold / item</p>
        </div>
      </div>

      <hr class="border-[#1B2D48] opacity-20 mb-6" />

      <div class="flex flex-col items-center gap-2 mb-8">
        <span class="font-black text-sm uppercase tracking-widest">Select Quantity</span>
        <div class="flex items-center gap-6">
          <button onclick={() => amount > 1 && amount--} 
            class="w-10 h-10 rounded-full border-4 border-[#1B2D48] bg-[#E8D5A0] font-black text-2xl hover:scale-110 transition-transform">
            -
          </button>
          <span class="text-4xl font-black">{amount}</span>
          <button onclick={() => amount++} 
            class="w-10 h-10 rounded-full border-4 border-[#1B2D48] bg-[#FFB400] font-black text-2xl hover:scale-110 transition-transform">
            +
          </button>
        </div>
      </div>

      <div class="bg-[#E8D5A0] p-4 rounded-lg border-2 border-dashed border-[#1B2D48] text-center mb-8">
        <span class="block text-xs font-bold uppercase opacity-60">Total Expenditure</span>
        <span class="text-3xl font-black">{totalPrice} <small class="text-sm uppercase">Gold</small></span>
      </div>

      {#if errorMessage}
        <p class="mb-4 rounded-lg border-2 border-[#EC3750] bg-white/70 px-4 py-3 text-sm font-bold text-[#8a1c2d]">
          {errorMessage}
        </p>
      {/if}

      <div class="flex gap-4 mt-auto mb-2">
        <button onclick={() => close('cancel')} disabled={isSubmitting} class="flex-1 relative group">
           <svg viewBox="0 0 150 50" class="w-full h-12">
             <path d="M5,8 Q10,2 30,5 L140,2 Q148,10 145,25 L148,45 Q100,48 10,45 L2,25 Z" fill="#E8D5A0" stroke="#1B2D48" stroke-width="3" />
             <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-weight="900" font-size="14" fill="#1B2D48">CANCEL</text>
           </svg>
        </button>

        <button onclick={confirm} disabled={isSubmitting} class="flex-1 relative group">
           <svg viewBox="0 0 150 50" class="w-full h-12 transition-transform group-active:scale-95">
             <path d="M5,8 Q10,2 30,5 L140,2 Q148,10 145,25 L148,45 Q100,48 10,45 L2,25 Z" fill="#FFB400" stroke="#1B2D48" stroke-width="3" />
             <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-weight="900" font-size="14" fill="#1B2D48">{isSubmitting ? 'BUYING...' : 'BUY ITEM'}</text>
             <path d="M15,12 Q25,8 45,10" fill="none" stroke="white" stroke-width="2" opacity="0.4" />
           </svg>
        </button>
      </div>

    </div>
  </div>
</div>

<style>
  /* Basic Tailwind reset for standalone usage */
  h2, p, span, text {
    font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
  }
</style>