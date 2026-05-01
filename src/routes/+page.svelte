<script lang=ts>
    let { data } = $props();
</script>

<header class="w-full">
    <div class="flex w-full items-center justify-between">
        <img alt="Hackclub banner" src="https://cdn.hackclub.com/019de4a9-41f7-7f6d-b4c7-8c549bfb001d/flag-orpheus-left.svg" class="h-25 w-45" />
        <div class="fixed top-4 right-4 z-100 md:top-8 md:right-8">
            {#if data.slackId}
                <a class="btn btn-outline border-2 bg-bp-dark px-2 py-1 text-base md:px-4 md:py-2 md:text-xl" href="/dashboard"><span>DASHBOARD</span></a>
            {:else}
            <a class="btn btn-outline border-2 bg-bp-dark px-2 py-1 text-base md:px-4 md:py-2 md:text-xl" href="/api/login"><span>LOGIN & SIGNIN</span></a>
            {/if}
        </div>
    </div>
</header>