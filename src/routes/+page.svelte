<script lang=ts>
    let { data } = $props();
    import { preloadData } from '$app/navigation';
    import { onMount } from 'svelte';
    import FaqCard from '$lib/commponents/faqCard.svelte';
    
    onMount(() => {
        if (data.slackId) {
            preloadData('/dashboard');
        }
    });
</script>
<style>
    @keyframes jump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    .animate-jump {
        animation: jump 1s infinite;
    }

    .wood-pattern {
        width: 100%;
        min-height: 100vh;
        background-color: #6f4326;
        background-image:
            radial-gradient(120% 80% at 50% 0%, rgba(255, 220, 150, 0.25), rgba(255, 220, 150, 0) 60%),
            radial-gradient(120% 80% at 50% 100%, rgba(35, 18, 10, 0.4), rgba(35, 18, 10, 0) 60%),
            repeating-linear-gradient(
                to bottom,
                rgba(255, 235, 190, 0.14) 0px,
                rgba(255, 235, 190, 0.14) 2px,
                rgba(89, 49, 27, 0.92) 2px,
                rgba(89, 49, 27, 0.92) 70px,
                rgba(54, 29, 16, 0.96) 70px,
                rgba(54, 29, 16, 0.96) 74px,
                rgba(106, 63, 35, 0.94) 74px,
                rgba(106, 63, 35, 0.94) 140px
            ),
            repeating-linear-gradient(
                to right,
                rgba(255, 220, 170, 0.09) 0px,
                rgba(255, 220, 170, 0.09) 2px,
                rgba(60, 33, 20, 0) 2px,
                rgba(60, 33, 20, 0) 18px,
                rgba(40, 22, 13, 0.12) 18px,
                rgba(40, 22, 13, 0.12) 22px,
                rgba(60, 33, 20, 0) 22px,
                rgba(60, 33, 20, 0) 42px
            );
        box-shadow: inset 0 24px 40px rgba(0, 0, 0, 0.28), inset 0 -24px 40px rgba(0, 0, 0, 0.3);
    }
