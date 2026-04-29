export type Item = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
};

export type User = {
    slackId: string;
    name: string;
    role: string;
};

export type Order = {
    id: string;
    slackId: string;
    itemId: string;
    totalPrice: number;
}
