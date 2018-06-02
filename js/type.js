/**
 */
//
"use strict";
//
import { } from "./util.js";

//
export class Type {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
    }
}
