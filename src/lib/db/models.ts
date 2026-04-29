export type Item = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
};

export type User = {
    slackId: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
    country: string;
    daysCompleted: string[];
    role: string;
};

export type Order = {
    id: string;
    slackId: string;
    itemId: string;
    totalPrice: number;
}
