<script>
	import { onMount } from "svelte";
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	let { data } = $props();
	let letterMessage = $state('');
    
	const journey = $derived(Number(get(page).params.journey));

    onMount(() => {
		const fetchLetter = async () => {
			try {
				const response = await fetch(`/api/journey/letter?journey=${journey}`);
				if (!response.ok) return;

				const payload = await response.json();
				if (typeof payload === 'string' && payload.trim().length > 0) {
					letterMessage = payload;
				}
			} catch (_error) {
                letterMessage = "A letter for this journey was not written yet.";
			}
		};

		fetchLetter();
    });
	const letterTitle = $derived(`Journey ${journey} Was Completed!`);
	const letterText = $derived(letterMessage);
</script>

<div class="letter-page">
	<div class="letter-frame">
		<img src="/assets/Letter.webp" alt="Letter" class="letter-image" />

		<div class="letter-overlay">
			<h1 class="letter-title">{letterTitle}</h1>
			<p class="letter-text">{letterText}</p>
		</div>
	</div>
</div>

<style>
	.letter-page {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		min-height: calc(100vh - 4rem);
	}

	.letter-frame {
		position: relative;
		width: min(100%, 1050px);
	}

	.letter-image {
		display: block;
		width: 100%;
		height: auto;
	}

	.letter-overlay {
		position: absolute;
		inset: 9% 8% 12% 8%;
		display: grid;
		grid-template-rows: auto 1fr;
		gap: 1rem;
	}

	.letter-title {
		width: 100%;
		border-bottom: 1px solid rgba(120, 76, 26, 0.45);
		margin: 0;
		padding-bottom: 0.35rem;
		color: #6b3e1f;
		font-size: clamp(1.25rem, 2.4vw, 2.1rem);
		font-weight: 700;
		text-align: center;
	}

	.letter-text {
		width: 100%;
		height: 100%;
		margin: 0;
		overflow: auto;
		white-space: pre-wrap;
		color: #3f2a18;
		font-size: clamp(0.95rem, 1.6vw, 1.2rem);
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.letter-page {
			min-height: calc(100vh - 2rem);
		}

		.letter-overlay {
			inset: 10% 9% 13% 9%;
			gap: 0.75rem;
		}
	}
</style>