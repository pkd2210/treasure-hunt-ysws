<script lang="ts">
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
    const projects = $derived(data.projects);
    const canCreate = $derived(data.canCreate);
    const errorMessage = $derived(data.errorMessage);

    let hackatimeProjectValue = $state('');

    // Check on mount if already has project (would have been handled server-side but can add client check if needed)
    let projectName = $state('');
    let description = $state('');
    let codeUrl = $state('');
    let readmeUrl = $state('');
    let demoUrl = $state('');
    let aiUsage = $state('');
    let projectType = $state('');
    let projectTypeOther = $state('');

    // overlay position (px) - tweak these if the select isn't perfectly aligned
    let overlayLeft = 80;
    let overlayTop = 970;

    // Prevent double submits from spam clicking
    let isCreating = $state(false);

    const isWebUrl = (value: string) => /^https?:\/\//i.test(String(value).trim());

    async function createProject() {
        if (isCreating) return;
        isCreating = true;
        const projectName = (document.getElementById('projectName') as HTMLInputElement)?.value || '';
        const description = (document.getElementById('description') as HTMLTextAreaElement)?.value || '';
        const codeUrl = (document.getElementById('codeUrl') as HTMLInputElement)?.value || '';
        const readmeUrl = (document.getElementById('readmeUrl') as HTMLInputElement)?.value || '';
        const demoUrl = (document.getElementById('demoUrl') as HTMLInputElement)?.value || '';
        const screenshot = screenshotUrl;
        const aiUsage = (document.getElementById('aiUsage') as HTMLTextAreaElement)?.value || '';
        const hackatimeProject = hackatimeProjectValue;


        if (!projectName || !description) {
            alert("Please fill in Project Name and Description");
            isCreating = false;
            return;
        }
        if (!projectType) {
          alert('Please select a project type');
          isCreating = false;
          return;
        }

        try {
            const request = {
              projectName,
              description,
              journeyNumber: journey,
              codeUrl,
              readmeUrl,
              demoUrl,
              screenshot,
              aiUsage,
              hackatimeProject,
              projectType: projectType === 'Other' ? projectTypeOther : projectType
            };
            
            const response = await fetch("/api/projects/createProject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            });

            if (response.ok) {
                alert("Project created successfully!");
                await goto("/dashboard/projects");
            } else {
                const error = await response.text();
                alert(`Failed to create project: ${error || response.statusText}`);
            }
        } catch (error) {
            alert(`Error: ${(error as any)?.message || String(error)}`);
        } finally {
            isCreating = false;
        }
    }
</script>


{#if canCreate}
<div style="width: 100%; max-width: 800px; margin: 20px auto; filter: drop-shadow(8px 8px 0px rgba(27, 45, 72, 0.15)); position: relative;">
  <svg viewBox="0 0 800 1300" xmlns="http://www.w3.org/2000/svg">
    <!-- Main Form Scroll (Closed Path) - extended lower curve -->
    <path d="M40,50 Q60,20 200,30 L600,20 Q760,30 750,110 L770,1110 Q740,1190 590,1180 L160,1200 Q40,1190 55,1060 L30,310 Q25,70 40,50 Z" 
          fill="#F3E1AD" 
          stroke="#1B2D48" 
          stroke-width="5" 
          stroke-linejoin="round" />

    <!-- Header -->
    <text x="400" y="90" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="32" fill="#1B2D48">CREATE YOUR PROJECT</text>
    <text x="400" y="130" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="28" fill="#1B2D48">JOURNEY {journey}</text>
    <line x1="250" y1="150" x2="550" y2="150" stroke="#1B2D48" stroke-width="2" stroke-dasharray="5,5" opacity="0.4" />

    <!-- Form Fields Group -->
    <g transform="translate(80, 180)">
      
      <!-- Project Name -->
      <text x="0" y="0" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">PROJECT NAME</text>
      <foreignObject x="0" y="10" width="640" height="40">
      <input type="text" id="projectName" placeholder="A Ver Cool project!" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>

      <!-- Description -->
      <text x="0" y="85" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">DESCRIPTION</text>
      <foreignObject x="0" y="95" width="640" height="80">
      <textarea id="description" placeholder="A short yapping about your project..." style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 10px; box-sizing: border-box; resize: none;"></textarea>
      </foreignObject>

      <!-- Code URL -->
      <text x="0" y="210" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">CODE URL</text>
      <foreignObject x="0" y="220" width="640" height="40">
      <input type="text" id="codeUrl" placeholder="https://github.com/hackclub/randomproject" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>

      <!-- Readme & Demo URL (Side by Side) -->
      <text x="0" y="295" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">README URL</text>
      <foreignObject x="0" y="305" width="310" height="40">
      <input type="text" id="readmeUrl" placeholder="https://github.com/hackclub/randomproject/readme.md" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>
      <foreignObject x="0" y="348" width="310" height="24">
        {#if isWebUrl(readmeUrl)}
          <a href={readmeUrl} target="_blank" rel="noreferrer" style="font-family: 'Luckiest Guy', cursive; font-size: 12px; color: #1B2D48; text-decoration: underline;">
            Open README
          </a>
        {/if}
      </foreignObject>

      <text x="330" y="295" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">DEMO URL</text>
      <foreignObject x="330" y="305" width="310" height="40">
      <input type="text" id="demoUrl" placeholder="https://hackclub.com" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>
      <foreignObject x="330" y="348" width="310" height="24">
        {#if isWebUrl(demoUrl)}
          <a href={demoUrl} target="_blank" rel="noreferrer" style="font-family: 'Luckiest Guy', cursive; font-size: 12px; color: #1B2D48; text-decoration: underline;">
            Open Demo
          </a>
        {/if}
      </foreignObject>

      <!-- Screenshot Upload Area -->
      <text x="0" y="380" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">SCREENSHOT</text>
      <foreignObject x="0" y="390" width="640" height="120">
      <div style="width: 100%; height: 100%; border: 2px dashed #1B2D48; border-radius: 8px; overflow: hidden;">
        {#if screenshotUrl}
          <img src={screenshotUrl} alt="Screenshot" style="width: 100%; height: 100%; object-fit: contain; background: #E8D5A0;" />
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
      <textarea id="aiUsage" placeholder="Describe how you used AI in your project (If you used it)..." style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 10px; box-sizing: border-box; resize: none;"></textarea>
      </foreignObject>

      

      <!-- Hackatime Project -->
      <text x="0" y="680" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">HACKATIME PROJECT NAME</text>
      <foreignObject x="0" y="690" width="640" height="40">
      <HackatimeProjects slackId={data.slackId} startingDate="2025-01-01" bind:value={hackatimeProjectValue} name="hackatimeProject" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>

      <!-- Project Type (native select overlay inserted below SVG) -->

      <!-- Submit Button Placeholder (Matching your Dashboard style) -->
      <foreignObject x="210" y="900" width="220" height="46">
        <button
          type="button"
          onclick={() => createProject()}
          disabled={isCreating}
          data-sveltekit-preload-data="eager"
          style="width: 100%; height: 100%; border: 3px solid #1B2D48; border-radius: 18px 8px 20px 10px; background: #FFB400; color: #1B2D48; font-family: 'Luckiest Guy', cursive; font-size: 16px; font-weight: 900; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2);"
        >
          {#if isCreating}CREATING...{:else}CREATE{/if}
        </button>
      </foreignObject>
    </g>

    <!-- Decorative Bottom Detail -->
    <path d="M700,900 L730,930 M710,930 L740,900" stroke="#EC3750" stroke-width="5" stroke-linecap="round" opacity="0.6" />
  </svg>
  <!-- absolutely positioned native select placed over the SVG so it appears in the same visual spot but works reliably -->
  <div style={`position:absolute; left:${overlayLeft}px; top:${overlayTop}px; width:640px; pointer-events:auto; z-index:1000;`}>
    <label for="projectTypeOverlay" style="position:absolute; left:0; top:-26px; font-family: 'Luckiest Guy', cursive; font-weight:bold; color:#1B2D48;">PROJECT TYPE</label>
    <select id="projectTypeOverlay" bind:value={projectType} required onchange={(e) => { projectType = (e.target as HTMLSelectElement).value; }} style="width:100%; height:40px; background:#E8D5A0; border:2px solid #1B2D48; border-radius:8px; padding:0 10px; box-sizing:border-box;">
      <option value="">Select a type</option>
      <option value="web apps">web apps</option>
      <option value="window software">window software</option>
      <option value="mac software">mac software</option>
      <option value="linux software">linux software</option>
      <option value="cross platform software">cross platform software</option>
      <option value="python">python</option>
      <option value="android app">android app</option>
      <option value="ios app">ios app</option>
      <option value="Other">Other</option>
    </select>
    <input bind:value={projectTypeOther} placeholder="If Other, specify" hidden={projectType !== 'Other'} style="width:100%; height:40px; display:block; background:#E8D5A0; border:2px solid #1B2D48; border-radius:8px; padding:0 10px; box-sizing:border-box; margin-top:8px;" />
  </div>
</div>
{:else}
<div style="width: 100%; max-width: 600px; margin: 40px auto; filter: drop-shadow(6px 6px 0px rgba(27, 45, 72, 0.2));">
  <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
    <!-- Wobbly Error Card (Closed Path) -->
    <path d="M30,40 Q50,10 200,20 L450,15 Q485,25 475,100 L485,280 Q450,330 250,320 L50,335 Q20,320 35,200 L25,80 Q20,35 30,40 Z" 
          fill="#F3E1AD" 
          stroke="#1B2D48" 
          stroke-width="4" 
          stroke-linejoin="round" />

    <!-- Error Icon (Exclamation Mark in Red) -->
    <g transform="translate(230, 60)">
      <circle cx="20" cy="20" r="25" fill="#EC3750" stroke="#1B2D48" stroke-width="3" />
      <text x="20" y="28" text-anchor="middle" font-family="monospace" font-weight="900" font-size="32" fill="#F3E1AD">!</text>
    </g>

    <!-- Error Message -->
    <text x="50%" y="145" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="20" fill="#1B2D48">
      HALT, EXPLORER!
    </text>
    
    <text x="50%" y="180" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#1B2D48" opacity="0.8">
      <tspan x="50%" dy="0">You cannot proceed because:</tspan>
      <tspan x="50%" dy="22" font-weight="bold" fill="#EC3750">{errorMessage}</tspan>
    </text>

    <!-- Return Button (Cloned from Dashboard Style) -->
    <a href="/dashboard/projects" style="cursor: pointer; text-decoration: none;">
      <g transform="translate(140, 240)">
        <path d="M5,8 Q10,2 30,5 L200,2 Q215,5 212,20 L218,35 Q200,43 110,40 L20,43 Q5,40 8,25 Z" 
              fill="#FFB400" 
              stroke="#1B2D48" 
              stroke-width="3" 
              stroke-linejoin="round" />
        <text x="110" y="25" text-anchor="middle" font-family="'Comic Sans MS', 'Chalkboard SE', sans-serif" font-weight="900" font-size="13" fill="#1B2D48">
          RETURN TO PROJECTS
        </text>
        <!-- Shine detail -->
        <path d="M15,12 Q25,8 45,10" fill="none" stroke="white" stroke-width="2" opacity="0.4" />
      </g>
    </a>
  </svg>
</div>
{/if}