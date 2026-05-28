<script lang="ts">
  import { page } from "$app/stores";
  import { tick } from 'svelte';
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
    const errorMessage = $derived(data.error);

    // Initialize form fields as empty
    let hackatimeProjectValue = $state('');
    let projectName = $state('');
    let description = $state('');
    let codeUrl = $state('');
    let readmeUrl = $state('');
    let demoUrl = $state('');
    let aiUsage = $state('');
    let projectType = $state('');
    let projectTypeOther = $state('');
    // tweak overlay position if needed
    let overlayLeft = 80;
    let overlayTop = 970;

    // Prevent double submits
    let isUpdating = $state(false);
    let isSubmitting = $state(false);

    const isWebUrl = (value: string) => /^https?:\/\//i.test(value.trim());

    // Populate from server data on initial load
    $effect(() => {
      if (data?.projectData) {
        hackatimeProjectValue = data.projectData.hackatimeProject || '';
        projectName = data.projectData.projectName || '';
        description = data.projectData.description || '';
        codeUrl = data.projectData.codeUrl || '';
        readmeUrl = data.projectData.readmeUrl || '';
        demoUrl = data.projectData.demoUrl || '';
        aiUsage = data.projectData.aiUsage || '';
        screenshotUrl = data.projectData.screenshot || '';
        projectType = data.projectData.projectType || '';
        // if projectType is not a known option, set it to Other and put value in Other field
        const known = ['web apps','window software','mac software','linux software','cross platform software','python','android app','ios app'];
        if (projectType && !known.includes(projectType)) {
          projectTypeOther = projectType;
          projectType = 'Other';
        }
      }
    });


    async function sendUpdateProject(redirectAfter = true) {
        if (isUpdating) return false;
        isUpdating = true;
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
                  aiUsage,
                  projectType: projectType === 'Other' ? projectTypeOther : projectType
                }),
            });
            if (res.ok) {
                if (redirectAfter) {
                  goto('/dashboard/projects');
                }
                return true;
            } else {
                const errorData = await res.json();
                alert(`Failed to update project: ${errorData.message || 'Unknown error'}`);
                return false;
            }
        } catch (error) {
            console.error("Error updating project:", error);
            alert(`An error occurred while updating the project. Please try again later.`);
              return false;
        } finally {
            isUpdating = false;
        }
    }

          async function sendSubmitProject() {
            if (isSubmitting) return;

            // Client-side validation: ensure ALL fields are present before submitting
            if (!projectName || !description || !codeUrl || !readmeUrl || !demoUrl || !screenshotUrl || !aiUsage || !hackatimeProjectValue) {
                alert('Please fill in ALL fields (Project Name, Description, Code URL, README URL, Demo URL, Screenshot, AI Usage, and Hackatime Project) before submitting.');
                return;
            }

            isSubmitting = true;
            const updated = await sendUpdateProject(false);
            if (!updated) {
                isSubmitting = false;
                return;
            }

            try {
              const res = await fetch(`/api/projects/submit/${journey}`, {
                method: "GET",
              });

              if (res.ok) {
                goto('/dashboard/projects');
              } else {
                const errorData = await res.json();
                alert(`Failed to submit project: ${errorData.error || 'Unknown error'}`);
              }
            } catch (error) {
              console.error("Error submitting project:", error);
              alert(`An error occurred while submitting the project. Please try again later.`);
            } finally {
              isSubmitting = false;
            }
          }
</script>


<div style="width: 100%; max-width: 800px; margin: 20px auto; filter: drop-shadow(8px 8px 0px rgba(27, 45, 72, 0.15)); position: relative;">
  <svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
    <!-- Main Form Scroll (Closed Path) -->
    <path d="M40,50 Q60,20 200,30 L600,20 Q760,30 750,110 L770,1110 Q740,1190 590,1180 L160,1200 Q40,1190 55,1060 L30,310 Q25,70 40,50 Z" 
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
      <foreignObject x="0" y="348" width="310" height="24">
        {#if isWebUrl(readmeUrl)}
          <a href={readmeUrl} target="_blank" rel="noreferrer" style="font-family: 'Luckiest Guy', cursive; font-size: 12px; color: #1B2D48; text-decoration: underline;">
            Open README
          </a>
        {/if}
      </foreignObject>

      <text x="330" y="295" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">DEMO URL</text>
      <foreignObject x="330" y="305" width="310" height="40">
      <input bind:value={demoUrl} type="text" id="demoUrl" placeholder="https://hackclub.com" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
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
      <text x="0" y="680" font-family="'Luckiest Guy', cursive" font-weight="bold" font-size="16" fill="#1B2D48">HACKATIME PROJECT NAME</text>
      <foreignObject x="0" y="690" width="640" height="40">
      <HackatimeProjects slackId={data.slackId} startingDate="2025-01-01" bind:value={hackatimeProjectValue} name="hackatimeProject" style="width: 100%; height: 100%; background: #E8D5A0; border: 2px solid #1B2D48; border-radius: 8px; padding: 0 10px; box-sizing: border-box;" />
      </foreignObject>

      <!-- Project Type (native overlay will be added above SVG) -->

      <!-- Submit Button Placeholder (Matching your Dashboard style) -->
      <foreignObject x="84" y="900" width="220" height="46">
        <button
          type="button"
          onclick={() => sendUpdateProject()}
          disabled={isUpdating}
          data-sveltekit-preload-data="eager"
          style="width: 100%; height: 100%; border: 3px solid #1B2D48; border-radius: 18px 8px 20px 10px; background: #FFB400; color: #1B2D48; font-family: 'Luckiest Guy', cursive; font-size: 16px; font-weight: 900; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2);"
        >
          {#if isUpdating}UPDATING...{:else}UPDATE{/if}
        </button>
      </foreignObject>
      <foreignObject x="336" y="900" width="220" height="46">
        <button
          type="button"
          onclick={() => sendSubmitProject()}
          disabled={isSubmitting}
          data-sveltekit-preload-data="eager"
          style="width: 100%; height: 100%; border: 3px solid #1B2D48; border-radius: 10px 20px 8px 18px; background: #3E6B4B; color: #F6F2E8; font-family: 'Luckiest Guy', cursive; font-size: 16px; letter-spacing: 0.6px; font-weight: 900; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22);"
        >
          {#if isSubmitting}SUBMITTING...{:else}SUBMIT{/if}
        </button>
      </foreignObject>
    </g>

    <!-- Decorative Bottom Detail -->
    <path d="M700,900 L730,930 M710,930 L740,900" stroke="#EC3750" stroke-width="5" stroke-linecap="round" opacity="0.6" />
  </svg>
  <!-- absolutely positioned native select placed over the SVG so it appears in the same visual spot but works reliably -->
  <div style={`position:absolute; left:${overlayLeft}px; top:${overlayTop}px; width:640px; pointer-events:auto; z-index:1000;`}>
    <label for="projectTypeOverlay" style="position:absolute; left:0; top:-26px; font-family: 'Luckiest Guy', cursive; font-weight:bold; color:#1B2D48;">PROJECT TYPE</label>
    <select id="projectTypeOverlay" required onchange={(e) => { projectType = (e.target as HTMLSelectElement).value; projectTypeOther = ''; }} style="width:100%; height:40px; background:#E8D5A0; border:2px solid #1B2D48; border-radius:8px; padding:0 10px; box-sizing:border-box;">
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
