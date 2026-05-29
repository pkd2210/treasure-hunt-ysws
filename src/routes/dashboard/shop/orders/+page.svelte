<script>
	import { onMount } from 'svelte';

	let orders = $state([]);
	let isLoading = $state(true);
	let error = $state('');

	function unwrap(value, fallback = '') {
		if (Array.isArray(value)) {
			return value.length > 0 ? unwrap(value[0], fallback) : fallback;
		}
		if (value === null || value === undefined || value === '') {
			return fallback;
		}
		return String(value);
	}

	function normalizeOrder(id, rawOrder) {
		const itemId = unwrap(rawOrder?.itemId, 'unknown-item');
		const amount = Number(unwrap(rawOrder?.amount, '0')) || 0;
		const totalPrice = Number(unwrap(rawOrder?.totalPrice, '0')) || 0;
		const address = unwrap(rawOrder?.address, 'DEPRECATED');
		const email = unwrap(rawOrder?.email, '');
		const phone = unwrap(rawOrder?.phone, '');
		const country = unwrap(rawOrder?.country, '');
		const slackId = unwrap(rawOrder?.slackId, '');
		const status = unwrap(rawOrder?.status, 'pending');

		return {
			id: String(id),
			slackId,
			itemId,
			amount,
			totalPrice,
			address,
			email,
			phone,
			country,
			status,
			isDayPrize: Boolean(rawOrder?.isDayPrize),
		};
	}

	onMount(async () => {
		try {
			const response = await fetch('/api/orders');
			if (!response.ok) {
				throw new Error('Failed to fetch orders');
			}

			const data = await response.json();
			const normalized = Object.entries(data ?? {})
				.map(([id, rawOrder]) => normalizeOrder(id, rawOrder))
				.sort((left, right) => Number(left.id) - Number(right.id));

			orders = normalized;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load orders';
			console.error('Error loading orders:', err);
		} finally {
			isLoading = false;
		}
	});

	function statusLabel(status) {
		return String(status || 'pending').toUpperCase();
	}
</script>

<div style="width: 100%; min-height: 100vh; padding: 24px 16px 48px; ;">
	<div style="max-width: 860px; margin: 0 auto 16px; color: #1B2D48; font-family: 'Comic Sans MS', sans-serif;">
		<div style="font-size: 34px; font-weight: 900; letter-spacing: 0.04em;">ORDERS</div>
	</div>

	{#if isLoading}
		<p style="text-align: center; font-size: 1.2rem; color: #1B2D48; font-weight: 800;">Loading orders...</p>
	{:else if error}
		<p style="text-align: center; font-size: 1.2rem; color: #EC3750; font-weight: 800;">Error: {error}</p>
	{:else if orders.length === 0}
		<p style="text-align: center; font-size: 1.2rem; color: #1B2D48; font-weight: 800;">No orders found.</p>
	{:else}
		<div style="display: grid; gap: 24px; justify-items: center;">
			{#each orders as order (order.id)}
				<div style="width: 100%; max-width: 800px; margin: 0 auto; filter: drop-shadow(8px 8px 0px rgba(27, 45, 72, 0.1));">
					<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; display: block; overflow: visible;">
						<path d="M30,20 Q50,5 200,10 L750,5 Q790,15 780,80 L790,450 Q760,490 400,480 L50,495 Q20,480 35,250 L25,50 Q20,25 30,20 Z"
									fill="#F3E1AD" stroke="#1B2D48" stroke-width="5" />

						<g transform="translate(60, 50)">
							<text font-family="'Comic Sans MS', sans-serif" font-weight="900" font-size="28" fill="#1B2D48">SHIPMENT MANIFEST</text>
							<text y="30" font-family="monospace" font-weight="bold" font-size="14" fill="#EC3750">ORDER ID: #{order.id}</text>

							<g transform="translate(580, -10)">
								<rect width="100" height="35" rx="8" fill="#1B2D48" />
								<text x="50" y="22" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="12" fill="#F3E1AD">
									{statusLabel(order.status)}
								</text>
							</g>
						</g>

						<line x1="60" y1="100" x2="740" y2="100" stroke="#1B2D48" stroke-width="2" stroke-dasharray="8,4" opacity="0.3" />

						<g transform="translate(60, 140)">
							<text font-family="sans-serif" font-weight="900" font-size="11" fill="#EC3750" opacity="0.7">ITEM IDENTIFIER</text>
							<text y="25" font-family="monospace" font-weight="900" font-size="18" fill="#1B2D48">{order.itemId}</text>

							<g transform="translate(0, 60)">
								<text font-family="sans-serif" font-weight="900" font-size="11" fill="#EC3750" opacity="0.7">QUANTITY & TOTAL</text>
								<text y="25" font-family="sans-serif" font-weight="900" font-size="18" fill="#1B2D48">{order.amount}x — ${order.totalPrice}</text>
							</g>

							<g transform="translate(0, 120)">
								<text font-family="sans-serif" font-weight="900" font-size="11" fill="#EC3750" opacity="0.7">SLACK COMMANDER (ID)</text>
								<text y="25" font-family="monospace" font-weight="bold" font-size="16" fill="#1B2D48">{order.slackId}</text>
							</g>

							{#if order.isDayPrize}
								<g transform="translate(0, 180)">
									<path d="M0,0 Q50,-5 100,0 L95,30 Q50,35 0,30 Z" fill="#FFB400" stroke="#1B2D48" stroke-width="2" />
									<text x="50" y="20" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="10" fill="#1B2D48">DAY PRIZE UNLOCKED</text>
								</g>
							{/if}
						</g>

						<g transform="translate(380, 140)">
							<text font-family="sans-serif" font-weight="900" font-size="11" fill="#EC3750" opacity="0.7">DELIVERY COORDINATES (ADDRESS)</text>
							<foreignObject y="10" width="360" height="60">
								<div style="font-family: 'Comic Sans MS', sans-serif; font-size: 14px; color: #1B2D48; line-height: 1.2;">
									{order.address}<br />
									<strong>{order.country}</strong>
								</div>
							</foreignObject>

							<g transform="translate(0, 90)">
								<text font-family="sans-serif" font-weight="900" font-size="11" fill="#EC3750" opacity="0.7">CONTACT CHANNELS</text>
								<text y="25" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1B2D48">📧 {order.email}</text>
								<text y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1B2D48">📞 {order.phone}</text>
							</g>
						</g>

						{#if order.status === 'delivered'}
							<g transform="translate(700, 400) rotate(15)">
								<circle r="40" fill="#EC3750" stroke="#1B2D48" stroke-width="3" />
								<text text-anchor="middle" y="8" font-family="'Comic Sans MS', sans-serif" font-weight="900" font-size="12" fill="#F3E1AD">PASSED</text>
							</g>
						{/if}
					</svg>
				</div>
			{/each}
		</div>
	{/if}
</div>
