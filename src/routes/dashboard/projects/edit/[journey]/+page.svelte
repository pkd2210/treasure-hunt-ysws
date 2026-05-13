<script lang="ts">
    import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { HackatimeProjects } from "hackclub-forms";
  import { createUploader } from "$lib/utils/uploadthing.js";
  import { UploadDropzone } from "@uploadthing/svelte";

  let screenshotUrl = $state('');
  const uploader = createUploader("imageUploader", {
    onClientUploadComplete: (res) => {
      console.log(`onClientUploadComplete`, res);
      screenshotUrl = res[0].ufsUrl;
    },
    onUploadError: (error: Error) => {
      alert(`ERROR! ${error.message}`);
    },
  });


    let { data } = $props();

    const journey = $derived(Number(get(page).params.journey));

    let projects = $state({});
    let errorMessage = $state('');
    let hackatimeProjectValue = $state('');

    let projectName = $state('');
    let description = $state('');
    let codeUrl = $state('');
    let readmeUrl = $state('');
    let demoUrl = $state('');
    let aiUsage = $state('');


    onMount(async () => {
      try {
        const res = await fetch(`/api/projects/getProjects`);
        const json = await res.json();
        projects = json || {};
        // projects are organized by journey number, so access directly
        const journeyProjects = projects[journey] || [];
        // set all fields based on the first project in the journey (if it exists)
        if (journeyProjects.length > 0) {
          const p = journeyProjects[0];
            projectName = p.projectName || '';
            hackatimeProjectValue = p.hackatimeProject || '';
            screenshotUrl = p.screenshot || '';
            description = p.description || '';
            codeUrl = p.codeUrl || '';
            readmeUrl = p.readmeUrl || '';
            demoUrl = p.demoUrl || '';
            aiUsage = p.aiUsage || '';
        }

      } catch (error) {
        console.error("Error fetching projects:", error);
        errorMessage = "Failed to load projects. Please try again later.";
      }
    });

    async function sendUpdateProject() {
        try {
            const res = await fetch(`/api/projects/updateProject`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    journeyNumber: journey,
                    projectName,
                    hackatimeProject: hackatimeProjectValue,
                    screenshot: screenshotUrl,
                    description,
                    codeUrl,
                    readmeUrl,
                    demoUrl,
                    aiUsage
                }),
            });
            if (res.ok) {
                goto('/dashboard/projects');
            } else {
                const errorData = await res.json();
                alert(`Failed to update project: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error updating project:", error);
            alert(`An error occurred while updating the project. Please try again later.`);
        }
    }
</script>


<div style="width: 100%; max-width: 800px; margin: 20px auto; filter: drop-shadow(8px 8px 0px rgba(27, 45, 72, 0.15));">
  <svg viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
    <!-- Main Form Scroll (Closed Path) -->
    <path d="M40,50 Q60,20 200,30 L600,20 Q760,30 750,110 L770,910 Q740,990 590,980 L160,1000 Q40,990 55,860 L30,310 Q25,70 40,50 Z" 
          fill="#F3E1AD" 
          stroke="#1B2D48" 
          stroke-width="5" 
          stroke-linejoin="round" />

    <!-- Header -->
    <text x="400" y="90" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="32" fill="#1B2D48">UPDATE YOUR PROJECT</text>
    <text x="400" y="130" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="28" fill="#1B2D48">JOURNEY {journey}</text>
    <line x1="250" y1="150" x2="550" y2="150" stroke="#1B2D48" stroke-width="2" stroke-dasharray="5,5" opacity="0.4" />

    <!-- Form Fields Group -->
    <g transform="translate(80, 180)">
      
      <!-- Project Name -->
      <text x="0" y="0" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">PROJECT NAME</text>
      <foreignObject x="0" y="10" width="640" height="40">
      <input bind:value={projectName} type="text" id="projectName" placeholder="A Ver Cool project!" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>

      <!-- Description -->
      <text x="0" y="85" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">DESCRIPTION</text>
      <foreignObject x="0" y="95" width="640" height="80">
      <textarea bind:value={description} placeholder="A short yapping about your project..." style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 10px; box-sizing: border-box; resize: none;"></textarea>
      </foreignObject>

      <!-- Code URL -->
      <text x="0" y="210" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">CODE URL</text>
      <foreignObject x="0" y="220" width="640" height="40">
      <input bind:value={codeUrl} type="text" id="codeUrl" placeholder="https://github.com/hackclub/randomproject" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>

      <!-- Readme & Demo URL (Side by Side) -->
      <text x="0" y="295" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">README URL</text>
      <foreignObject x="0" y="305" width="310" height="40">
      <input bind:value={readmeUrl} type="text" id="readmeUrl" placeholder="https://github.com/hackclub/randomproject/readme.md" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>

      <text x="330" y="295" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">DEMO URL</text>
      <foreignObject x="330" y="305" width="310" height="40">
      <input bind:value={demoUrl} type="text" id="demoUrl" placeholder="https://hackclub.com" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>

      <!-- Screenshot Upload Area -->
      <text x="0" y="380" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">SCREENSHOT</text>
      <foreignObject x="0" y="390" width="640" height="120">
      <div style="width: 100%; height: 100%; border: 2px dashed #1B2D48; border-radius: 8px; overflow: hidden;">
        {#if screenshotUrl}
          <img src={screenshotUrl} alt="Screenshot" style="width: 100%; height: 100%; object-fit: contain; background: #E8D5A0;" />
          // remove image button
            <button
                type="button"
                onclick={() => screenshotUrl = ''}
                style="position: absolute; top: 10px; right: 10px; background: rgba(255, 255, 255, 0.8); border: 2px solid #1B2D48; border-radius: 50%; width: 30px; height: 30px; font-family: 'Luckiest Guy', cursive; font-size: 16px; font-weight: bold; color: #1B2D48; cursor: pointer;"
            >
                &times;
            </button>
        {:else}
          <div style="width: 100%; height: 100%;">
            <UploadDropzone {uploader}>
              <i slot="upload-icon" let:state>
                {state.isUploading ? "Uploading..." : "Pick a file"}
              </i>
              <span slot="button-content" let:state>
                {state.ready ? "Ready to upload" : "Loading..."}
              </span>
            </UploadDropzone>
          </div>
        {/if}
      </div>
      </foreignObject>

      <!-- AI Usage -->
      <text x="0" y="545" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">AI USAGE (HOW DID YOU USE IT?)</text>
      <foreignObject x="0" y="555" width="640" height="80">
      <textarea bind:value={aiUsage} id="aiUsage" placeholder="Describe how you used AI in your project (If you used it)..." style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 10px; box-sizing: border-box; resize: none;"></textarea>
      </foreignObject>

      <!-- Hackatime Project -->
      <text x="0" y="670" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">HACKATIME PROJECT NAME</text>
      <foreignObject x="0" y="680" width="640" height="40">
      <HackatimeProjects slackId={data.slackId} startingDate="2025-01-01" bind:value={hackatimeProjectValue} name="hackatimeProject" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>

      <!-- Submit Button Placeholder (Matching your Dashboard style) -->
      <foreignObject x="195" y="735" width="263" height="46">
        <button
          type="button"
          onclick={() => sendUpdateProject()}
          data-sveltekit-preload-data="eager"
          style="width: 100%; height: 100%; border: 3px solid #1B2D48; border-radius: 18px 8px 20px 10px; background: #FFB400; color: #1B2D48; font-family: 'Luckiest Guy', cursive; font-size: 16px; font-weight: 900; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2);"
        >
          UPDATE
        </button>
      </foreignObject>
    </g>

    <!-- Decorative Bottom Detail -->
    <path d="M700,900 L730,930 M710,930 L740,900" stroke="#EC3750" stroke-width="5" stroke-linecap="round" opacity="0.6" />
  </svg>
</div>
