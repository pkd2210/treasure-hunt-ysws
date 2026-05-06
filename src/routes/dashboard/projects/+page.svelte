<script>
      import ProjectCard from '$lib/commponents/projectCard.svelte';
</script>
<div style="width: 100%; max-width: 1000px; margin: 20px auto; filter: drop-shadow(10px 10px 0px rgba(27, 45, 72, 0.1));">
  <svg viewBox="0 0 1000 850" xmlns="http://www.w3.org/2000/svg">
    <!-- FIXED Main Map Container - Path now closes perfectly (Z) -->
    
    <!-- Project 1 Slot -->
      <ProjectCard number=1 create={true} locked={false}></ProjectCard>

    <!-- Project 2 Slot -->
      <ProjectCard number=2 project={{
          name: 'JOURNEY #2',
          description: 'A Random Project name',
          status: 'UNSHIPPED',
      }}></ProjectCard>

    <!-- Project 3 Slot -->
      <ProjectCard number=3 project={{
          name: 'JOURNEY #3',
          description: 'A Random Project name',
          status: 'APPROVED',
      }}></ProjectCard>

    <!-- Project 4 Slot -->
      <ProjectCard number=4 project={{
             name: 'JOURNEY #4',
             description: 'A Random Project name',
             status: 'INREVIEW',
            }}></ProjectCard>

    <!-- Project 5 Slot -->
      <ProjectCard number=5 project={{
             name: 'JOURNEY #5',
             description: 'A Random Project name',
             status: 'NEED CHANGES',
            }}></ProjectCard>
    <!-- Project 6 Slot -->
      <ProjectCard number=6 project={{
             name: 'JOURNEY #6',
             description: 'A Random Project name',
             status: 'APPROVED',
            }}></ProjectCard>
       <!-- Project 7 Slot: only the card shape is stretched horizontally; texts remain normal size -->
      <ProjectCard number=7 create={true} project={{
             name: 'JOURNEY #7',
             description: 'A Random Project name',
             status: 'UNSHIPPED',
            }} big={true}></ProjectCard>


  </svg>
</div>