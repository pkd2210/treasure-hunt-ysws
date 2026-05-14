<script>
      import ProjectCard from '$lib/commponents/projectCard.svelte';

      let { data } = $props();
      let projects = $derived(data.projects);
      let projectAmount = $derived(data.projectAmount);
      let error = $derived(data.error);
      let isLoading = $derived(false);

      const isCreateable = (journeyNum) => {
            if (projects[journeyNum]?.length) return false;

            if (journeyNum === 1) return true;

            const prevJourneySubmitted = projects[journeyNum - 1]?.length > 0;
            if (!prevJourneySubmitted) return false;

            if (journeyNum > 2) {
                  const twoBackApproved = projects[journeyNum - 2]?.some((project) => project.status === 'APPROVED');
                  if (!twoBackApproved) return false;
            }

            return true;
      };

</script>
<div style="width: 100%; max-width: 1000px; margin: 20px auto; filter: drop-shadow(10px 10px 0px rgba(27, 45, 72, 0.1));">
  <svg viewBox="0 0 1000 850" xmlns="http://www.w3.org/2000/svg">
    <!-- FIXED Main Map Container - Path now closes perfectly (Z) -->
    {#each Array.from({ length: 7 }, (_, i) => i + 1) as journeyNum}
      {#if projects[journeyNum]?.length}
        <ProjectCard number={journeyNum} project={projects[journeyNum][0]} locked={false} big={journeyNum === 7} />
      {:else}
            <ProjectCard number={journeyNum} create={true} locked={!isCreateable(journeyNum)} big={journeyNum === 7} />
      {/if}
    {/each}


  </svg>
</div>