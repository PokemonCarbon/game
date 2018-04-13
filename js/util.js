/**
 */
//
'use strict';
//
import { Pencil } from "https://cdn.rawgit.com/Nektro/modules.js/1ad843a/src/pencil.js";

//
const LOG_ELEMENT = document.getElementById('log');

export const can = document.getElementById('screen');
export const con = can.getContext('2d');
export const pen = new Pencil(con);

//
export const LogType = {
    INFO: ['INFO', '000000'],
    GOOD: ['GOOD', '4CAF50'],
    WARN: ['WARN', 'FF9800'],
    ERROR: ['ERROR', 'F44336']
};

//
export function log(t, m) {
    LOG_ELEMENT.innerHTML += `<div style="color:#${t[1]}">[${t[0]}]: ${m}</div>`;
}
export function assign(o, k, v) {
    o[k] = v;
    return o;
}
