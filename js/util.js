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
