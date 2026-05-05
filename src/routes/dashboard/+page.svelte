<script>
    const DeadlineDate = new Date("June 30, 2026 23:59:59").getTime();

    let timeRemaining = DeadlineDate - Date.now();

    var days = $state(Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
    var hours = $state(Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    var minutes = $state(Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)));
    var seconds = $state(Math.floor((timeRemaining % (1000 * 60)) / 1000));

    // Update the countdown every second
    setInterval(() => {
        timeRemaining = DeadlineDate - Date.now();
        days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    }, 1000);
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
