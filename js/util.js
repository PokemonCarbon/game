/**
 */
//
'use strict';
//
import { Pencil } from "https://cdn.rawgit.com/Nektro/modules.js/1ad843a/src/pencil.js";

//
import pipeline from "https://unpkg.com/pipeline-operator/index.js";
export const pipe = pipeline;

//
const LOG_ELEMENT = document.getElementById('log');

export const VERSION_MAJOR = 0;
export const VERSION_API   = 1;
export const VERSION_MINOR = 0;
export const VERSION = `${VERSION_MAJOR}.${VERSION_API}.${VERSION_MINOR}`;
export const can = document.getElementById('screen');
export const con = can.getContext('2d');
export const pen = new Pencil(con);
export const regions = new Map();
export const pokemon = new Map();
export const maps = new Map();

//
export const LogType = {
    INFO:  ['INFO',  '000000', 'debug'],
    GOOD:  ['GOOD',  '4CAF50', 'log'  ],
    WARN:  ['WARN',  'FF9800', 'warn' ],
    ERROR: ['ERROR', 'F44336', 'error']
};

//
export function log(t, m) {
    LOG_ELEMENT.innerHTML += `<div style="color:#${t[1]}">[${t[0]}]: ${m}</div>`;
    LOG_ELEMENT.scrollTop = LOG_ELEMENT.scrollHeight;
}
export function assign(o, k, v) {
    o[k] = v;
    return o;
}
export function parse_ini(text) {
    return text.split('\n')
        .map(x => x.split('='))
        .reduce((ac,cv) => (cv.length === 1) ? (ac) : (assign(ac, ...cv)), {});
}
export async function _fetch(url) {
    return new Promise(resolve => {
        return fetch(url)
        .then(x => {
            if (x.status !== 200) {
                return Promise.reject(`${x.status}: ${url}`);
            }
            else {
                return resolve(x);
            }
        });
    })
}
export async function ffetch(url, type) {
    return await (await fetch(url))[type]();
}
