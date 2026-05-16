<script>
    import { DisplayName } from "hackclub-forms";
    import Avatar from './Avatar.svelte';

    let { name, slackId, description, screenshot, demoUrl, repoUrl } = $props();
    
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

        for (let idx = 0; idx < word.length; idx += maxCharsPerLine) {
          lines.push(word.slice(idx, idx + maxCharsPerLine));
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

    const nameLines = $derived(wrapText(name, 18, 2));
    const descriptionLines = $derived(wrapText(description, 28, 2));
</script>

<div style="filter: drop-shadow(4px 4px 0px rgba(27, 45, 72, 0.1));">
  <svg width="320" height="440" viewBox="0 0 320 440" xmlns="http://www.w3.org/2000/svg">
    
    <path d="M10,20 Q20,5 60,10 L280,5 Q310,15 305,40 L315,400 Q300,430 240,425 L40,435 Q10,425 15,370 L10,100 Z" 
          fill="#F3E1AD" 
          stroke="#1B2D48" 
          stroke-width="4" 
          stroke-linejoin="round" />

    <g transform="translate(30, 40)">
      <path d="M5,10 Q10,2 30,5 L240,2 Q255,5 252,20 L258,160 Q240,175 120,170 L20,178 Q5,170 8,100 Z" 
            fill="#E8D5A0" stroke="#1B2D48" stroke-width="2" opacity="0.8"/>
      <image href={screenshot} x="0" y="0" width="260" height="170" clip-path="inset(0% round 8px)"/>
    </g>

    <text x="30" y="240" font-family="'Comic Sans MS', 'Chalkboard SE', sans-serif" font-weight="900" font-size="18" fill="#1B2D48" style="text-transform: uppercase;">
      {#each nameLines as line, index}
        <tspan x="30" dy={index === 0 ? 0 : 18}>{line}</tspan>
      {/each}
    </text>

    <foreignObject x="30" y="268" width="260" height="24">
      <a href="https://hackclub.slack.com/team/U091DE0M4NB" target="_blank" rel="noopener noreferrer">
        <div style="font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; font-style: italic; font-weight: 700; font-size: 12px; color: #EC3750; display: flex; align-items: center; gap: 6px;">
          <DisplayName slackId={slackId} /><Avatar slackId={slackId} style="width: 24px; height: 24px; border-radius: 50%;" />
        </div>
      </a>
    </foreignObject>
    
    <text x="30" y="300" font-family="sans-serif" font-size="12" fill="#1B2D48" opacity="0.8">
      {#each descriptionLines as line, index}
        <tspan x="30" dy={index === 0 ? 0 : 14}>{line}</tspan>
      {/each}
    </text>

    <g transform="translate(30, 365)">
      <a href={demoUrl} style="cursor: pointer;" target="_blank" rel="noopener noreferrer">
        <g>
          <path d="M5,8 Q10,2 25,5 L120,2 Q130,5 128,15 L132,30 Q120,38 90,35 L20,38 Q5,35 8,20 Z" 
                fill="#FFB400" stroke="#1B2D48" stroke-width="2.5" />
          <text x="65" y="22" text-anchor="middle" font-family="'Comic Sans MS', 'Chalkboard SE', sans-serif" font-weight="900" font-size="12" fill="#1B2D48">LIVE DEMO</text>
          <path d="M12,10 Q20,6 35,8" fill="none" stroke="white" stroke-width="1.5" opacity="0.4" />
        </g>
      </a>

      <a href={repoUrl} style="cursor: pointer;" target="_blank" rel="noopener noreferrer" transform="translate(140, 0)">
        <g>
          <path d="M5,8 Q10,2 25,5 L120,2 Q130,5 128,15 L132,30 Q120,38 90,35 L20,38 Q5,35 8,20 Z" 
                fill="#FFB400" stroke="#1B2D48" stroke-width="2.5" />
          <text x="65" y="22" text-anchor="middle" font-family="'Comic Sans MS', 'Chalkboard SE', sans-serif" font-weight="900" font-size="12" fill="#1B2D48">VIEW CODE</text>
          <path d="M12,10 Q20,6 35,8" fill="none" stroke="white" stroke-width="1.5" opacity="0.4" />
        </g>
      </a>
    </g>
  </svg>
</div>