<script>
  let { itemData = { name: "Item Not Found", description: "No description available.", price:  0, imageUrl: "" } } = $props();

    function getNameFontSize(name) {
      const length = (name || '').trim().length;

      if (length <= 18) return 22;
      if (length <= 28) return 18;
      if (length <= 40) return 14;
      return 14;
    }

    function getNameLines(name) {
      const safeName = (name || '').trim();
      if (!safeName) return ['Item Not Found'];

      if (safeName.length >= 32) {
        const words = safeName.split(/\s+/).filter(Boolean);
        if (words.length < 2) return [safeName];

        const midpoint = Math.floor(safeName.length / 2);
        let bestIndex = 1;
        let bestDistance = Infinity;

        for (let i = 1; i < words.length; i += 1) {
          const left = words.slice(0, i).join(' ');
          const distance = Math.abs(left.length - midpoint);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = i;
          }
        }

        return [
          words.slice(0, bestIndex).join(' '),
          words.slice(bestIndex).join(' ')
        ];
      }

      return [safeName];
    }

    function buyItem() {
        alert(`You have bought ${itemData.name} for ${itemData.price} gold bars!`);
    }

    function onBuyKeyDown(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        buyItem();
      }
    }
</script>

<div style="width: 300px; font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;">
  <svg viewBox="0 0 300 450" width="300" height="450" xmlns="http://www.w3.org/2000/svg" style="display: block;">
    <!-- Main Card Body: Parchment Sand with Deep Ocean Blue border -->
    <path d="M10,20 Q15,10 30,12 L270,8 Q290,10 285,30 L295,420 Q290,440 270,435 L30,442 Q10,440 15,420 Z" 
          fill="#F3E1AD" stroke="#1B2D48" stroke-width="4" />

    <!-- Image Placeholder Box: Stylized like the Chest frame -->
    <rect x="35" y="45" width="230" height="180" rx="10" fill="#E8D5A0" stroke="#1B2D48" stroke-width="2" stroke-dasharray="5,5" />
    <!-- Replace 'image_url' with your item photo -->
    <image href={itemData.imageUrl} x="40" y="50" width="220" height="170" preserveAspectRatio="xMidYMid slice" clip-path="inset(0% round 8px)" />

    <!-- Item Name: Using Hack Club Red inspired color -->
    <text x="150" y="258" text-anchor="middle" font-size={getNameFontSize(itemData.name)} font-weight="bold" fill="#EC3750" style="text-transform: uppercase;">
      {#if getNameLines(itemData.name).length === 2}
        <tspan x="150" dy="0">{getNameLines(itemData.name)[0]}</tspan>
        <tspan x="150" dy="18">{getNameLines(itemData.name)[1]}</tspan>
      {:else}
        <tspan x="150" dy="0">{getNameLines(itemData.name)[0]}</tspan>
      {/if}
    </text>

    <!-- Item Description -->
    <text x="40" y="295" font-size="14" fill="#1B2D48" opacity="0.8">
      <tspan x="40" dy="0">{itemData.description || "No description available."}</tspan>
    </text>

    <!-- Price Tag: Gold Bar Yellow -->
    <g transform="translate(190, 335)">
      <path d="M0,0 L80,0 L90,15 L80,30 L0,30 Z" fill="#FFB400" stroke="#1B2D48" stroke-width="2" />
      <text x="40" y="20" text-anchor="middle" font-size="16" font-weight="bold" fill="#1B2D48">{itemData.price} GB</text>
    </g>

    <!-- Buy Button: Interaction Area -->
    <g
      style="cursor: pointer;"
      role="button"
      tabindex="0"
      aria-label="Buy item"
      onclick={buyItem}
      onkeydown={onBuyKeyDown}
    >
      <path d="M40,380 L260,380 L255,420 L45,420 Z" fill="#1B2D48" />
      <text x="150" y="405" text-anchor="middle" font-size="18" font-weight="bold" fill="#F3E1AD">BUY</text>
    </g>
    
    <!-- Decorative "X" Mark -->
    <text x="260" y="40" font-size="30" fill="#EC3750" opacity="0.6" transform="rotate(15, 260, 40)">X</text>
  </svg>
</div>