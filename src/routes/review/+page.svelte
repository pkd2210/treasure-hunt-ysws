<script>
    import { page } from '$app/stores';
    import { derived } from 'svelte/store';
    import { Badge } from "$lib/shad/components/ui/badge/index.ts"
    import { preloadCode, preloadData } from '$app/navigation';
    import { onMount } from 'svelte';

    // preload dashboard
    onMount(() => {
        preloadData('/dashboard');
        preloadCode('/dashboard');
    });
    const projects = [
        {
            id: "id1",
            projectName: "Projehjkct 1",
            description: "This is the first project.",
            codeUrl: "https://github.com/hackclub/project1",
            readmeUrl: "https://github.com/hackclub/project1/blob/main/README.md",
            demoUrl: "https://project1.hackclub.com",
            screenshot: "https://via.placeholder.com/150",
            aiUsage: "Bla bla bla used bla bla",
            hackatimeProject: "hackatime-project-1",
            user: "U091DE0M4NB",
            journeyNumber: 1,
            type: "Web app",
            status: "pending"
        },
        {
            id: "id2",
            projectName: "Projetrct 2",
            description: "This is the second project.",
            codeUrl: "https://github.com/hackclub/project2",
            readmeUrl: "https://github.com/hackclub/project2/blob/main/README.md",
            demoUrl: "https://project2.hackclub.com",
            screenshot: "https://via.placeholder.com/150",
            aiUsage: "Bla bla bla used bla bla",
            hackatimeProject: "hackatime-project-2",
            user: "U091DE0M4NB",
            journeyNumber: 2,
            type: "App",
            status: "pending"
        }
    ];

    function getProjectTypeList(projects) {
        const types = new Set();
        projects.forEach(project => types.add(project.type));
        return Array.from(types);
    }
    function typeToAmount(type) {
        return projects.filter(project => project.type === type && project.status === "pending").length;
    }
    function pendingAmount() {
        return projects.filter(project => project.status === "pending").length;
    }
    function getProjectsPerType(type) {
        return projects.filter(project => project.type === type && project.status === "pending");
    }

    let activeType = derived(page, ($page) => $page.url.searchParams.get('type') || 'all');
</script>
<div class="flex flex-row flex-wrap items-center gap-4">
<a href="/review?type=all">
{#if $activeType === "all"}
    <Badge class="whitespace-nowrap">pending: {pendingAmount()}</Badge>
{:else}
    <Badge class="whitespace-nowrap" variant="secondary">pending: {pendingAmount()}</Badge>
{/if}
</a>
{#each getProjectTypeList(projects) as type}
<a href={`/review?type=${type}`}>
    {#if $activeType === type}
        <Badge class="whitespace-nowrap">{type}: {typeToAmount(type)}</Badge>
    {:else}
    <Badge variant="secondary" class="whitespace-nowrap">{type}: {typeToAmount(type)}</Badge>
    {/if}
</a>
{/each}
|
<a href="/review?type=stats">
{#if $activeType === "stats"}
    <Badge class="whitespace-nowrap">Statistics</Badge>
{:else}
    <Badge variant="secondary" class="whitespace-nowrap">Statistics</Badge>
{/if}
</a>
<a href="/dashboard">
    <Badge variant="secondary" class="whitespace-nowrap">Dashboard</Badge>
</a>
</div>
<div class="mt-4 flex flex-col gap-4">
{#if $activeType === "all"}
    {#each projects.filter(project => project.status === "pending") as project}
    <a href={`/review/${project.id}`}>
        <div class="p-4 rounded-md border border-border bg-secondary">
            <div class="font-bold text-primary-foreground">{project.projectName}</div>
            <div class="text-sm text-foreground/80">{project.description}</div>
            <div class="mt-2 text-xs text-foreground/70">type: {project.type} — journey {project.journeyNumber}</div>
        </div>
    </a>
    {/each}
{:else if $activeType === "stats"}
    <div class="p-4 rounded-md border border-border bg-secondary">
        <div class="font-bold text-primary-foreground">Statistics</div>
        <div class="text-sm text-foreground/80">Total pending projects: {pendingAmount()}</div>
        <div class="text-sm text-foreground/80">Total projects: {projects.length}</div>
        <hr class="my-2 border-border" />
        pending projects per type:
        {#each getProjectTypeList(projects) as type}
            <div class="text-sm text-foreground/80">{type}: {typeToAmount(type)}</div>
        {/each}
    </div>
{:else}
    {#each getProjectsPerType($activeType) as project}
    <a href={`/review/${project.id}`}>
        <div class="p-4 rounded-md border border-border bg-secondary">
            <div class="font-bold text-primary-foreground">{project.projectName}</div>
            <div class="text-sm text-foreground/80">{project.description}</div>
            <div class="mt-2 text-xs text-foreground/70">type: {project.type} — journey {project.journeyNumber}</div>
        </div>
    </a>
    {/each}
{/if}
</div>