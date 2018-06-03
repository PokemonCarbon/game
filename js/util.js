/**
 */
//
"use strict";
//
import { pipe, Pencil } from "./imports.js";

//
const LOG_ELEMENT = document.getElementById("log");
const audioCtx = new AudioContext();

export const VERSION_MAJOR = 0;
export const VERSION_API   = 1;
export const VERSION_MINOR = 0;
export const VERSION = `${VERSION_MAJOR}.${VERSION_API}.${VERSION_MINOR}`;
export const can = document.getElementById("screen");
export const con = can.getContext("2d");
export const pen = new Pencil(con);
export const WIDTH = can.width;
export const HEIGHT = can.height;
export const registry_regions = new Map();
export const registry_maps = new Map();
export const registry_structures = new Map();
export const registry_pokemon = new Map();
export const domParser = new DOMParser();

export const options = {
    debug: false
};

//
export const LogType = Object.freeze({
    INFO:  "INFO",
    GOOD:  "GOOD",
    WARN:  "WARN",
    ERROR: "ERROR",
    DEBUG: ""
});
export const Direction = Object.freeze({
    Up: Symbol(0),
    Down: Symbol(1),
    Left: Symbol(2),
    Right: Symbol(3)
});

//
export function log(t, m) {
    if (t.length > 0) {
        LOG_ELEMENT.innerHTML += `<div class="${t.toLowerCase()}">[${t}]: ${m}</div>`;
        LOG_ELEMENT.scrollTop = LOG_ELEMENT.scrollHeight;
    }
    console.debug(m);
}
export function assign(o, k, v) {
    o[k] = v;
    return o;
}
export function parse_ini(text) {
    return text.split("\n")
    .map(x => x.split("="))
    .reduce((ac,cv) => (cv.length === 1) ? (ac) : (assign(ac, ...cv)), {});
}
export async function _fetch(url) {
    return new Promise((resolve,reject) => {
        return fetch(url)
        .then(x => {
            if (!(x.ok)) {
                return reject(x);
            }
            else {
                return resolve(x);
            }
        });
    })
    .catch(ex => {
        log(LogType.ERROR, `Failed fetching ${ex.url}`);
    });
}
export async function ffetch(url, type) {
    return await (await _fetch(url))[type]();
}
export function ui8a_to_blob(type) {
    return function(ui8a) {
        return new Blob( [ ui8a ], { type } );
    };
}
export function arraybuffer_to_image() {
    return async function(ab) {
        return new Promise(resolve => {
            const ui8a = new Uint8Array(ab);
            const img = document.createElement("img");
            img.addEventListener("load", function() {
                const c = document.createElement("canvas");
                c.width = this.width;
                c.height = this.height;
                const d = c.getContext("2d");
                d.drawImage(this, 0, 0);
                resolve(c);
            });
            img.src = (pipe(ui8a, ui8a_to_blob("image/png"), URL.createObjectURL));
        });
    };
}
export async function arraybuffer_to_audio(ab) {
    return pipe(ab, audioCtx.decodeAudioData.bind(audioCtx));
}
