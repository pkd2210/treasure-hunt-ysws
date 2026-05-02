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
            <div class="flex w-full items-center justify-between px-4 py-4">
                <img alt="Hackclub banner" src="https://cdn.hackclub.com/019de4a9-41f7-7f6d-b4c7-8c549bfb001d/flag-orpheus-left.svg" class="h-10 md:h-12" />
                <div class="fixed top-4 right-4 z-40 md:top-8 md:right-8">
                    {#if data.slackId}
                        <a class="btn btn-outline border-2 bg-bp-dark px-2 py-1 text-base md:px-4 md:py-2 md:text-xl" href="/dashboard"><span>DASHBOARD</span></a>
                    {:else}
                        <a class="btn btn-outline border-2 bg-bp-dark px-2 py-1 text-base md:px-4 md:py-2 md:text-xl" href="/api/login"><span>LOGIN & SIGNIN</span></a>
                    {/if}
                </div>
            </div>
        </header>

        <div class="flex flex-1 items-center justify-center px-4 py-16">
            <div class="max-w-3xl text-center px-4">
                <h1 class="text-4xl md:text-3xl lg:text-4xl font-extrabold text-[#EC3750] drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]">Hack Club Presents</h1>
                <div class="my-6">
                    <img alt="Treasure Hunt" src="/assets/Text-logo (two lines).webp" class="mx-auto mt-4 w-48 md:w-182 drop-shadow-lg" />
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
    <section class="wood-pattern flex flex-col items-center py-32 justify-center px-2" id="section2">
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
    </section>
</main>