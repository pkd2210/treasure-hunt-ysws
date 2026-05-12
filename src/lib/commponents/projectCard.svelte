<script>
    let { number, create = false, project = null, big = false, locked = true } = $props();
    const projectStatusColor = () => ({
        'UNSHIPPED': '#EC3750',
        'APPROVED': '#4CAF50',
        'INREVIEW': '#FF9800',
        'NEED CHANGES': '#FF5722'
    }[project?.status] || '#EC3750'); // Default to red if status is unknown

    const xIndex = () => (number - 1) % 3;
    const yIndex = () => Math.floor((number - 1) / 3);
    const translateX = () => big ? 150 : xIndex() * 340 + 20;
    const translateY = () => big ? 570 : yIndex() * 220 + 140;
    const scale = () => big ? 2.5 : 1;
    const textX = () => big ? 325 : 125;
    const statusX = () => big ? 40 : 20;
     const createHref = () => `/dashboard/projects/create/${number}`;

    if (project?.description && project.description.length > 23) {
        project.description = project.description.slice(0, 23) + '...';
    }
</script>

{#if create == true}
    <!-- Project {number} Slot -->
    {#if locked}
        <g transform="translate({translateX()}, {translateY()}) scale(1.1)" opacity="0.45" style="cursor: not-allowed;">
            <!-- Small Wobbly Card for the Item -->
            <g transform="scale({scale()},1)">
                <path d="M5,10 Q10,2 40,5 L240,2 Q255,5 252,20 L258,160 Q240,175 120,170 L20,178 Q5,170 8,100 Z" 
                        fill="#E8D5A0" stroke="#1B2D48" stroke-width="3" />
            </g>

            <text x={textX()} y="95" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48" opacity="0.7" text-anchor="middle">CREATE PROJECT</text>
        </g>
    {:else}
        <a href={createHref()}>
            <g transform="translate({translateX()}, {translateY()}) scale(1.1)" style="cursor: pointer;">
                <!-- Small Wobbly Card for the Item -->
                <g transform="scale({scale()},1)">
                    <path d="M5,10 Q10,2 40,5 L240,2 Q255,5 252,20 L258,160 Q240,175 120,170 L20,178 Q5,170 8,100 Z" 
                            fill="#E8D5A0" stroke="#1B2D48" stroke-width="3" />
                </g>

                <text x={textX()} y="95" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48" opacity="0.7" text-anchor="middle">CREATE PROJECT</text>
            </g>
        </a>
    {/if}
{:else}
    <g transform="translate({translateX()}, {translateY()}) scale(1.1)" opacity={locked ? 0.45 : 1} style={locked ? 'cursor: not-allowed;' : 'cursor: pointer;'}>
       <!-- Small Wobbly Card for the Item -->
        <g transform="scale({scale()},1)">
       <path d="M5,10 Q10,2 40,5 L240,2 Q255,5 252,20 L258,160 Q240,175 120,170 L20,178 Q5,170 8,100 Z" 
             fill="#E8D5A0" stroke="#1B2D48" stroke-width="3" />
        </g>
       <text  font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48" text-anchor="middle" x={textX()} y="35">{project?.projectName || 'Unnamed Project'}</text>
       <text font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="18" fill="#1B2D48" text-anchor="middle" x={textX()} y="75">{project?.description || 'No description available'}</text>
       <text font-family="'Luckiest Guy', cursive" font-size="14" fill="#1B2D48" opacity="0.7" text-anchor="middle" x={textX()} y="95">JOURNEY {project?.journeyNumber || 'Unknown'}</text>

       <!-- Status Label -->
    <text x={statusX()} y="145" font-family="monospace" font-weight="900" font-size="14" fill={projectStatusColor()}>{project?.status || 'UNSHIPPED'}</text>

    </g>
{/if}