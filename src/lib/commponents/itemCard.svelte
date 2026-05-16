<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { itemData = { name: "Item Not Found", description: "No description available.", price:  0, imageUrl: "" } } = $props();

  const nameLines = $derived(getNameLines(itemData.name));
  const descriptionLines = $derived(getDescriptionLines(itemData.description));

    function getNameFontSize(name) {
      const length = (name || '').trim().length;

      if (length <= 18) return 22;
      if (length <= 28) return 18;
      if (length <= 40) return 14;
      return 14;
    }

    function wrapText(text, maxCharsPerLine, maxLines) {
      const safeText = (text || '').trim();

      if (!safeText) {
        return [''];
      }

      const words = safeText.split(/\s+/).filter(Boolean);
      const lines = [];
      let currentLine = '';

      const flushLine = () => {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = '';
        }
      };

      for (const word of words) {
        const candidate = currentLine ? `${currentLine} ${word}` : word;

        if (candidate.length <= maxCharsPerLine) {
          currentLine = candidate;
          continue;
        }

        flushLine();

        if (word.length <= maxCharsPerLine) {
          currentLine = word;
          continue;
        }

        for (let index = 0; index < word.length; index += maxCharsPerLine) {
          lines.push(word.slice(index, index + maxCharsPerLine));
        }
      }

      flushLine();

      if (lines.length <= maxLines) {
        return lines;
      }

      const truncatedLines = lines.slice(0, maxLines);
      truncatedLines[maxLines - 1] = `${truncatedLines[maxLines - 1].replace(/\s+$/, '')}...`;
      return truncatedLines;
    }

    function getNameLines(name) {
      const safeName = (name || '').trim();

      if (!safeName) {
        return ['Item Not Found'];
      }

      return wrapText(safeName, 16, 2);
    }

    function getDescriptionLines(description) {
      const safeDescription = (description || '').trim();

      if (!safeDescription) {
        return ['No description available.'];
      }

      return wrapText(safeDescription, 31, 3);
    }

    function buyItem() {
      dispatch('buy', { item: itemData });
    }

    function onBuyKeyDown(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        buyItem();
      }
    }
</script>

<div style="width: 300px; font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;">
  <svg viewBox="0 0 300 450" width="300" height="450" xmlns="http://www.w3.org/2000/svg" style="display: block; font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;">
    <!-- Main Card Body: Parchment Sand with Deep Ocean Blue border -->
    <path d="M10,20 Q15,10 30,12 L270,8 Q290,10 285,30 L295,420 Q290,440 270,435 L30,442 Q10,440 15,420 Z" 
          fill="#F3E1AD" stroke="#1B2D48" stroke-width="4" />

    <!-- Image Placeholder Box: Stylized like the Chest frame -->
    <rect x="35" y="45" width="230" height="180" rx="10" fill="#E8D5A0" stroke="#1B2D48" stroke-width="2" stroke-dasharray="5,5" />
    <!-- Replace 'image_url' with your item photo -->
    <image href={itemData.imageUrl} x="40" y="50" width="220" height="170" preserveAspectRatio="xMidYMid slice" clip-path="inset(0% round 8px)" />

    <!-- Item Name: Using Hack Club Red inspired color -->
    <text x="150" y="258" text-anchor="middle" font-size={getNameFontSize(itemData.name)} font-weight="bold" fill="#EC3750" style="text-transform: uppercase;">
      {#each nameLines as line, index}
        <tspan x="150" dy={index === 0 ? 0 : 18}>{line}</tspan>
      {/each}
    </text>

    <!-- Item Description -->
    <text x="40" y="295" font-size="13" fill="#1B2D48" opacity="0.8">
      {#each descriptionLines as line, index}
        <tspan x="40" dy={index === 0 ? 0 : 16}>{line}</tspan>
      {/each}
    </text>

    <!-- Price Tag: Gold Bar Yellow -->
    <g transform="translate(190, 335)">
      <path d="M0,0 L80,0 L90,15 L80,30 L0,30 Z" fill="#FFB400" stroke="#1B2D48" stroke-width="2" />
      <text x="34" y="20" text-anchor="middle" font-size="16" font-weight="bold" fill="#1B2D48">{itemData.price}</text>
      <image href="/assets/Gold%20Bar.webp" x="30" y="-18" width="64" height="64" preserveAspectRatio="xMidYMid meet" />
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