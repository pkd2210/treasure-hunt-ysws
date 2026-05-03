<script>
  import SideNav from '$lib/commponents/SideNav.svelte';
  let { children, data } = $props();
</script>

<div class="dashboard-container">
  <SideNav slackId={data.slackId} displayName={data.displayName} avatarUrl={data.avatarUrl} goldBars={data.goldbars} />
  <main class="dashboard-content">
    {@render children()}
  </main>
</div>

<style>
  .dashboard-container {
    display: flex;
    min-height: 100vh;
  }

  .dashboard-content {
    flex: 1;
    min-width: 0;
    width: 100%;
    overflow-y: auto;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .dashboard-container {
      flex-direction: column;
    }

    .dashboard-content {
      padding: 1rem;
    }
  }
</style>