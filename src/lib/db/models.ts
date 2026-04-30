export type Item = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
};

export type User = {
    slackId: string;
    goldBars: number;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
    country: string;
    admin: boolean;
    reviewer: boolean;
};

export type Order = {
    id: number;
    slackId: string;
    itemId: string;
    totalPrice: number;
    address: string;
    email: string;
    phone: string;
    country: string;
    isDayPrize: boolean;
    status: "pending" | "shipped" | "delivered" | "cancelled";
}

export type Reward = {
    day: string;
    prizeName: string;
    prizeDescription: string;
    prizeImageUrl: string;
}