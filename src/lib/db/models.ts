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
    daysCompleted: string;
    admin: boolean;
    reviewer: boolean;
};

export type Order = {
    id: string;
    slackId: string;
    itemId: string;
    totalPrice: number;
}

export type Reward = {
    day: string;
    prizeName: string;
    prizeDescription: string;
    prizeImageUrl: string;
}