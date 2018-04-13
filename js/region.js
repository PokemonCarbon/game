/**
 */
//
'use strict';
//
import * as a from "./util.js";
import * as Pokemon from "./pokemon.js";
import * as Type from "./type.js";
import * as Mapp from "./map.js";

//
const R = {
    pokemon: Pokemon,
    maps: Mapp
}

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
    const reg = new Map();
    const types = new Map();
    const pokemon = new Map();
    const maps = new Map();

    if (manifest.types !== undefined) {
        for (const t in manifest.types) {
            a.log(a.LogType.INFO, `Creating Type: ${id}:${t}`);
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
    if (manifest.maps !== undefined) {
        const mp_ar = await Promise.all(manifest.maps.map(x => Mapp.build(id, x)))
        for (const mp of mp_ar) {
            maps.set(mp.id, mp);
        }
    }

    reg.set('types', types);
    reg.set('pokemon', pokemon);
    reg.set('maps', maps);
    a.regions.set(id, reg);

    const r = new Region({
        id,
        name: manifest.name,
        api_version: manifest.api_version,
        pokemon: manifest.pokemon || [],
        maps: manifest.maps || []
    });
    return r;
}
export function get(type) {
    return function(id) {
        return async function(reg) {
            if (reg[type].includes(id)) {
                const p = `${reg.id}:${id}`;
                if (a[type].has(p)) {
                    return a[type].get(p);
                }
                else {
                    const t = a.regions.get(reg.id).get(type).get(id);
                    const l = a.pipe(t, R[type].load(reg))
                    a[type].set(p, l);
                    return l;
                }
            }
            else {
                return Promise.reject(`Region ${reg.id} does not include map ${id}`);
            }
        }
    }
}
