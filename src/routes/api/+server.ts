// create a example order for slackid U091DE0M4NB
//import { createOrder } from "$lib/db/airtableClient";
//import type { Order } from "$lib/db/models";

//export async function GET() {
//const exampleOrder: Omit<Order, "id"> = {
//    slackId: "U091DE0M4NB",
//    itemId: "recIZsfaty09GvSeo",
//    totalPrice: 100,
//    isDayPrize: false,
//    status: "pending",
//};

//try {
//    await createOrder(exampleOrder);
//    return new Response("Example order created", {
//        headers: { 'Content-Type': 'text/plain' },
//    });
//} catch (err) {
//    console.error('createOrder error:', err);
//    return new Response("Failed to create example order", { status: 500 });
//}
//}