<script lang="ts">
	const { question = "", content = [], links = [] } = $props<{
		question?: string;
		content?: string[];
		links?: Array<{ text: string; url: string }>;
	}>();

	// Calculate dynamic height based on content
	let svgViewHeight = $derived(Math.max(120, 75 + (content.length * 20) + (links.length * 20) + 20));
</script>

<div style="max-width: 500px; filter: drop-shadow(4px 4px 0px rgba(27, 45, 72, 0.2));">
    <svg width="500" height={svgViewHeight} viewBox={`0 0 500 ${svgViewHeight}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <!-- Torn Paper Scrap Background -->
        <path d={`M10,15 L485,5 L495,${svgViewHeight - 15} L15,${svgViewHeight - 5} L5,60 Z`}
            fill="#F3E1AD"
            stroke="#1B2D48"
            stroke-width="3"
            stroke-linejoin="round" />

        <!-- Red "Q" for Question Circle -->
        <circle cx="45" cy="50" r="20" fill="#EC3750" />
        <text x="45" y="60" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="28" fill="#F3E1AD">?</text>

        <!-- Question Text Area -->
        <text x="85" y="45" font-family="'Luckiest Guy', cursive" font-weight="800" font-size="18" fill="#1B2D48">
            {question}
        </text>

        <!-- Answer Content -->
        <text x="85" y="75" font-family="'Luckiest Guy', cursive" font-size="14" fill="#1B2D48" opacity="0.7">
            {#each content as line, i}
                <tspan x="85" dy={i === 0 ? 0 : 20}>{line}</tspan>
            {/each}
            {#each links as link}
                <tspan
                    x="85"
                    dy="20"
                    fill="#EC3750"
                    style="cursor: pointer; text-decoration: underline;"
                    on:click={() => window.open(link.url, '_blank')}
                >
                    {link.text}
                </tspan>
            {/each}
        </text>

        <!-- Subtle Compass Rose Detail in corner -->
        <g transform={`translate(460, ${Math.max(85, svgViewHeight - 35)}) scale(0.5)`} opacity="0.3">
            <line x1="0" y1="-20" x2="0" y2="20" stroke="#1B2D48" stroke-width="2" />
            <line x1="-20" y1="0" x2="20" y2="0" stroke="#1B2D48" stroke-width="2" />
            <path d="M-10,-10 L10,10 M-10,10 L10,-10" stroke="#1B2D48" stroke-width="1" />
        </g>
    </svg>
</div>

<style>
</style>
