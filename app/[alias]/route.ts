import getCollection, { URLS_COLLECTION } from "@/db";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ alias: string }> }
) {
    const { alias } = await params;
    const urlsCollection = await getCollection(URLS_COLLECTION);
    const link = await urlsCollection.findOne({
        alias: alias,
    });
    if (!link) {
        return new NextResponse("URL not found", {
            status: 404,
        });
    }
    return NextResponse.redirect(link.url);
}