</style>
<main class="w-full">
    <section class="relative bg-[url('/assets/hero.png')] bg-cover bg-center min-h-screen flex flex-col">
        <header class="w-full relative z-30">
            <div class="flex w-full items-center justify-between py-4">
                <a href="https://hackclub.com/"><img alt="Hackclub banner" src="https://cdn.hackclub.com/019de4a9-41f7-7f6d-b4c7-8c549bfb001d/flag-orpheus-left.svg" class="h-24 md:h-28 lg:h-32 shrink-0" /></a>
                {#if data.slackId}
                    <a href="/dashboard" style="position: fixed; top: 20px; right: 20px; z-index: 40; filter: drop-shadow(3px 3px 0px rgba(27, 45, 72, 0.2)); text-decoration: none;">
                        <button style="background: none; border: none; cursor: pointer; padding: 0; transition: transform 0.1s ease-in-out;" 
                            onmousedown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                            onmouseup={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <svg width="180" height="68" viewBox="0 0 120 45" xmlns="http://www.w3.org/2000/svg" style="width: clamp(120px, 35vw, 180px); height: auto; display: block;">
                                <!-- Wobbly Button Shape (Hand-drawn look) -->
                                <path d="M5,8 Q10,2 30,5 L100,2 Q115,5 112,20 L118,35 Q110,43 90,40 L20,43 Q5,40 8,25 Z" 
                                      fill="#FFB400" 
                                      stroke="#1B2D48" 
                                      stroke-width="3" 
                                      stroke-linejoin="round" />
                                
                                <!-- Button Text -->
                                <text x="50%" y="55%" 
                                      dominant-baseline="middle" 
                                      text-anchor="middle" 
                                      font-family="'Luckiest Guy', cursive" 
                                      font-weight="900" 
                                      font-size="16" 
                                      fill="#1B2D48" 
                                      style="text-transform: uppercase; letter-spacing: 0.5px;">
                                  DASHBOARD
                                </text>

                                <!-- Small Shine Detail -->
                                <path d="M15,12 Q25,8 40,10" fill="none" stroke="white" stroke-width="2" opacity="0.4" />
                            </svg>
                        </button>
                    </a>
                {:else}
                    <a href="/api/login" style="position: fixed; top: 20px; right: 20px; z-index: 40; filter: drop-shadow(3px 3px 0px rgba(27, 45, 72, 0.2)); text-decoration: none;">
                        <button style="background: none; border: none; cursor: pointer; padding: 0; transition: transform 0.1s ease;"
                            onmousedown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                            onmouseup={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <svg width="270" height="68" viewBox="0 0 180 45" xmlns="http://www.w3.org/2000/svg" style="width: clamp(180px, 55vw, 270px); height: auto; display: block;">
                                <!-- Combined Wobbly Button Shape (Wider to fit text) -->
                                <path d="M5,8 Q12,2 45,5 L160,2 Q175,5 172,20 L178,35 Q165,43 130,40 L30,43 Q5,40 8,25 Z" 
                                      fill="#FFB400" 
                                      stroke="#1B2D48" 
                                      stroke-width="3" 
                                      stroke-linejoin="round" />
                                
                                <!-- Combined Text -->
                                <text x="50%" y="55%" 
                                      dominant-baseline="middle" 
                                      text-anchor="middle" 
                                      font-family="'Luckiest Guy', cursive" 
                                      font-weight="900" 
                                      font-size="16" 
                                      fill="#1B2D48" 
                                      style="text-transform: uppercase; letter-spacing: 0.5px;">
                                  LOGIN & REGISTER
                                </text>

                                <!-- Shine Detail -->
                                <path d="M15,12 Q35,8 60,10" fill="none" stroke="white" stroke-width="2" opacity="0.4" />
                            </svg>
                        </button>
                    </a>
                {/if}
            </div>
        </header>

        <div class="flex flex-1 items-center justify-center px-4 py-14">
            <div class="max-w-3xl text-center px-4">
                <h1 class="text-4xl md:text-3xl lg:text-4xl font-extrabold text-[#EC3750] drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]">Hack Club Presents</h1>
                <div class="my-6">
                    <img alt="Treasure Hunt" src="/assets/Text-logo (two lines).webp" class="mx-auto mt-4 w-48 md:w-182 drop-shadow-lg sm:w-150" />
                </div>
                <p class="text-[#FFB400] text-2xl sm:text-3xl" style="font-family: 'Luckiest Guy', cursive; -webkit-text-stroke: 2px #48221a;">Complete Journeys and Win Awesome Prizes!</p>
            </div>
        </div>

        <a href="#section2" title="Jump to section 2">
            <div class="flex  w-full justify-center pb-8">
                <div class="rounded-full bg-black/45 p-2 animate-jump">
                    <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#ffffff" aria-label="Scroll down">
                        <path d="M480-345 240-585l56-56 184 183 184-183 56 56-240 240Z" />
                    </svg>
                </div>
            </div>
        </a>
    </section>
    <!--Section 2, full-screen log texture generated with CSS only-->
    <section class="wood-pattern flex flex-col px-2 min-h-screen" id="section2">
        <div class="flex flex-col items-center justify-center flex-1 py-32">
            <p class="text-center text-5xl md:text-7xl text-[#ffe4b5]" style="font-family: 'Luckiest Guy', cursive; -webkit-text-stroke: 1.5px #3a1e10; text-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);">
                WHAT IS TREASURE HUNT?
            </p>
            <div class="w-full h-1 bg-[#3a1e10] my-8 max-w-2xl rounded-full"></div>
            <p class="text-center text-2lg md:text-3xl text-[#ffe4b5] mt-6 max-w-4xl" style="font-family: 'Luckiest Guy', cursive; -webkit-text-stroke: 1px #3a1e10; text-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);">
                Treasure Hunt is A YSWS (You Ship, We Ship) event, where you got 4 weeks to complete 7 Journeys,
                Each Journey Should be a project with at least 4 Hours of work.
                <br><br>
                Have more then 4 Hours? Great! You  get Gold Bars You can use to buy prizes in the shop.
            </p>
        </div>
        <a href="#section3" title="Jump to section 3">
            <div class="flex  w-full justify-center pb-8">
                <div class="rounded-full bg-black/45 p-2 animate-jump">
                    <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#ffffff" aria-label="Scroll down">
                        <path d="M480-345 240-585l56-56 184 183 184-183 56 56-240 240Z" />
                    </svg>
                </div>
            </div>
        </a>
    </section>
    <!--Section 3, full-screen log texture generated with CSS only-->
    <!--Make it 2 sections, one right, one left-->
    <section class="relative bg-[url('/assets/heroy.webp')] bg-cover bg-center row-col" id="section3">
        <div class="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 py-32 gap-10 items-start">
            <div class="space-y-6">
                <h2 class="text-center text-3xl md:text-4xl text-[#ffe4b5]" style="font-family: 'Luckiest Guy', cursive; -webkit-text-stroke: 1.2px #3a1e10; text-shadow: 0 6px 18px rgba(0,0,0,0.45);">FAQ</h2>
                <FaqCard 
                question="IS THIS FREE?"
                content={[
                    "Yes! Treasure Hunt is free like all Hack Club events.",
                    "Hack Club is a 501(C)(3) non-profit organization.",
                    "We've run multiple events like this,"
                ]}
                links={[
                    { text: "Flavortown", url: "https://flavortown.hackclub.com/" },
                    { text: "Summer Of Making", url: "https://summer.hackclub.com/" }
                ]}
                />
                <FaqCard
                question="WHAT CAN I SHIP?"
                content={[
                    "You can ship any project that you've worked on",
                    "for at least 4 hours since the beginning of the event."
                ]}
                />
                <FaqCard
                question="AM I ELIGIBLE?"
                content={[
                    "Yes, anyone who is between the ages",
                    "of 13 and 18 is eligible to participate in Treasure Hunt."
                ]}
                />
                <FaqCard
                question="HAVE OTHER QUESTIONS?"
                content={[
                    "If you have any other questions, feel free to contact me",
                    "On slack or email me at:"
                ]}
                links={[
                    { text: "Slack: @peleg2210", url: "https://hackclub.slack.com/team/U091DE0M4NB" },
                    { text: "Email: peleg@peleg2210.me", url: "mailto:peleg@peleg2210.me" }
                ]}
                />
            </div>

            <div class="space-y-6">
                <h2 class="text-center text-3xl md:text-4xl text-[#ffe4b5]" style="font-family: 'Luckiest Guy', cursive; -webkit-text-stroke: 1.2px #3a1e10; text-shadow: 0 6px 18px rgba(0,0,0,0.45);">JOURNEY MAP</h2>
                <div class="mx-auto" style="max-width: 400px; filter: drop-shadow(8px 8px 0px rgba(27, 45, 72, 0.1));">
                <svg viewBox="0 0 400 1100" xmlns="http://www.w3.org/2000/svg">
                    <!-- Main Scroll Background -->
                    <path d="M20,10 L380,5 L395,1080 L15,1090 Z" fill="#F3E1AD" stroke="#1B2D48" stroke-width="5" stroke-linejoin="round" />
                    
                    <!-- Title -->
                    
                    <!-- The Dotted Route Line -->
                    <path d="M200,120 C280,200 120,300 200,400 S120,600 200,700 S280,900 200,1000" 
                        fill="none" stroke="#1B2D48" stroke-width="4" stroke-dasharray="10,10" opacity="0.4" />

                    <!-- Journey Nodes (Looping Logic for 7 nodes) -->
                    <!-- Journey 1 -->
                    <g transform="translate(200, 150)">
                    <circle r="35" fill="#F3E1AD" stroke="#1B2D48" stroke-width="3" />
                    <image href="https://cdn.hackclub.com/019dfd40-ba68-79dc-a5e8-5e256100ec06/pile_of_stickers.webp" x="-25" y="-25" width="50" height="50" />
                    <text y="55" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1B2D48">Sticker Pack</text>
                    </g>

                    <!-- Journey 2 -->
                    <g transform="translate(260, 290)">
                    <circle r="35" fill="#F3E1AD" stroke="#1B2D48" stroke-width="3" />
                    <image href="PRIZE_2_URL" x="-25" y="-25" width="50" height="50" />
                    <text y="55" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1B2D48">32GB USB STICK</text>
                    </g>

                    <!-- Journey 3 -->
                    <g transform="translate(140, 430)">
                    <circle r="35" fill="#F3E1AD" stroke="#1B2D48" stroke-width="3" />
                    <image href="https://cdn.hackclub.com/019dfd3f-c61d-7eac-a65c-7859734e0f4b/Screenshot%202025-12-10%20at%2002.29.41.webp" x="-25" y="-25" width="50" height="50" />
                    <text y="55" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1B2D48">.com Domain (Non-Premium)</text>
                    </g>

                    <!-- Journey 4 -->
                    <g transform="translate(260, 570)">
                    <circle r="35" fill="#F3E1AD" stroke="#1B2D48" stroke-width="3" />
                    <image href="https://cdn.hackclub.com/019dfd52-5436-76e8-93ac-235adc43536b/download.png" x="-25" y="-25" width="50" height="50" />
                    <text y="55" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1B2D48">Treasure hunt T-Shirt</text>
                    </g>

                    <!-- Journey 5 -->
                    <g transform="translate(140, 710)">
                    <circle r="35" fill="#F3E1AD" stroke="#1B2D48" stroke-width="3" />
                    <image href="PRIZE_5_URL" x="-25" y="-25" width="50" height="50" />
                    <text y="55" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1B2D48">Treasure hunt Shirt Pin</text>
                    </g>

                    <!-- Journey 6 -->
                    <g transform="translate(260, 850)">
                    <circle r="35" fill="#F3E1AD" stroke="#1B2D48" stroke-width="3" />
                    <image href="https://cdn.hackclub.com/019dfd3e-dca1-7e0b-9b89-34b888b928ce/642d475c-0556-4cf5-9609-6cfbb8c8f4ba.webp" x="-25" y="-25" width="50" height="50" />
                    <text y="55" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1B2D48">Hack Club Socks</text>
                    </g>

                    <!-- Journey 7 (Final Treasure) -->
                    <g transform="translate(200, 990)">
                    <circle r="45" fill="#FFB400" stroke="#1B2D48" stroke-width="4" />
                    <image href="https://cdn.hackclub.com/019dfe09-07cc-7ba4-8b15-eb30fb22e457/download%20(1).png" x="-30" y="-30" width="60" height="60" />
                    <text y="65" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="16" fill="#EC3750">A Book with participants' Projects + PI 2W</text>
                    <!-- Red "X" -->
                    <path d="M-15,-15 L15,15 M-15,15 L15,-15" stroke="#EC3750" stroke-width="6" opacity="0.8" />
                    </g>
                </svg>
                </div>
            </div>
        </div>
    </section>
</main>