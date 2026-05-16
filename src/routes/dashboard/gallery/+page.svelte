<script>
    import GalleryCard from '$lib/commponents/galleryCard.svelte';
    import { onMount } from 'svelte';
    
    let projects = $state([]);
    let isLoading = $state(true);
    let error = $state('');
    
    onMount(async () => {
        try {
            const response = await fetch('/api/gallery');
            if (!response.ok) throw new Error('Failed to fetch gallery');
            projects = await response.json();
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load gallery';
            console.error('Error loading gallery:', err);
        } finally {
            isLoading = false;
        }
    });
</script>

<div style="width: 100%; min-height: 100vh; padding: 2rem;">
    {#if isLoading}
        <p style="text-align: center; font-size: 1.2rem; color: #1B2D48;">Loading gallery...</p>
    {:else if error}
        <p style="text-align: center; font-size: 1.2rem; color: #EC3750;">Error: {error}</p>
    {:else if projects.length === 0}
        <p style="text-align: center; font-size: 1.2rem; color: #1B2D48;">No projects in gallery yet.</p>
    {:else}
        <div style="display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center;">
            {#each projects as project, index (index)}
                <GalleryCard 
                    name={project.name} 
                    slackId={project.slackId} 
                    description={project.description} 
                    screenshot={project.screenshot} 
                    demoUrl={project.demoUrl} 
                    repoUrl={project.repoUrl} 
                />
            {/each}
        </div>
    {/if}
</div>