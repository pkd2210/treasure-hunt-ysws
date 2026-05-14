<script>
  import { onMount } from "svelte";

    const DeadlineDate = new Date("June 30, 2026 23:59:59").getTime();

    let timeRemaining = DeadlineDate - Date.now();

    var days = $state(Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
    var hours = $state(Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    var minutes = $state(Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)));
    var seconds = $state(Math.floor((timeRemaining % (1000 * 60)) / 1000));

    let timerInterval;

    // Load data from server
    let { data } = $props();
    let journeysStatus = $derived(data.journeysStatus);
    let projects = $derived(data.projects);

    const getJourneyState = (journeyProjects) => {
      const project = journeyProjects[0];
      if (!project) return "locked";

      const status = String(project.status ?? "unshipped").toLowerCase();
        return status;
    };

    const journeyPositions = {
      1: { x: 150, y: 480 },
      2: { x: 280, y: 420 },
      3: { x: 420, y: 380 },
      4: { x: 350, y: 250 },
      5: { x: 450, y: 180 },
      6: { x: 650, y: 250 },
      7: { x: 750, y: 180 }
    };

    const getJourneyPosition = (journeyNum) => journeyPositions[journeyNum] || { x: 0, y: 0 };

    const getStatusSymbol = (status) => {
      const symbols = {
        "approved": "✓",
        "unshipped": "⬆",
        "locked": "🔒",
        "unreviewed": "⏳",
        "rejected": "✗"
      };
      return symbols[status] || "?";
    };

    const getStatusColor = (status) => {
      const colors = {
        "approved": "#4CAF50",
        "unshipped": "#2196F3",
        "locked": "#1B2D48",
        "unreviewed": "#FF9800",
        "rejected": "#D32F2F"
      };
      return colors[status] || "#9E9E9E";
    };

    const getTextColor = (status) => {
      return status === "locked" ? "#F3E1AD" : "#1B2D48";
    };

    const getLastNonLockedJourney = () => {
      for (let i = journeysStatus.length - 1; i >= 0; i--) {
        if (journeysStatus[i] !== "locked") {
          return i + 1;
        }
      }
      return null;
    };

    onMount(() => {
      // Update the countdown every second.
      timerInterval = setInterval(() => {
        timeRemaining = DeadlineDate - Date.now();
        days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    });
</script>
<div class="text-center">
  <div class="dashboard-timer-shell" style="filter: drop-shadow(6px 6px 0px rgba(27, 45, 72, 0.2));">
    <svg viewBox="0 0 450 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="width:80%; height:auto; display:block;">
      <!-- Main Card Body: "Urgent Parchment" style -->
      <path d="M10,20 Q15,5 40,8 L410,5 Q440,10 435,35 L445,145 Q440,175 410,170 L40,175 Q10,170 15,140 Z" 
            fill="#F3E1AD" stroke="#1B2D48" stroke-width="4" />

      <!-- Title: "TIME IS RUNNING OUT" -->
      <text class="title" x="50%" y="45" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="22" fill="#1B2D48" style="text-transform: uppercase; letter-spacing: 2px;">
        ⏳ MISSION DEADLINE
      </text>

      <!-- Timer Container Boxes -->
      <g transform="translate(45, 65)">
        <!-- Day -->
        <rect x="0" y="0" width="80" height="70" rx="8" fill="#E8D5A0" stroke="#1B2D48" stroke-width="2" />
        <text class="value" x="40" y="50" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="44" fill="#EC3750">{days}</text>
        <text class="label" x="40" y="92" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-size="14" font-weight="900" fill="#1B2D48">DAYS</text>

        <!-- Colon -->
        <text class="colon" x="90" y="45" text-anchor="middle" font-size="32" font-weight="bold" fill="#1B2D48">:</text>

        <!-- Hour -->
        <rect x="100" y="0" width="60" height="70" rx="8" fill="#E8D5A0" stroke="#1B2D48" stroke-width="2" />
        <text class="value" x="130" y="50" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="44" fill="#EC3750">{hours}</text>
        <text class="label" x="130" y="92" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-size="14" font-weight="900" fill="#1B2D48">HRS</text>

        <!-- Colon -->
        <text class="colon" x="170" y="45" text-anchor="middle" font-size="32" font-weight="bold" fill="#1B2D48">:</text>

        <!-- Min -->
        <rect x="180" y="0" width="60" height="70" rx="8" fill="#E8D5A0" stroke="#1B2D48" stroke-width="2" />
        <text class="value" x="210" y="50" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="44" fill="#EC3750">{minutes}</text>
        <text class="label" x="210" y="92" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-size="14" font-weight="900" fill="#1B2D48">MIN</text>

        <!-- Colon -->
        <text class="colon" x="250" y="45" text-anchor="middle" font-size="32" font-weight="bold" fill="#1B2D48">:</text>

        <!-- Sec -->
        <rect x="260" y="0" width="60" height="70" rx="8" fill="#E8D5A0" stroke="#1B2D48" stroke-width="2" />
        <text class="value" x="290" y="50" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="44" fill="#EC3750">{seconds}</text>
        <text class="label" x="290" y="92" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-size="14" font-weight="900" fill="#1B2D48">SEC</text>
      </g>

      <!-- Decorative "Burnt" Corner -->
      <path d="M420,150 Q440,160 430,175 L445,175 L445,140 Z" fill="#1B2D48" opacity="0.1" />
    </svg>
  </div>
</div>
<!-- make a divider -->
<div class="divider"></div>
<div style="width: 100%; max-width: 900px; margin: 20px auto; filter: drop-shadow(8px 8px 0px rgba(27, 45, 72, 0.15));">
  <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
    <!-- Main Map Background -->
    <path d="M40,50 Q60,20 200,30 L750,20 Q860,40 850,120 L870,520 Q820,580 400,570 L80,585 Q30,570 45,350 L25,100 Q20,50 40,50 Z" 
          fill="#F3E1AD" 
          stroke="#1B2D48" 
          stroke-width="5" 
          stroke-linejoin="round" />

    <!-- Title -->
    <text x="50%" y="80" text-anchor="middle" font-family="'Comic Sans MS', 'Chalkboard SE', sans-serif" font-weight="900" font-size="32" fill="#1B2D48">THE SEVEN JOURNEYS</text>

    <!-- THE 7 TRAILS (Dashed Paths) -->
    <!-- Trail 1-2 (Completed) -->
    <path d="M150,480 Q200,400 280,420" fill="none" stroke="#1B2D48" stroke-width="4" stroke-dasharray="8,8" opacity="0.3" />
    
    <!-- Trail 2-3 (Completed) -->
    <path d="M280,420 Q350,450 420,380" fill="none" stroke="#1B2D48" stroke-width="4" stroke-dasharray="8,8" opacity="0.3" />
    
    <!-- Trail 3-4 (Active/In Progress) -->
    <path d="M420,380 Q480,300 350,250" fill="none" stroke="#1B2D48" stroke-width="4" stroke-dasharray="8,8" opacity="0.3" />
    
    <!-- Trail 4-5 -->
    <path d="M350,250 Q250,200 450,180" fill="none" stroke="#1B2D48" stroke-width="4" stroke-dasharray="8,8" opacity="0.3" />
    
    <!-- Trail 5-6 -->
    <path d="M450,180 Q600,150 650,250" fill="none" stroke="#1B2D48" stroke-width="4" stroke-dasharray="8,8" opacity="0.3" />
    
    <!-- Trail 6-7 -->
    <path d="M650,250 Q750,300 750,180" fill="none" stroke="#1B2D48" stroke-width="4" stroke-dasharray="8,8" opacity="0.3" />

    <!-- JOURNEY MARKERS -->
    {#each Array.from({ length: 7 }, (_, i) => i + 1) as journeyNum}
      {@const status = journeysStatus[journeyNum - 1]}
      {@const lastNonLocked = getLastNonLockedJourney()}
      {@const pos = getJourneyPosition(journeyNum)}
      {@const circleColor = getStatusColor(status)}
      {@const textColor = getTextColor(status)}
      {@const symbol = getStatusSymbol(status)}

      {#if journeyNum === lastNonLocked && status !== "locked"}
        <!-- Last non-locked journey: Special highlight with status color -->
        <g transform="translate({pos.x}, {pos.y})">
          <circle r="25" fill="#F3E1AD" stroke={circleColor} stroke-width="4" stroke-dasharray="4,2" />
          <text y="7" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="16" fill={circleColor}>{journeyNum}</text>
        </g>
      {:else}
        <!-- All other journeys: Regular status display -->
        {#if status !== undefined}
          <g transform="translate({pos.x}, {pos.y})">
            <circle r="22" fill={circleColor} stroke="#1B2D48" stroke-width="3" />
            <text y="7" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="18" fill={textColor}>{symbol}</text>
          </g>
        {/if}
      {/if}
    {/each}


    <g transform="translate(750, 180)">
      <!-- Gold circle background -->
      <circle r="28" fill="#FFB400" stroke="#1B2D48" stroke-width="3" />
      <!-- Star in center -->
      <text x="0" y="8" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="28" fill="#1B2D48">★</text>
      <!-- THE FINISH label below -->
      <text x="0" y="48" text-anchor="middle" font-family="'Luckiest Guy', cursive" font-weight="900" font-size="12" fill="#1B2D48">THE FINISH</text>
    </g>

  </svg>
</div>
<style>
  .dashboard-timer-shell {
    width: clamp(320px, 60vw, 760px);
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Ensure the SVG scales down nicely on small phones */
    @media (max-width: 420px) {
    .dashboard-timer-shell {
      width: 100%;
      padding: 10px 8px 0 8px;
      overflow: visible;
      box-sizing: border-box;
    }
    /* Make the entire card larger but keep it centered and visible */
    .dashboard-timer-shell svg {
      width: 100% !important;
      /* increase rendered height so the card appears bigger vertically */
      max-width: 640px;
      margin: 0 auto 6px auto;
      display: block;
      transform: none !important;
    }
    /* Mobile-only: make title, numbers, and labels larger */
    .dashboard-timer-shell svg .title {
      font-size: 32px !important;
    }
    .dashboard-timer-shell svg .value {
      font-size: 52px !important;
    }
    .dashboard-timer-shell svg .label {
      font-size: 18px !important;
    }
  }
  .divider {
    width: 80%;
    height: 2px;
    background-color: #1B2D48;
    margin: 2rem auto;
    opacity: 0.3;
  }
</style>
