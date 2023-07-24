"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.z2 = exports.z1 = exports.y2 = exports.y1 = exports.x2 = exports.x1 = void 0;
const command_1 = require("bdsx/command");
const event_1 = require("bdsx/event");
const packetids_1 = require("bdsx/bds/packetids");
const launcher_1 = require("bdsx/launcher");
const command_2 = require("bdsx/bds/command");
const common_1 = require("bdsx/common");
const nativetype_1 = require("bdsx/nativetype");
const colors_1 = require("colors");
const blockpos_1 = require("bdsx/bds/blockpos");
const language_1 = require("./language");
const prochacker_1 = require("bdsx/prochacker");
const connreq_1 = require("bdsx/bds/connreq");
const core_1 = require("bdsx/core");
let isProcessing = false;
event_1.events.packetSend(packetids_1.MinecraftPacketIds.Text).on(() => {
    if (isProcessing === true)
        return common_1.CANCEL;
});
prochacker_1.procHacker.hooking('?countActiveStandaloneTickingAreas@TickingAreasManager@@QEBAIXZ', nativetype_1.uint32_t, { this: core_1.VoidPointer })(on_get_count);
prochacker_1.procHacker.hooking('?countStandaloneTickingAreas@TickingAreasManager@@QEBAIXZ', nativetype_1.uint32_t, { this: core_1.VoidPointer })(on_get_count);
function on_get_count() {
    return 1;
}
const pluginTickingAreaNames = [];
class AreaData {
    constructor(name, pos1, pos2) {
        this.name = name;
        this.pos1 = pos1;
        this.pos2 = pos2;
    }
}
function createTickingAreas(namePrefix, pos1, pos2) {
    let chunkPos1 = blockpos_1.ChunkPos.create(blockpos_1.BlockPos.create(pos1.x, 0, pos1.z));
    let chunkPos2 = blockpos_1.ChunkPos.create(blockpos_1.BlockPos.create(pos2.x, 0, pos2.z));
    let totalWidth = Math.abs(chunkPos1.x - chunkPos2.x) + 1;
    let totalHeight = Math.abs(chunkPos1.z - chunkPos2.z) + 1;
    let areas = [];
    let z = 0;
    while (z < totalHeight) {
        const remainingHeight = totalHeight - z;
        const handlingHeight = Math.min(remainingHeight, 10);
        let x = 0;
        while (x < totalWidth) {
            const name = namePrefix + pluginTickingAreaNames.length;
            pluginTickingAreaNames.push(name);
            const remainingWidth = totalWidth - x;
            const handlingWidth = Math.min(remainingWidth, 10);
            const originPos = {
                x: (chunkPos1.x * 16) + (x * 16),
                z: (chunkPos1.z * 16) + (z * 16),
            };
            x += handlingWidth;
            const endPos = {
                x: originPos.x + (handlingWidth * 16) - 1,
                z: originPos.z + (handlingHeight * 16) - 1,
            };
            areas.push(new AreaData(name, originPos, endPos));
        }
        z += handlingHeight;
    }
    for (const data of areas) {
        const command = `tickingarea add ` +
            `${data.pos1.x} 0 ${data.pos1.z} ` +
            `${data.pos2.x} 0 ${data.pos2.z} ` +
            `${data.name}`;
        launcher_1.bedrockServer.executeCommand(command);
    }
}
function removeTickingAreas(namePrefix = "") {
    for (let name of pluginTickingAreaNames) {
        if (name.startsWith(namePrefix)) {
            const command = `tickingarea remove ${name}`;
            launcher_1.bedrockServer.executeCommand(command);
        }
    }
}
// declare module "bdsx/bds/chunk" {
// 	interface ChunkSource {
// 		getOrLoadChunk(chunkPos: ChunkPos, LoadMode: number, unknown: boolean): LevelChunk
// 	}
// };
// ChunkSource.prototype.getOrLoadChunk = 
// procHacker.js("?getOrLoadChunk@ChunkSource@@UEAA?AV?$shared_ptr@VLevelChunk@@@std@@AEBVChunkPos@@W4LoadMode@1@_N@Z", LevelChunk, {
// 	this: LevelChunk
// });
event_1.events.serverOpen.on(() => {
    command_1.command.register("set", language_1.WorldeditLangs.Commands.set, 1).overload((p, o, op) => {
        if (o.isServerCommandOrigin()) {
            op.error(language_1.WorldeditLangs.Errors.ifConsole);
            return;
        }
        ;
        const player = o.getEntity();
        if (!player.isPlayer())
            return;
        const plname = player.getNameTag();
        if (typeof posblocks[plname] !== 'number') {
            op.error(language_1.WorldeditLangs.Errors.notSettedBothPosition);
            return;
        }
        ;
        let highX = Math.max(exports.x2[plname], exports.x1[plname]);
        let highY = Math.max(exports.y2[plname], exports.y1[plname]);
        let highZ = Math.max(exports.z2[plname], exports.z1[plname]);
        let lowX = Math.min(exports.x2[plname], exports.x1[plname]);
        let lowY = Math.min(exports.y2[plname], exports.y1[plname]);
        let lowZ = Math.min(exports.z2[plname], exports.z1[plname]);
        if (p.block.getName() === "minecraft:tnt") {
            op.error(language_1.WorldeditLangs.Errors.TooManyTNT);
            return;
        }
        ;
        let doneBlocks = 0;
        const Ytotal = highY - lowY;
        const Ztotal = highZ - lowZ;
        let PlaceBlocksOnce = 0;
        let PlaceOnceZ = 1;
        for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
            if (PlaceBlocksOnce + Ytotal > 32767 || i === Ztotal) {
                PlaceOnceZ = i || 1;
                break;
            }
            PlaceBlocksOnce += Ytotal;
        }
        isProcessing = true;
        createTickingAreas("worldeditarea", { x: lowX, z: lowZ }, { x: highX, z: highZ });
        setTimeout(() => {
            var _a, _b;
            const startTime = Date.now();
            for (let x = lowX; x <= highX; x++) {
                for (let z = lowZ; z <= highZ; z += PlaceOnceZ) {
                    if (z + PlaceOnceZ > highZ) {
                        player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${highZ} ${p.block.getName().split(":")[1]} ${((_a = p.block_states) === null || _a === void 0 ? void 0 : _a.value().toString().replace("{", "[").replace("}", "]")) || []}`);
                        doneBlocks += (highZ - z + 1) * Ytotal;
                    }
                    else {
                        player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ} ${p.block.getName().split(":")[1]} ${((_b = p.block_states) === null || _b === void 0 ? void 0 : _b.value().toString().replace("{", "[").replace("}", "]")) || []}`);
                        doneBlocks += PlaceBlocksOnce;
                    }
                    ;
                    player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
                }
                ;
            }
            ;
            const endTime = Date.now();
            removeTickingAreas("worldeditarea");
            isProcessing = false;
            player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
            player.sendMessage(`§d${posblocks[plname]} ${language_1.WorldeditLangs.TaskSuccess.set} (${((endTime - startTime) / 1000).toFixed(2)} ${language_1.WorldeditLangs.TaskSuccess.usedTime})`);
            console.log(`${plname} Placed ${posblocks[plname]} Blocks (${((endTime - startTime) / 1000).toFixed(2)} seconds)`.magenta);
        }, 500);
    }, {
        block: command_2.Command.Block,
        block_states: [connreq_1.JsonValue, true]
    });
    command_1.command.register("cut", language_1.WorldeditLangs.Commands.cut, 1).overload((p, o, op) => {
        if (o.isServerCommandOrigin()) {
            op.error(language_1.WorldeditLangs.Errors.ifConsole);
            return;
        }
        ;
        const player = o.getEntity();
        if (!player.isPlayer())
            return;
        const plname = player.getNameTag();
        if (typeof posblocks[plname] !== 'number') {
            op.error(language_1.WorldeditLangs.Errors.notSettedBothPosition);
            return;
        }
        ;
        let highX = Math.max(exports.x2[plname], exports.x1[plname]);
        let highY = Math.max(exports.y2[plname], exports.y1[plname]);
        let highZ = Math.max(exports.z2[plname], exports.z1[plname]);
        let lowX = Math.min(exports.x2[plname], exports.x1[plname]);
        let lowY = Math.min(exports.y2[plname], exports.y1[plname]);
        let lowZ = Math.min(exports.z2[plname], exports.z1[plname]);
        let doneBlocks = 0;
        const Ytotal = highY - lowY;
        const Ztotal = highZ - lowZ;
        let PlaceBlocksOnce = 0;
        let PlaceOnceZ = 1;
        for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
            if (PlaceBlocksOnce + Ytotal > 32767) {
                PlaceOnceZ = i || 1;
                break;
            }
            if (i === Ztotal) {
                PlaceOnceZ = i || 1;
                break;
            }
            PlaceBlocksOnce += Ytotal;
        }
        isProcessing = true;
        createTickingAreas("worldeditarea", { x: lowX, z: lowZ }, { x: highX, z: highZ });
        setTimeout(() => {
            const startTime = Date.now();
            for (let x = lowX; x <= highX; x++) {
                for (let z = lowZ; z <= highZ; z += PlaceOnceZ) {
                    if (z + PlaceOnceZ > highZ) {
                        player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${highZ} air`);
                        doneBlocks += (highZ - z + 1) * Ytotal;
                    }
                    else {
                        player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ} air`);
                        doneBlocks += PlaceBlocksOnce;
                    }
                    player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
                }
            }
            ;
            removeTickingAreas("worldeditarea");
            isProcessing = false;
            const endTime = Date.now();
            player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
            player.sendMessage(`§d${posblocks[plname]} ${language_1.WorldeditLangs.TaskSuccess.cut} (${((endTime - startTime) / 1000).toFixed(2)} ${language_1.WorldeditLangs.TaskSuccess.usedTime})`);
            console.log(`${plname} Cutted ${posblocks[plname]} Blocks (${((endTime - startTime) / 1000).toFixed(2)} seconds)`.magenta);
        }, 500);
    }, {});
    command_1.command.register("walls", language_1.WorldeditLangs.Commands.walls, 1).overload((p, o, op) => {
        if (o.isServerCommandOrigin()) {
            op.error(language_1.WorldeditLangs.Errors.ifConsole);
            return;
        }
        ;
        const player = o.getEntity();
        if (!player.isPlayer())
            return;
        const plname = player.getNameTag();
        if (typeof posblocks[plname] !== 'number') {
            op.error(language_1.WorldeditLangs.Errors.notSettedBothPosition);
            return;
        }
        ;
        let highX = Math.max(exports.x2[plname], exports.x1[plname]);
        let highY = Math.max(exports.y2[plname], exports.y1[plname]);
        let highZ = Math.max(exports.z2[plname], exports.z1[plname]);
        let lowX = Math.min(exports.x2[plname], exports.x1[plname]);
        let lowY = Math.min(exports.y2[plname], exports.y1[plname]);
        let lowZ = Math.min(exports.z2[plname], exports.z1[plname]);
        let doneBlocks = 0;
        const Ytotal = highY - lowY;
        const Ztotal = highZ - lowZ;
        let PlaceBlocksOnce = 0;
        let PlaceOnceZ = 1;
        for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
            if (PlaceBlocksOnce + Ytotal > 32767) {
                PlaceOnceZ = i || 1;
                break;
            }
            ;
            if (i === Ztotal) {
                PlaceOnceZ = i || 1;
                break;
            }
            ;
            PlaceBlocksOnce += Ytotal;
        }
        ;
        isProcessing = true;
        createTickingAreas("worldeditarea", { x: lowX, z: lowZ }, { x: highX, z: highZ });
        setTimeout(() => {
            var _a;
            const startTime = Date.now();
            for (let x = lowX; x <= highX; x++) {
                for (let z = lowZ; z <= highZ; z += PlaceOnceZ) {
                    if (x === lowX || x === highX || z === lowZ || z >= highZ) {
                        const endZ = Math.min(z + PlaceOnceZ, highZ);
                        const startY = lowY;
                        const endY = highY;
                        player.runCommand(`fill ${x} ${startY} ${z} ${x} ${endY} ${endZ} ${p.block.getName().split(":")[1]} ${((_a = p.block_states) === null || _a === void 0 ? void 0 : _a.value().value().replace("{", "[").replace("}", "]")) || "[]"}`);
                        doneBlocks += (endZ - z + 1) * (endY - startY + 1);
                        player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
                    }
                }
            }
            removeTickingAreas("worldeditarea");
            isProcessing = false;
            const endTime = Date.now();
            player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
            player.sendMessage(`§d${doneBlocks} ${language_1.WorldeditLangs.TaskSuccess.set} (${((endTime - startTime) / 1000).toFixed(2)} ${language_1.WorldeditLangs.TaskSuccess.usedTime})`);
            console.log(`${plname} Walled ${doneBlocks} Blocks (${((endTime - startTime) / 1000).toFixed(2)} seconds)`.magenta);
        }, 500);
    }, {
        block: command_2.Command.Block,
        block_states: [connreq_1.JsonValue, true]
    });
    command_1.command.register("replace", language_1.WorldeditLangs.Commands.replace, 1).overload((p, o, op) => {
        if (o.isServerCommandOrigin()) {
            op.error(language_1.WorldeditLangs.Errors.ifConsole);
            return;
        }
        ;
        const player = o.getEntity();
        if (!player.isPlayer())
            return;
        const plname = player.getNameTag();
        if (typeof posblocks[plname] !== 'number') {
            op.error(language_1.WorldeditLangs.Errors.notSettedBothPosition);
            return;
        }
        ;
        let highX = Math.max(exports.x2[plname], exports.x1[plname]);
        let highY = Math.max(exports.y2[plname], exports.y1[plname]);
        let highZ = Math.max(exports.z2[plname], exports.z1[plname]);
        let lowX = Math.min(exports.x2[plname], exports.x1[plname]);
        let lowY = Math.min(exports.y2[plname], exports.y1[plname]);
        let lowZ = Math.min(exports.z2[plname], exports.z1[plname]);
        let doneBlocks = 0;
        const Ytotal = highY - lowY;
        const Ztotal = highZ - lowZ;
        let PlaceBlocksOnce = 0;
        let PlaceOnceZ = 1;
        for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
            if (PlaceBlocksOnce + Ytotal > 32767) {
                PlaceOnceZ = i || 1;
                break;
            }
            ;
            if (i === Ztotal) {
                PlaceOnceZ = i || 1;
                break;
            }
            ;
            PlaceBlocksOnce += Ytotal;
        }
        ;
        isProcessing = true;
        createTickingAreas("worldeditarea", { x: lowX, z: lowZ }, { x: highX, z: highZ });
        setTimeout(() => {
            const startTime = Date.now();
            for (let x = lowX; x <= highX; x++) {
                for (let z = lowZ; z <= highZ; z += PlaceOnceZ) {
                    player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ <= highZ ? z + PlaceOnceZ : highZ} ${p.block.getName().split(":")[1]} replace ${p.replace_block.getName().split(":")[1]} ${p.replace_block_states || "[]"}`);
                    doneBlocks += z + PlaceOnceZ <= highZ ? PlaceBlocksOnce : (highZ - z) * Ytotal;
                    player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
                }
            }
            const endTime = Date.now();
            removeTickingAreas("worldeditarea");
            isProcessing = false;
            player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
            player.sendMessage(`§d${posblocks[plname]} ${language_1.WorldeditLangs.TaskSuccess.replace} (${((endTime - startTime) / 1000).toFixed(2)} ${language_1.WorldeditLangs.TaskSuccess.usedTime})`);
            console.log(`${plname} Replaced ${posblocks[plname]} Blocks (${((endTime - startTime) / 1000).toFixed(2)} seconds)`.magenta);
        }, 500);
    }, {
        block: command_2.Command.Block,
        replace_block: command_2.Command.Block,
        replace_block_states: [connreq_1.JsonValue, true]
    });
    command_1.command.register('up', language_1.WorldeditLangs.Commands.up, 1).overload((p, o, op) => {
        if (o.isServerCommandOrigin()) {
            op.error(language_1.WorldeditLangs.Errors.ifConsole);
            return;
        }
        ;
        const player = o.getEntity();
        if (!player.isPlayer())
            return;
        player.runCommand(`setblock ~ ~${p.blocks - 1} ~ glass`);
        player.runCommand(`tp ~ ~${p.blocks} ~`);
        player.sendMessage("§dWooosh!");
    }, {
        blocks: nativetype_1.int32_t
    });
    command_1.command.register('wand', language_1.WorldeditLangs.Commands.wand, 1).overload((p, o, op) => {
        if (o.isServerCommandOrigin()) {
            op.error(language_1.WorldeditLangs.Errors.ifConsole);
            return;
        }
        ;
        const player = o.getEntity();
        if (!player.isPlayer())
            return;
        player.runCommand("give @s wooden_axe 1");
        player.sendMessage(language_1.WorldeditLangs.TaskSuccess.wand);
    }, {});
    //?addTickToLevelChunk@BlockTickingQueue@@QEAAXAEAVLevelChunk@@AEBVBlockPos@@AEBVBlock@@HH@Z
    //?addToTickingQueue@BlockSource@@QEAAXAEBVBlockPos@@AEBVBlock@@HH_N@Z
    // command.register("test", "test for worldedit", 1).overload((p, o, op)=> {
    // 	const chunkPos = ChunkPos.create(Vec3.create({x: p.x, y: 0, z: p.z}));
    // 	const bSource = bedrockServer.level.getDimension(o.getDimension().getDimensionId())!.getBlockSource();
    // 	const CSource = bedrockServer.level.getDimension(o.getDimension().getDimensionId())!.getChunkSource();
    // 	const chunk = CSource.getOrLoadChunk(chunkPos, 0, true);
    // 	if (CSource.isChunkSaved(chunkPos)) {
    // 		op.error("TEST ERROR! : Already Saved Chunk");
    // 		return;
    // 	};
    // 	if (chunk === null || !chunk.isFullyLoaded()) {
    // 		op.error("TEST ERROR! : NULL Chunk");
    // 		return;
    // 	};
    // 	const chunk2 = bSource.getChunk(chunkPos);
    // 	// const res = _saveChunk(CSource, chunk);
    // }, {
    // 	x: int32_t,
    // 	z: int32_t,
    // 	json: JsonValue
    // });
});
//월엣에 필요한 변수 선언
exports.x1 = {};
exports.x2 = {};
exports.y1 = {};
exports.y2 = {};
exports.z1 = {};
exports.z2 = {};
const posblocks = {};
//우클 꾹 눌렀을때 메세지 도배 방지
let rclickdelay = false;
// events.attackBlock.on((ev) => {
// 	const player = ev.player!;
// 	const plname = player.getNameTag();
// 	const blockpos = ev.blockPos;
// 	const wpname = player.getMainhandSlot().getName();
// 	if (player.getCommandPermissionLevel() >= 1) {
// 		if (wpname == "minecraft:wooden_axe") {
// 			x1[player.getNameTag()] = blockpos.x;
// 			y1[player.getNameTag()] = blockpos.y;
// 			z1[player.getNameTag()] = blockpos.z;
// 			if (x2[player.getNameTag()] !== undefined) {
// 				let max1 = Math.max(x2[player.getNameTag()], blockpos.x);
// 				let max2 = Math.max(y2[player.getNameTag()], blockpos.y);
// 				let max3 = Math.max(z2[player.getNameTag()], blockpos.z);
// 				const min1 = Math.min(x2[player.getNameTag()], blockpos.x);
// 				const min2 = Math.min(y2[player.getNameTag()], blockpos.y);
// 				const min3 = Math.min(z2[player.getNameTag()], blockpos.z);
// 				max1++;
// 				max2++;
// 				max3++;
// 				posblocks[player.getNameTag()] = (max1 - min1) * (max2 - min2) * (max3 - min3);
// 				player.sendMessage(`${WorldeditLangs.TaskSuccess.setFirstPos} (${x1[plname]}, ${y1[plname]}, ${z1[plname]}) (${posblocks[plname]})`)
// 				return CANCEL;
// 			} else {
// 				player.sendMessage(`${WorldeditLangs.TaskSuccess.setFirstPos} (${x1[plname]}, ${y1[plname]}, ${z1[plname]})`)
// 				return CANCEL;
// 			}
// 		}
// 	}
// });
event_1.events.blockDestroy.on((ev) => {
    const player = ev.player;
    const plname = player.getNameTag();
    const blockpos = ev.blockPos;
    const wpname = player.getMainhandSlot().getName();
    if (player.getCommandPermissionLevel() >= 1) {
        if (wpname == "minecraft:wooden_axe") {
            exports.x1[player.getNameTag()] = blockpos.x;
            exports.y1[player.getNameTag()] = blockpos.y;
            exports.z1[player.getNameTag()] = blockpos.z;
            if (exports.x2[player.getNameTag()] !== undefined) {
                let max1 = Math.max(exports.x2[player.getNameTag()], blockpos.x);
                let max2 = Math.max(exports.y2[player.getNameTag()], blockpos.y);
                let max3 = Math.max(exports.z2[player.getNameTag()], blockpos.z);
                const min1 = Math.min(exports.x2[player.getNameTag()], blockpos.x);
                const min2 = Math.min(exports.y2[player.getNameTag()], blockpos.y);
                const min3 = Math.min(exports.z2[player.getNameTag()], blockpos.z);
                max1++;
                max2++;
                max3++;
                posblocks[player.getNameTag()] = (max1 - min1) * (max2 - min2) * (max3 - min3);
                player.sendMessage(`${language_1.WorldeditLangs.TaskSuccess.setFirstPos} (${exports.x1[plname]}, ${exports.y1[plname]}, ${exports.z1[plname]}) (${posblocks[plname]})`);
                return common_1.CANCEL;
            }
            else {
                player.sendMessage(`${language_1.WorldeditLangs.TaskSuccess.setFirstPos} (${exports.x1[plname]}, ${exports.y1[plname]}, ${exports.z1[plname]})`);
                return common_1.CANCEL;
            }
        }
    }
});
/*월엣 우클 감지, 좌클감지*/
event_1.events.itemUseOnBlock.on((ev) => {
    const player = ev.actor;
    const plname = player.getNameTag();
    const x = ev.x;
    const y = ev.y;
    const z = ev.z;
    const wpname = ev.itemStack.getName();
    if (player.getCommandPermissionLevel() >= 1) {
        if (wpname == "minecraft:wooden_axe") {
            if (!rclickdelay) {
                exports.x2[player.getNameTag()] = x;
                exports.y2[player.getNameTag()] = y;
                exports.z2[player.getNameTag()] = z;
                if (exports.x1[player.getNameTag()] !== undefined) {
                    let max1 = Math.max(exports.x1[player.getNameTag()], x);
                    let max2 = Math.max(exports.y1[player.getNameTag()], y);
                    let max3 = Math.max(exports.z1[player.getNameTag()], z);
                    const min1 = Math.min(exports.x1[player.getNameTag()], x);
                    const min2 = Math.min(exports.y1[player.getNameTag()], y);
                    const min3 = Math.min(exports.z1[player.getNameTag()], z);
                    max1++;
                    max2++;
                    max3++;
                    posblocks[player.getNameTag()] = (max1 - min1) * (max2 - min2) * (max3 - min3);
                    player.sendMessage(`${language_1.WorldeditLangs.TaskSuccess.setSecondPos} (${exports.x2[plname]}, ${exports.y2[plname]}, ${exports.z2[plname]}) (${posblocks[plname]})`);
                    rclickdelay = true;
                    setTimeout(function () { rclickdelay = false; }, 150);
                    return common_1.CANCEL;
                }
                else {
                    player.sendMessage(`${language_1.WorldeditLangs.TaskSuccess.setSecondPos} (${exports.x2[plname]}, ${exports.y2[plname]}, ${exports.z2[plname]})`);
                    rclickdelay = true;
                    setTimeout(function () { rclickdelay = false; }, 150);
                    return common_1.CANCEL;
                }
            }
            return common_1.CANCEL;
        }
    }
});
// const dllLocation = Path.join(__dirname + '/bdsx-pregen.dll');
// const pregenDll = NativeModule.load(dllLocation);
// const _saveChunk: (source: ChunkSource, chunk: LevelChunk) => boolean = pregenDll.getFunction('testSave', bool_t, null, ChunkSource, LevelChunk);
// //Reffered SacriPudding's Pre-Gen Plugin
console.log((0, colors_1.green)("[World Edit] Activated!"));
//이 플러그인은 2차수정/배포를 절대 금지합니다
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGRlZGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid29ybGRlZGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUF1QztBQUN2QyxzQ0FBb0M7QUFDcEMsa0RBQXdEO0FBQ3hELDRDQUE4QztBQUM5Qyw4Q0FBMkM7QUFDM0Msd0NBQXFDO0FBQ3JDLGdEQUE0RDtBQUM1RCxtQ0FBK0I7QUFFL0IsZ0RBQTZEO0FBRTdELHlDQUE0QztBQUU1QyxnREFBNkM7QUFDN0MsOENBQTZDO0FBQzdDLG9DQUF3QztBQUV4QyxJQUFJLFlBQVksR0FBWSxLQUFLLENBQUM7QUFFbEMsY0FBTSxDQUFDLFVBQVUsQ0FBQyw4QkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO0lBQ2xELElBQUksWUFBWSxLQUFLLElBQUk7UUFDeEIsT0FBTyxlQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDLENBQUM7QUFFSCx1QkFBVSxDQUFDLE9BQU8sQ0FBQyxpRUFBaUUsRUFBRSxxQkFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLGtCQUFXLEVBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ25JLHVCQUFVLENBQUMsT0FBTyxDQUFDLDJEQUEyRCxFQUFFLHFCQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsa0JBQVcsRUFBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFN0gsU0FBUyxZQUFZO0lBQ2pCLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsQ0FBQztBQUVELE1BQU0sc0JBQXNCLEdBQWEsRUFBRSxDQUFDO0FBRTVDLE1BQU0sUUFBUTtJQUtWLFlBQVksSUFBVyxFQUFFLElBQTRCLEVBQUUsSUFBNEI7UUFDL0UsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztDQUNK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SSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFNUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLGVBQWUsRUFBRTtZQUMxQyxFQUFFLENBQUMsS0FBSyxDQUFDLHlCQUFjLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNDLE9BQU87U0FDUDtRQUFBLENBQUM7UUFFRixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFbkIsTUFBTSxNQUFNLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztRQUM1QixNQUFNLE1BQU0sR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN4QixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFD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SyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRTVDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUVuQixNQUFNLE1BQU0sR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQzVCLE1BQU0sTUFBTSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7UUFFNUIsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUVuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxlQUFlLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlDLElBQUksZUFBZSxHQUFHLE1BQU0sR0FBRyxLQUFLLEVBQUU7Z0JBQ3JDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixNQUFNO2FBQ047WUFDRCxJQUFJLENBQUMsS0FBSyxNQUFNLEVBQUU7Z0JBQ2pCLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixNQUFNO2FBQ047WUFFRCxlQUFlLElBQUksTUFBTSxDQUFDO1NBQzFCO1FBRUQsWUFBWSxHQUFHLElBQUksQ0FBQztRQUVwQixrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsRUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUM7UUFFN0UsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNmLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUU3QixLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsSUFBSSxVQUFVLEVBQUU7b0JBQy9DLElBQUksQ0FBQyxHQUFHLFVBQVUsR0FBRyxLQUFLLEVBQUU7d0JBQzNCLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUM7d0JBQ3ZFLFVBQVUsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO3FCQUN2Qzt5QkFBTTt3QkFDTixNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsVUFBVSxNQUFNLENBQUMsQ0FBQzt3QkFDaEYsVUFBVSxJQUFJLGVBQWUsQ0FBQztxQkFDOUI7b0JBQ0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLFVBQVUsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNuRTthQUNEO1lBQUEsQ0FBQztZQUVMLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBRWpDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFckIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRTNCLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxRSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLHlCQUFjLENBQUMsV0FBVyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSx5QkFBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ3JLLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLFdBQVcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUgsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxFQUFFLEVBQ0YsQ0FBQyxDQUFDO0lBRUgsaUJBQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLHlCQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ2pGLElBQUksQ0FBQyxDQUFDLHFCQUFxQixFQUFFLEVBQUU7WUFDOUIsRUFBRSxDQUFDLEtBQUssQ0FBQyx5QkFBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUN6QyxPQUFPO1NBQ1A7UUFBQSxDQUFDO1FBRUYsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBa0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUFFLE9BQU87UUFFL0IsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ25DLElBQUksT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQzFDLEVBQUUsQ0FBQyxLQUFLLENBQUMseUJBQWMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUN0RCxPQUFPO1NBQ1A7UUFBQSxDQUFDO1FBRUYsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFNUMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLE1BQU0sTUFBTSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDNUIsTUFBTSxNQUFNLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztRQUU1QixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGVBQWUsSUFBSSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDOUMsSUFBSSxlQUFlLEdBQUcsTUFBTSxHQUFHLEtBQUssRUFBRTtnQkFDckMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BCLE1BQU07YUFDTjtZQUFBLENBQUM7WUFDRixJQUFJLENBQUMsS0FBSyxNQUFNLEVBQUU7Z0JBQ2pCLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixNQUFNO2FBQ047WUFBQSxDQUFDO1lBRUYsZUFBZSxJQUFJLE1BQU0sQ0FBQztTQUMxQjtRQUFBLENBQUM7UUFFRixZQUFZLEdBQUcsSUFBSSxDQUFDO1FBRXBCLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUU3RSxVQUFVLENBQUMsR0FBRyxFQUFFOztZQUNmLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUU3QixLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsSUFBSSxVQUFVLEVBQUU7b0JBQy9DLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRTt3QkFDMUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUM3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUM7d0JBQ3BCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQzt3QkFFbkIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUEsTUFBQSxDQUFDLENBQUMsWUFBWSwwQ0FBRSxLQUFLLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUksSUFBSSxFQUFFLENBQUMsQ0FBQzt3QkFDckwsVUFBVSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25ELE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxVQUFVLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDbkU7aUJBQ0Q7YUFDRDtZQUVKLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBRWpDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFckIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRTNCLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxRSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssVUFBVSxJQUFJLHlCQUFjLENBQUMsV0FBVyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSx5QkFBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQzlKLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLFdBQVcsVUFBVSxZQUFZLENBQUMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckgsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxFQUFFO1FBQ0YsS0FBSyxFQUFFLGlCQUFPLENBQUMsS0FBSztRQUNwQixZQUFZLEVBQUUsQ0FBQyxtQkFBUyxFQUFFLElBQUksQ0FBQztLQUMvQixDQUFDLENBQUM7SUFFSCxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUseUJBQWMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDckYsSUFBSSxDQUFDLENBQUMscUJBQXFCLEVBQUUsRUFBRTtZQUM5QixFQUFFLENBQUMsS0FBSyxDQUFDLHlCQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ3pDLE9BQU87U0FDUDtRQUFBLENBQUM7UUFFRixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFrQixDQUFDO1FBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQUUsT0FBTztRQUUvQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbkMsSUFBSSxPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDMUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx5QkFBYyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3RELE9BQU87U0FDUDtRQUFBLENBQUM7UUFFRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUU1QyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFbkIsTUFBTSxNQUFNLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztRQUM1QixNQUFNLE1BQU0sR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRTVCLElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN4QixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsZUFBZSxJQUFJLEtBQUssRUFBRSxDQUFDLEVB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QUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLFVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxTQUFTLEVBQUU7b0JBQzFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNsRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELElBQUksRUFBRSxDQUFDO29CQUNQLElBQUksRUFBRSxDQUFDO29CQUNQLElBQUksRUFBRSxDQUFDO29CQUNQLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDL0UsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLHlCQUFjLENBQUMsV0FBVyxDQUFDLFlBQVksS0FBSyxVQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssVUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN0SSxXQUFXLEdBQUcsSUFBSSxDQUFDO29CQUNuQixVQUFVLENBQUMsY0FBYyxXQUFXLEdBQUcsS0FBSyxDQUFBLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNyRCxPQUFPLGVBQU0sQ0FBQztpQkFDZDtxQkFBTTtvQkFDTixNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcseUJBQWMsQ0FBQyxXQUFXLENBQUMsWUFBWSxLQUFLLFVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxVQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssVUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtvQkFDOUcsV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDbkIsVUFBVSxDQUFDLGNBQWMsV0FBVyxHQUFHLEtBQUssQ0FBQSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckQsT0FBTyxlQUFNLENBQUM7aUJBQ2Q7YUFDRDtZQUNELE9BQU8sZUFBTSxDQUFDO1NBQ2Q7S0FDRDtBQUNGLENBQUMsQ0FBQyxDQUFBO0FBR0YsaUVBQWlFO0FBQ2pFLG9EQUFvRDtBQUNwRCxvSkFBb0o7QUFDcEosMkNBQTJDO0FBRzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFLLEVBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO0FBRTlDLDJCQUEyQiJ9