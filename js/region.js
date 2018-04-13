/**
 */
//
'use strict';
//
import * as a from "./util.js";
import * as Pokemon from "./pokemon.js";
import * as Type from "./type.js";

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
    const types = new Map();
    const pokemon = new Map();

    if (manifest.types !== undefined) {
        for (const t in manifest.types) {
            const [ name, weakness, resistance, immunity, special ] = manifest.types[t];
            types.set(t, new Type.Type({
                name,
                weakness: weakness || [],
                resistance: resistance || [],
                immunity: immunity || [],
                special: special || false
            }));
        }
    }
    if (manifest.pokemon !== undefined) {
        const pk_ar = await Promise.all(manifest.pokemon.map(v => Pokemon.build(id, v)));
        for (const p of pk_ar) {
            pokemon.set(p.InternalName.toLowerCase(), p);
        }
    }

    const r = new Region({ api_version, name, version, types, pokemon });
    return r;
}
