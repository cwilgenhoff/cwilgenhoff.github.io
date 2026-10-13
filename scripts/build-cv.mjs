#!/usr/bin/env node
/**
 * Build a print-ready PDF from the CV markdown.
 *
 * The markdown is rendered to HTML, styled with scripts/cv.css (with the Inter
 * web font embedded so the PDF is self-contained), and printed to PDF via
 * headless Chromium (puppeteer). To honour the "max 2 pages" goal it runs an
 * auto-fit loop: it counts the pages of the rendered PDF and, only if
 * that exceeds the budget, shrinks a single font scale (the `--scale` CSS
 * custom property) in small steps until the CV fits — or a readability floor
 * is reached.
 *
 * Usage:
 *   node scripts/build-cv.mjs [input.md] [output.pdf]
 *   node scripts/build-cv.mjs --max-pages 1   # tighten the page budget
 *   node scripts/build-cv.mjs --no-fit        # skip auto-fit, use base size
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const STYLESHEET = resolve(__dirname, "cv.css");
const FONTS_DIR = resolve(__dirname, "fonts");
const DEFAULT_INPUT = resolve(
    REPO_ROOT,
    "cv/Cristian_Wilgenhoff_Staff_Engineer_2026.md",
);

// --- page geometry (A4 @ 96dpi) --------------------------------------------
const PX_PER_MM = 96 / 25.4;
const PAGE = { widthMm: 210, heightMm: 297 };
const MARGIN_MM = { top: 15, right: 16, bottom: 15, left: 16 };
const PRINTABLE_W = Math.round(
    (PAGE.widthMm - MARGIN_MM.left - MARGIN_MM.right) * PX_PER_MM,
);
const PRINTABLE_H = Math.round(
    (PAGE.heightMm - MARGIN_MM.top - MARGIN_MM.bottom) * PX_PER_MM,
);

// --- auto-fit tuning --------------------------------------------------------
const BASE_PT = 10.4; // must match the root font-size in cv.css
const MIN_SCALE = 0.8; // readability floor (~8.3pt base)
const SCALE_STEP = 0.02;

// Inter weights we ship, mapped to their @font-face descriptors.
const FONT_FACES = [
    { file: "inter-latin-400-normal.woff2", weight: 400, style: "normal" },
    { file: "inter-latin-400-italic.woff2", weight: 400, style: "italic" },
    { file: "inter-latin-600-normal.woff2", weight: 600, style: "normal" },
    { file: "inter-latin-700-normal.woff2", weight: 700, style: "normal" },
];

function parseArgs(argv) {
    const opts = { maxPages: 2, fit: true, positional: [] };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--max-pages") {
            opts.maxPages = Number(argv[++i]);
        } else if (arg === "--no-fit") {
            opts.fit = false;
        } else if (arg.startsWith("--")) {
            throw new Error(`Unknown option: ${arg}`);
        } else {
            opts.positional.push(arg);
        }
    }
    return opts;
}

// Read the bundled fonts and inline them as data URIs so the PDF needs no
// network and renders identically anywhere.
async function buildFontFaceCss() {
    const faces = await Promise.all(
        FONT_FACES.map(async ({ file, weight, style }) => {
            const data = await readFile(resolve(FONTS_DIR, file));
            const uri = `data:font/woff2;base64,${data.toString("base64")}`;
            return `@font-face {
    font-family: "Inter";
    font-style: ${style};
    font-weight: ${weight};
    font-display: swap;
    src: url(${uri}) format("woff2");
}`;
        }),
    );
    return faces.join("\n");
}

function splitOnce(str, sep) {
    const i = str.indexOf(sep);
    return i === -1 ? [str, undefined] : [str.slice(0, i), str.slice(i + sep.length)];
}

// Break a job heading ("Company — Role | Dates") into typed spans so the
// company can anchor the entry while role and dates take a lighter treatment.
function formatJobHeadings(html) {
    return html.replace(/<h3>(.*?)<\/h3>/g, (_, inner) => {
        const [left, dates] = splitOnce(inner, " | ");
        const [company, ...roleParts] = left.split(" — ");
        const role = roleParts.join(" — ").trim();
        const title =
            `<span class="company">${company.trim()}</span>` +
            (role ? `<span class="role"> — ${role}</span>` : "");
        const datesHtml = dates
            ? `<span class="dates">${dates.trim()}</span>`
            : "";
        return `<h3><span class="title">${title}</span>${datesHtml}</h3>`;
    });
}

// Wrap each job (its heading and everything up to the next heading) in a
// <section class="job"> so the whole block can be kept together on a page.
function wrapJobs(html) {
    return html.replace(
        /<h3>[\s\S]*?(?=<h2|<h3|$)/g,
        (block) => `<section class="job">\n${block.trim()}\n</section>\n`,
    );
}

function renderHtml({ markdown, fontCss, css, scale }) {
    const md = new MarkdownIt({ html: false, linkify: true, typographer: true });
    const body = wrapJobs(formatJobHeadings(md.render(markdown)));
    return `<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <style>${fontCss}</style>
        <style>${css}</style>
        <style>:root { --scale: ${scale}; }</style>
    </head>
    <body>${body}</body>
</html>`;
}

// Count the pages in the rendered PDF itself. Measuring DOM height alone
// misses the whitespace left when a job block is pushed to the next page.
function countPdfPages(pdf) {
    return (Buffer.from(pdf).toString("latin1").match(/\/Type\s*\/Page\b(?!s)/g) || [])
        .length;
}

async function buildPdf({ input, output, maxPages, fit }) {
    const [markdown, css, fontCss] = await Promise.all([
        readFile(input, "utf8"),
        readFile(STYLESHEET, "utf8"),
        buildFontFaceCss(),
    ]);

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
        const page = await browser.newPage();
        await page.emulateMediaType("print");
        // Match the printable content box so the layout matches the PDF.
        await page.setViewport({ width: PRINTABLE_W, height: PRINTABLE_H });

        let scale = 1;
        let pdf;
        let pages;
        for (;;) {
            await page.setContent(
                renderHtml({ markdown, fontCss, css, scale }),
                { waitUntil: "load" },
            );
            await page.evaluateHandle("document.fonts.ready");
            pdf = await page.pdf({
                format: "A4",
                printBackground: true,
                margin: {
                    top: `${MARGIN_MM.top}mm`,
                    right: `${MARGIN_MM.right}mm`,
                    bottom: `${MARGIN_MM.bottom}mm`,
                    left: `${MARGIN_MM.left}mm`,
                },
            });
            pages = countPdfPages(pdf);
            if (!fit || pages <= maxPages || scale <= MIN_SCALE) break;
            scale = Math.max(MIN_SCALE, Number((scale - SCALE_STEP).toFixed(3)));
        }

        await writeFile(output, pdf);

        return { scale, pages };
    } finally {
        await browser.close();
    }
}

async function main() {
    const { maxPages, fit, positional } = parseArgs(process.argv.slice(2));
    const input = resolve(positional[0] || DEFAULT_INPUT);
    const output = resolve(positional[1] || input.replace(/\.md$/i, ".pdf"));

    const { scale, pages } = await buildPdf({ input, output, maxPages, fit });

    const fitted = pages <= maxPages;
    console.log(
        `CV → ${output}\n` +
            `  font scale : ${Math.round(scale * 100)}%  (~${(BASE_PT * scale).toFixed(1)}pt base)\n` +
            `  pages      : ${pages}  ${fitted ? "✓" : "⚠ still over"} (budget ${maxPages})`,
    );
    if (!fitted) {
        console.log(
            "  note: hit the readability floor before fitting — trim content to go smaller.",
        );
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
