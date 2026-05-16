export type Item = {
    recId: string;
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    reward: boolean;
};

export type User = {
    slackId: string;
    goldBars: number;
    journeyNumber: number;
    firstName: string;
    lastName: string;
    //address: string; // deoprecated
    email: string;
    phone: string;
    country: string;
    admin: boolean;
    reviewer: boolean;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    birthday: string;
    yswsEligible: boolean;
};

export type Order = {
    id: number;
    slackId: string;
    itemId: string;
    amount: number;
    totalPrice: number;
    address: string;
    email: string;
    phone: string;
    country: string;
    isDayPrize: boolean;
    status: "pending" | "shipped" | "delivered" | "cancelled";
}

// deprecated
export type Reward = {
    day: string;
    prizeName: string;
}

export type Journey = {
    id: number;
    reward: string[];
    letter: string;
    completers: string[];
    theme: string;
}

export type Submission = {
    id: number;
    journeyNumber: number;
    "Hackatime Project name": string;
    status: "unreviewed" | "rejected" | "approved";
    "Optional - Override Hours Spent"?: number;
    "Optional - Override Hours Spent Justification"?: string;
    "Screenshot": string[];
    "Description": string;
    "GitHub Username": string;
    "Code URL": string;
    "Playable URL": string;
    "User": string;
    "Slack ID": string;
    "First Name": string;
    "Last Name": string;
    "Email": string;
    "Country": string;
    "Address (Line 1)": string;
    "State / Province": string;
    "City": string;
    "ZIP / Postal Code": string;
    "Birthday": string;
}

export type Project = {
    id: string;
    projectName: string;
    description: string;
    codeUrl: string;
    readmeUrl: string;
    demoUrl: string;
    screenshot: string;
    aiUsage: string | null;
    hackatimeProject: string;
    user: string;
    journeyNumber: number;
    status: "unreviewed" | "rejected" | "approved" | null;
    submission: string | null;
    yswsEligible: boolean;
}