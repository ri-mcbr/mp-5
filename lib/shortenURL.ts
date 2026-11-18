"use server";

import { URLProps } from "@/types";
import getCollection, { URLS_COLLECTION } from "@/db";

export default async function shortenURL(
    url: string,
    alias: string,
): Promise<URLProps> {

    if (!URL.canParse(url)) {
        throw new Error("Invalid URL");
    }

    const validURL = new URL(url);

    if (
        validURL.protocol !== "http:" &&
        validURL.protocol !== "https:"
    ) {
        throw new Error("Invalid URL");
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
        throw new Error("Alias contains unreadable characters");
    }

    const urlsCollection = await getCollection(URLS_COLLECTION);

    const existingLink = await urlsCollection.findOne({
        alias: alias,
    });

    if (existingLink) {
        throw new Error("Duplicate alias");
    }

    const newLink: URLProps = {
        url: validURL.toString(),
        alias: alias,
    };

    try {
        await urlsCollection.insertOne(newLink);

        return {
            url: newLink.url,
            alias: newLink.alias,
        };

    } catch (err: unknown) {
        if (
            typeof err === "object" &&
            err !== null &&
            "code" in err &&
            err.code === 11000
        ) {
            throw new Error("Duplicate alias");
        }

        console.error("MongoDB insertion error:", err);

        throw new Error("DB insertion failed");
    }
}