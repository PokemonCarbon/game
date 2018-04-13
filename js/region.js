/**
 */
//
'use strict';
//
import * as a from "./util.js";
import * as Pokemon from "./pokemon.js";

//
export class Region {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
    }
}
export const build = async (id) => {
    a.log(a.LogType.INFO, `Creating Region: ${id}`);
    const manifest = await fetch(`../${id}/manifest.json`).then(x => x.json());
    const { api_version, name, version } = manifest;
    const pokemon = new Map();

    if (manifest.pokemon !== undefined) {
        const pk_ar = await Promise.all(manifest.pokemon.map(v => Pokemon.build(id, v)));
        for (const p of pk_ar) {
            pokemon.set(p.InternalName.toLowerCase(), p);
        }
    }

    const r = new Region({ api_version, name, version, pokemon });
    return r;
}
