<script lang=ts>
    let { data } = $props();
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
                <a href="https://hackclub.com/"><img alt="Hackclub banner" src="https://cdn.hackclub.com/019de4a9-41f7-7f6d-b4c7-8c549bfb001d/flag-orpheus-left.svg" class="h-24 md:h-28 lg:h-32 flex-shrink-0" /></a>
                <div class="fixed top-4 right-4 z-40 md:top-8 md:right-8">
                    {#if data.slackId}
                        <a class="btn btn-outline border-2 bg-bp-dark px-2 py-1 text-base md:px-4 md:py-2 md:text-xl" href="/dashboard"><span>DASHBOARD</span></a>
                    {:else}
                        <a class="btn btn-outline border-2 bg-bp-dark px-2 py-1 text-base md:px-4 md:py-2 md:text-xl" href="/api/login"><span>LOGIN & SIGNIN</span></a>
                    {/if}
                </div>
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
    </section>
    <!--Section 3, full-screen log texture generated with CSS only-->
    <!--Make it 2 sections, one right, one left-->
    <section class="relative bg-[url('/assets/heroy.webp')] bg-cover bg-center row-col" id="section3">
        <div class="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 py-32 gap-10 items-start">
            <div class="space-y-6">
                <h2 class="text-center text-3xl md:text-4xl text-[#ffe4b5]" style="font-family: 'Luckiest Guy', cursive; -webkit-text-stroke: 1.2px #3a1e10; text-shadow: 0 6px 18px rgba(0,0,0,0.45);">FAQ</h2>
                <div class="bg-black/20 rounded-lg p-6">
                    <h3 class="text-xl font-semibold text-[#fff1d6] mb-2">Is this free?</h3>
                    <p class="text-[#fff1d6]">Yes! Treasure Hunt is free like all Hack Club events.<br>Hack Club is a 501(C)(3) non-profit organization.<br>We've run multiple events like this,<br>For example:<br><a href="https://flavortown.hackclub.com/" class="text-[#fff1d6] underline">Flavortown</a><br><a href="https://som.hackclub.com/" class="text-[#fff1d6] underline">Summer Of Making</a><br>And way more!</p>
                </div>
                <div class="bg-black/20 rounded-lg p-6">
                    <h3 class="text-xl font-semibold text-[#fff1d6] mb-2">What Can I ship?</h3>
                    <p class="text-[#fff1d6]">You can ship any project that you've worked on for at least 4 hours since the beggining of the event.</p>
                </div>
            </div>

            <div class="space-y-6">
                <h2 class="text-center text-3xl md:text-4xl text-[#ffe4b5]" style="font-family: 'Luckiest Guy', cursive; -webkit-text-stroke: 1.2px #3a1e10; text-shadow: 0 6px 18px rgba(0,0,0,0.45);">WHAT CAN I WIN?</h2>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 1920 2400" class="w-full">
                <style>
                    .s0 { fill: #f7e8c8;stroke: #3e1d16;stroke-linejoin: round;stroke-width: 39 } 
                    .s1 { fill: #000000 } 
                </style>
                <path id="Shape 1" fill-rule="evenodd" class="s0" d="m1820 100v2200h-1720v-2200z"/>
                <path id="PUT HERE A A DIAGRAM OF ALL PRIZES" class="s1" aria-label="PUT HERE A A DIAGRAM OF ALL PRIZES" d="m258.9 1125.6h-10.8v23.9h10.8q6 0 9.3-3.1 3.2-3.1 3.2-8.9 0-5.7-3.2-8.8-3.3-3.1-9.3-3.1zm-19.4 56.4v-63.4h19.4q10.7 0 16.1 4.8 5.5 4.8 5.5 14.1 0 9.4-5.5 14.2-5.4 4.8-16.1 4.8h-10.8v25.5zm51-23.8v-39.6h8.7v38.5q0 10.2 3.7 14.7 3.7 4.5 11.9 4.5 8.3 0 12-4.5 3.7-4.5 3.7-14.7v-38.5h8.6v39.6q0 12.4-6.2 18.7-6.1 6.3-18.1 6.3-12 0-18.1-6.3-6.2-6.3-6.2-18.7zm56.2-32.4v-7.2h53.7v7.2h-22.5v56.2h-8.7v-56.2zm89.8 56.2v-63.4h8.6v26h31.2v-26h8.6v63.4h-8.6v-30.2h-31.2v30.2zm65 0v-63.4h40.1v7.2h-31.5v18.8h30.2v7.2h-30.2v23h32.3v7.2zm85.1-29.7q2.7 0.9 5.3 4 2.6 3 5.3 8.4l8.7 17.3h-9.2l-8.1-16.3q-3.2-6.3-6.2-8.4-2.9-2.1-8-2.1h-9.3v26.8h-8.6v-63.4h19.4q10.8 0 16.2 4.5 5.3 4.6 5.3 13.7 0 6-2.8 10-2.7 3.9-8 5.5zm-10.7-26.7h-10.8v22.5h10.8q6.2 0 9.3-2.8 3.2-2.9 3.2-8.5 0-5.5-3.2-8.3-3.1-2.9-9.3-2.9zm41.6 56.4v-63.4h40.1v7.2h-31.5v18.8h30.2v7.2h-30.2v23h32.2v7.2zm114.9-23.4l-11.7-31.6-11.6 31.6zm-40.7 23.4l24.2-63.4h9.7l24.2 63.4h-8.9l-5.8-16.3h-28.6l-5.8 16.3zm95.9 0v-63.4h8.6v56.2h30.8v7.2zm48 0v-63.4h8.6v63.4zm64-61.3v8.3q-4.8-2.3-9.2-3.5-4.3-1.1-8.3-1.1-7.1 0-10.9 2.7-3.8 2.7-3.8 7.7 0 4.3 2.5 6.4 2.6 2.1 9.6 3.5l5.2 1q9.6 1.8 14.2 6.5 4.6 4.6 4.6 12.3 0 9.2-6.2 14-6.2 4.7-18.1 4.7-4.5 0-9.6-1-5.1-1-10.5-3v-8.8q5.2 2.9 10.2 4.4 5 1.5 9.9 1.5 7.3 0 11.3-2.9 4-2.9 4-8.3 0-4.6-2.9-7.3-2.8-2.6-9.4-3.9l-5.2-1q-9.6-2-13.9-6-4.3-4.1-4.3-11.4 0-8.4 5.9-13.2 6-4.9 16.4-4.9 4.4 0 9.1 0.8 4.6 0.8 9.4 2.5zm8.2 5.1v-7.2h53.7v7.2h-22.5v56.2h-8.7v-56.2zm115.6-1.4q-9.4 0-14.9 7-5.5 6.9-5.5 19 0 11.9 5.5 18.9 5.5 7 14.9 7 9.3 0 14.8-7 5.4-7 5.4-18.9 0-12.1-5.4-19-5.5-7-14.8-7zm0-7q13.3 0 21.3 9 8 8.9 8 24 0 14.9-8 23.9-8 8.9-21.3 8.9-13.4 0-21.4-8.9-8-8.9-8-23.9 0-15.1 8-24 8-9 21.4-9zm42.2 64.6v-63.4h36.5v7.2h-27.9v18.7h25.2v7.2h-25.2v30.3zm110.9-23.4l-11.7-31.6-11.6 31.6zm-40.8 23.4l24.2-63.4h9.8l24.1 63.4h-8.9l-5.8-16.3h-28.5l-5.8 16.3zm66.8 0v-63.4h8.6v56.2h30.9v7.2zm49 0v-63.4h8.6v56.2h30.9v7.2zm76-4.4v-59h8.6v59q0 11.5-4.4 16.6-4.4 5.2-14 5.2h-3.3v-7.2h2.7q5.7 0 8-3.2 2.4-3.2 2.4-11.4zm51.7-53.2q-9.3 0-14.9 7-5.4 6.9-5.4 19 0 11.9 5.4 18.9 5.6 7 14.9 7 9.4 0 14.8-7 5.5-7 5.5-18.9 0-12.1-5.5-19-5.4-7-14.8-7zm0-7q13.4 0 21.3 9 8 8.9 8 24 0 14.9-8 23.9-7.9 8.9-21.3 8.9-13.4 0-21.4-8.9-8-8.9-8-23.9 0-15.1 8-24 8-9 21.4-9zm41.3 40.8v-39.6h8.6v38.5q0 10.2 3.7 14.7 3.7 4.5 12 4.5 8.2 0 11.9-4.5 3.7-4.5 3.7-14.7v-38.5h8.6v39.6q0 12.4-6.1 18.7-6.1 6.3-18.1 6.3-12 0-18.2-6.3-6.1-6.3-6.1-18.7zm95-5.9q2.8 0.9 5.4 4 2.6 3 5.3 8.4l8.7 17.3h-9.2l-8.2-16.3q-3.1-6.3-6.1-8.4-2.9-2.1-8-2.1h-9.3v26.8h-8.6v-63.4h19.3q10.9 0 16.3 4.5 5.3 4.6 5.3 13.7 0 6-2.8 10-2.7 3.9-8.1 5.5zm-10.7-26.7h-10.7v22.5h10.7q6.2 0 9.4-2.8 3.2-2.9 3.2-8.5 0-5.5-3.2-8.3-3.2-2.9-9.4-2.9zm40.7 56.4v-63.4h11.5l28.1 53v-53h8.4v63.4h-11.6l-28.1-53.1v53.1zm65 0v-63.4h40.1v7.2h-31.5v18.8h30.2v7.2h-30.2v23h32.3v7.2zm68.7-30.2l-22.4-33.2h9.2l17.6 26.1 17.4-26.1h9.2l-22.4 33.2v30.2h-8.6zm77.3-31.1v8.3q-4.9-2.3-9.2-3.5-4.4-1.1-8.4-1.1-7 0-10.8 2.7-3.8 2.7-3.8 7.8 0 4.2 2.5 6.3 2.5 2.1 9.6 3.5l5.2 1q9.6 1.9 14.1 6.5 4.6 4.6 4.6 12.3 0 9.2-6.2 14-6.2 4.7-18.1 4.7-4.5 0-9.6-1-5-1-10.5-3v-8.8q5.2 2.9 10.3 4.4 5 1.5 9.8 1.5 7.4 0 11.3-2.9 4-2.9 4-8.3 0-4.6-2.8-7.3-2.9-2.6-9.4-3.9l-5.3-1q-9.6-1.9-13.9-6-4.2-4.1-4.2-11.4 0-8.4 5.9-13.2 5.9-4.9 16.3-4.9 4.5 0 9.1 0.8 4.6 0.8 9.5 2.5z"/>
                </svg>
            </div>
        </div>
    </section>
</main>