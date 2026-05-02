<script>
  import { page } from '$app/stores';
  import Button from './button.svelte';
  let isMobileOpen = $state(false);
  import { Avatar } from 'hackclub-forms';
  const navItems = [
    { label: 'Home', href: '/dashboard'},
    { label: 'Shop', href: '/dashboard/shop' },
  ];
  
  const isActive = (href) => {
    return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
  };
</script>

<div class="sidebar-container">
  <!-- Mobile Toggle Button -->
  <button 
    class="mobile-toggle"
    onclick={() => isMobileOpen = !isMobileOpen}
    aria-label="Toggle navigation"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>

  <!-- Sidebar -->
  <nav class="sidebar" class:open={isMobileOpen}>
    <!-- Header -->
    <div class="sidebar-header">
      <!--<h2>TREASURE HUNT</h2>
      <button 
        class="close-btn"
        onclick={() => isMobileOpen = false}
        aria-label="Close navigation"
      >
        ✕
      </button>-->
      <img src="/assets/Text-Logo (one line).webp" alt="Treasure Hunt Logo" class="h-20 md:h-24 object-contain" />
    </div>

    <!-- Navigation Items -->
    <ul class="nav-list">
      {#each navItems as item}
        <Button href={item.href} text={item.label} />
      {/each}
    </ul>

    <!-- Footer Info -->
    <div class="sidebar-footer">
      Remember to put the footer info here
    </div>
  </nav>

</div>

<style>
  .sidebar-container {
    position: relative;
    height: 100%;
  }

  .mobile-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: #1B2D48;
    z-index: 50;
  }

  .sidebar {
    width: 250px;
    background: linear-gradient(135deg, #6f4326 0%, #593219 50%, #6f4326 100%);
    border-right: 3px solid #E8BB35;
    display: flex;
    flex-direction: column;
    height: 100vh;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
  }

  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid #E8BB35;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    position: relative;
  }

  .sidebar-header h2 {
    margin: 0;
    font-family: 'Luckiest Guy', cursive;
    color: #ffe4b5;
    font-size: 1.25rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    -webkit-text-stroke: 0.5px #3a1e10;
    text-align: center;
  }

  .close-btn {
    display: none;
    background: none;
    border: none;
    color: #ffe4b5;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .nav-list {
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .nav-list li {
    padding: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    color: #ffe4b5;
    text-decoration: none;
    transition: all 0.2s ease;
    border-left: 4px solid transparent;
    font-weight: 500;
  }

  .nav-item:hover {
    background-color: rgba(255, 228, 181, 0.1);
    border-left-color: #E8BB35;
    padding-left: 1.75rem;
  }

  .nav-item.active {
    background-color: rgba(232, 187, 53, 0.2);
    border-left-color: #E8BB35;
    color: #FFB400;
    font-weight: 600;
  }

  .nav-icon {
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
  }

  .nav-label {
    flex: 1;
  }

  .sidebar-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(232, 187, 53, 0.3);
    font-size: 0.75rem;
    color: #ffe4b5;
    text-align: center;
    opacity: 0.8;
  }

  .sidebar-footer p {
    margin: 0;
  }

  .overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    .mobile-toggle {
      display: flex;
    }

    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      transform: translateX(-100%);
      z-index: 45;
      border-radius: 0 8px 8px 0;
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .overlay {
      display: block;
    }

    .overlay.hidden {
      display: none;
    }

    .close-btn {
      display: flex;
    }
  }
</style>
