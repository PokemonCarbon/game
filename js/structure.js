/**
 */
//
'use strict';
//
import * as a from "./util.js";

//
export class Structure {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
    }
}
export const load = (reg) => async (struc) => {
    return new Structure({
        tfgid: struc[0],
        gid: struc[1],
        rid: struc[0] + struc[1],
        value: await Promise.resolve(struc[2])
            .then(x => a.arraybuffer_to_image()(x))
            .then(x => ffetch(`../${reg.id}/structures/${x}.png`, 'arrayBuffer'))
    });
}
