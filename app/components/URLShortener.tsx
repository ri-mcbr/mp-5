
"use client";

import shortenURL from "@/lib/shortenURL";
import { URLProps } from "@/types";
import { useState, useEffect } from "react";

export default function URLShortener({
                                         append,
                                     }: {
    append: (link: URLProps) => void;
}) {
    const [url, setURL] = useState("");
    const [alias, setAlias] = useState("");
    const [shortenedURL, setShortenedURL] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrigin(window.location.origin);
    }, []);

    return (
        <main
            style={{
                width: "50%",
                margin: "0 auto",
            }}
        >
            <section
                style={{
                    width: "100%",
                    marginTop: "10%",
                    backgroundColor: "white",
                    padding: "6%",
                    boxShadow: "0 0.5vw 1vw gray",
                }}
            >
                <div style={{ marginBottom: "6%" }}>
                    <p style={{ margin: 0 }}>
                        Enter a long URL to create a shorter, shareable link.
                    </p>
                </div>

                <form
                    onSubmit={async (event) => {
                        event.preventDefault();

                        setError("");
                        setShortenedURL("");
                        setCopied(false);

                        if (!url.trim() && !alias.trim()) {
                            setError("Enter a URL and custom alias.");
                            return;
                        }

                        if (!url.trim()) {
                            setError("Enter a URL.");
                            return;
                        }

                        if (!alias.trim()) {
                            setError("Enter an alias.");
                            return;
                        }

                        try {
                            const newLink = await shortenURL(
                                url.trim(),
                                alias.trim()
                            );

                            append(newLink);

                            setShortenedURL(
                                `${window.location.origin}/${newLink.alias}`
                            );
                        } catch (err: unknown) {
                            const error = err as {
                                message?: string;
                                code?: number;
                            };

                            if (error.message === "Invalid URL") {
                                setError("Enter a valid URL.");
                            } else if (
                                error.message === "Alias contains unreadable characters"
                            ) {
                                setError("Alias contains unsupported characters.");
                            } else if (
                                error.code === 11000 ||
                                error.message === "Duplicate alias"
                            ) {
                                setError("Invalid alias: This alias already exists");
                            } else {
                                setError("Something went wrong. Try again.");
                                console.error(err);
                            }
                        }
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "5%",
                        }}
                    >
                        <label
                            htmlFor="url"
                            style={{ marginBottom: "2%" }}
                        >
                            URL
                        </label>

                        <input
                            id="url"
                            type="text"
                            placeholder="https://example.com/very/long/url"
                            value={url}
                            onChange={(e) => setURL(e.target.value)}
                            style={{
                                width: "100%",
                                height: "3.5vw",
                                padding: "0 2%",
                                border: ".15vw solid lightgray",
                                borderRadius: "1vw",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "5%",
                        }}
                    >
                        <label
                            htmlFor="alias"
                            style={{marginBottom: "2%"}}
                        >
                            Custom Alias
                        </label>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                color: "gray",
                            }}
                        >
                            <span style={{ whiteSpace: "nowrap" }}>
                                {origin ? `${origin}/` : ""}
                            </span>

                            <input
                                id="alias"
                                type="text"
                                placeholder="your-alias"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                style={{
                                    width: "20%",
                                    height: "3.5vw",
                                    padding: "0 2%",
                                    border: ".15vw solid lightgray",
                                    borderRadius: "1vw",
                                    boxSizing: "border-box",
                                    marginLeft: "1%",
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            height: "3.5vw",
                            border: "none",
                            borderRadius: "1vw",
                            backgroundColor: "teal",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        Shorten
                    </button>

                    {error && (
                        <p
                            style={{
                                margin: "2% 0 2%",
                                textAlign: "center",
                                color: "red",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {shortenedURL && (
                        <div
                            style={{
                                width: "100%",
                                border: ".15vw solid lightgray",
                                borderRadius: "1vw",
                                padding: "1vw 1vw",
                                marginTop: "4vw",
                                boxSizing: "border-box",
                            }}
                        >
                            <p
                                style={{
                                    color: "lightgray",
                                    margin: "0 0 1vw 0",
                                }}
                            >
                                Your shortened URL:
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <a
                                    href={shortenedURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: "none" }}
                                >
                                    {shortenedURL}
                                </a>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(shortenedURL);
                                            setCopied(true);
                                        } catch {
                                            setError("Unable to copy the URL.");
                                        }
                                    }}
                                    style={{
                                        cursor: "pointer",
                                        border: "none",
                                        backgroundColor: "transparent",
                                        padding: "1vw",

                                    }}
                                >
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </section>
        </main>
    );
}
