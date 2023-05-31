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
const player_1 = require("bdsx/bds/player");
const blockpos_1 = require("bdsx/bds/blockpos");
const language_1 = require("./language");
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
        if (posblocks[plname] <= 32767) {
            player.runCommand(`fill ${highX} ${highY} ${highZ} ${lowX} ${lowY} ${lowZ} ${p.block.getName().split(":")[1]} ${p.block_states || "[]"}`);
            player.sendMessage(`§d${posblocks[plname]} ${language_1.WorldeditLangs.TaskSuccess.set}`);
            console.log(`${plname} Placed ${posblocks[plname]} Blocks`.magenta);
            return;
        }
        ;
        if (p.block.getName() === "minecraft:tnt") {
            op.error(language_1.WorldeditLangs.Errors.TooManyTNT);
            return;
        }
        ;
        let doneBlocks = 0;
        const Ytotal = highY - lowY;
        const Ztotal = highZ - lowZ;
        let PlaceBlocksOnce = 0;
        let PlaceOnceZ = 0;
        for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
            if (PlaceBlocksOnce + Ytotal > 32767) {
                PlaceOnceZ = i;
                break;
            }
            ;
            if (i === Ztotal) {
                PlaceOnceZ = i;
                break;
            }
            ;
            PlaceBlocksOnce += Ytotal;
        }
        ;
        let executed = false;
        event_1.events.packetSend(packetids_1.MinecraftPacketIds.Text).on(() => {
            if (executed === true)
                return;
            return common_1.CANCEL;
        });
        const fakepl1 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: lowX, y: highY, z: lowZ }), player.getDimensionId());
        const fakepl2 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: highX, y: highY, z: highZ }), player.getDimensionId());
        const fakepl3 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: lowX, y: highY, z: highZ }), player.getDimensionId());
        const fakepl4 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: highX, y: highY, z: lowZ }), player.getDimensionId());
        const fakepl5 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: (highX + lowX) / 2, y: highY, z: (lowZ + highZ) / 2 }), player.getDimensionId());
        setTimeout(() => {
            const startTime = Date.now();
            for (let x = lowX; x <= highX; x++) {
                for (let z = lowZ; z <= highZ;) {
                    player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ <= highZ ? z + PlaceOnceZ : highZ} ${p.block.getName().split(":")[1]} ${p.block_states || "[]"}`);
                    doneBlocks += z + PlaceOnceZ <= highZ ? PlaceBlocksOnce : (highZ - (z + 1)) * Ytotal;
                    player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
                    z += PlaceOnceZ;
                }
                ;
            }
            ;
            const endTime = Date.now();
            fakepl1.simulateDisconnect();
            fakepl2.simulateDisconnect();
            fakepl3.simulateDisconnect();
            fakepl4.simulateDisconnect();
            fakepl5.simulateDisconnect();
            executed = true;
            player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
            player.sendMessage(`§d${posblocks[plname]} ${language_1.WorldeditLangs.TaskSuccess.set} (${((endTime - startTime) / 1000).toFixed(2)} ${language_1.WorldeditLangs.TaskSuccess.usedTime})`);
            console.log(`${plname} Placed ${posblocks[plname]} Blocks (${((endTime - startTime) / 1000).toFixed(2)} seconds)`.magenta);
        }, 500);
    }, {
        block: command_2.Command.Block,
        block_states: [nativetype_1.CxxString, true]
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
        if (posblocks[plname] <= 32767) {
            player.runCommand(`fill ${highX} ${highY} ${highZ} ${lowX} ${lowY} ${lowZ} air`);
            player.sendMessage(`§d${posblocks[plname]} ${language_1.WorldeditLangs.TaskSuccess.cut}`);
            return;
        }
        ;
        let doneBlocks = 0;
        const Ytotal = highY - lowY;
        const Ztotal = highZ - lowZ;
        let PlaceBlocksOnce = 0;
        let PlaceOnceZ = 0;
        for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
            if (PlaceBlocksOnce + Ytotal > 32767) {
                PlaceOnceZ = i;
                break;
            }
            ;
            if (i === Ztotal) {
                PlaceOnceZ = i;
                break;
            }
            ;
            PlaceBlocksOnce += Ytotal;
        }
        ;
        let executed = false;
        event_1.events.packetSend(packetids_1.MinecraftPacketIds.Text).on(() => {
            if (executed === true)
                return;
            return common_1.CANCEL;
        });
        const fakepl1 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: lowX, y: highY, z: lowZ }), player.getDimensionId());
        const fakepl2 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: highX, y: highY, z: highZ }), player.getDimensionId());
        const fakepl3 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: lowX, y: highY, z: highZ }), player.getDimensionId());
        const fakepl4 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: highX, y: highY, z: lowZ }), player.getDimensionId());
        const fakepl5 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: (highX + lowX) / 2, y: highY, z: (lowZ + highZ) / 2 }), player.getDimensionId());
        setTimeout(() => {
            const startTime = Date.now();
            for (let x = lowX; x <= highX; x++) {
                for (let z = lowZ; z <= highZ;) {
                    player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ <= highZ ? z + PlaceOnceZ : highZ} air`);
                    doneBlocks += z + PlaceOnceZ <= highZ ? PlaceBlocksOnce : (highZ - (z + 1)) * Ytotal;
                    player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
                    z += PlaceOnceZ;
                }
                ;
            }
            ;
            fakepl1.simulateDisconnect();
            fakepl2.simulateDisconnect();
            fakepl3.simulateDisconnect();
            fakepl4.simulateDisconnect();
            fakepl5.simulateDisconnect();
            executed = true;
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
        let PlaceOnceZ = 0;
        for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
            if (PlaceBlocksOnce + Ytotal > 32767) {
                PlaceOnceZ = i;
                break;
            }
            ;
            if (i === Ztotal) {
                PlaceOnceZ = i;
                break;
            }
            ;
            PlaceBlocksOnce += Ytotal;
        }
        ;
        let executed = false;
        event_1.events.packetSend(packetids_1.MinecraftPacketIds.Text).on(() => {
            if (executed === true)
                return;
            return common_1.CANCEL;
        });
        const fakepl1 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: lowX, y: highY, z: lowZ }), player.getDimensionId());
        const fakepl2 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: highX, y: highY, z: highZ }), player.getDimensionId());
        const fakepl3 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: lowX, y: highY, z: highZ }), player.getDimensionId());
        const fakepl4 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: highX, y: highY, z: lowZ }), player.getDimensionId());
        const fakepl5 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: (highX + lowX) / 2, y: highY, z: (lowZ + highZ) / 2 }), player.getDimensionId());
        setTimeout(() => {
            const startTime = Date.now();
            for (let x = lowX; x <= highX; x++) {
                for (let z = lowZ; z <= highZ; z += PlaceOnceZ) {
                    if (x === lowX) {
                        player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ <= highZ ? z + PlaceOnceZ : highZ} ${p.block.getName().split(":")[1]} ${p.block_states || "[]"}`);
                        doneBlocks += z + PlaceOnceZ <= highZ ? PlaceBlocksOnce : (highZ - (z + 1)) * Ytotal;
                        player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
                        continue;
                    }
                    ;
                    if (x === highX) {
                        player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ <= highZ ? z + PlaceOnceZ : highZ} ${p.block.getName().split(":")[1]} ${p.block_states || "[]"}`);
                        doneBlocks += z + PlaceOnceZ <= highZ ? PlaceBlocksOnce : (highZ - (z + 1)) * Ytotal;
                        player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
                        continue;
                    }
                    ;
                    player.runCommand(`fill ${x} ${highY} ${lowZ} ${x} ${lowY} ${lowZ} ${p.block.getName().split(":")[1]} ${p.block_states || "[]"}`);
                    player.runCommand(`fill ${x} ${highY} ${highZ} ${x} ${lowY} ${highZ} ${p.block.getName().split(":")[1]} ${p.block_states || "[]"}`);
                    doneBlocks += Ytotal * 2;
                }
                ;
            }
            ;
            fakepl1.simulateDisconnect();
            fakepl2.simulateDisconnect();
            fakepl3.simulateDisconnect();
            fakepl4.simulateDisconnect();
            fakepl5.simulateDisconnect();
            executed = true;
            const endTime = Date.now();
            player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
            player.sendMessage(`§d${doneBlocks} ${language_1.WorldeditLangs.TaskSuccess.set} (${((endTime - startTime) / 1000).toFixed(2)} ${language_1.WorldeditLangs.TaskSuccess.usedTime})`);
            console.log(`${plname} Walled ${doneBlocks} Blocks (${((endTime - startTime) / 1000).toFixed(2)} seconds)`.magenta);
        }, 500);
    }, {
        block: command_2.Command.Block,
        block_states: [nativetype_1.CxxString, true]
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
        if (posblocks[plname] <= 32767) {
            player.runCommand(`fill ${highX} ${highY} ${highZ} ${lowX} ${lowY} ${lowZ} ${p.block.getName().split(":")[1]} replace ${p.replace_block.getName().split(":")[1]} ${p.replace_block_states || "[]"}`);
            player.sendMessage(`§d${posblocks[plname]} ${language_1.WorldeditLangs.TaskSuccess.replace}`);
            return;
        }
        ;
        let doneBlocks = 0;
        const Ytotal = highY - lowY;
        const Ztotal = highZ - lowZ;
        let PlaceBlocksOnce = 0;
        let PlaceOnceZ = 0;
        for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
            if (PlaceBlocksOnce + Ytotal > 32767) {
                PlaceOnceZ = i;
                break;
            }
            ;
            if (i === Ztotal) {
                PlaceOnceZ = i;
                break;
            }
            ;
            PlaceBlocksOnce += Ytotal;
        }
        ;
        let executed = false;
        event_1.events.packetSend(packetids_1.MinecraftPacketIds.Text).on(() => {
            if (executed === true)
                return;
            return common_1.CANCEL;
        });
        const fakepl1 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: lowX, y: highY, z: lowZ }), player.getDimensionId());
        const fakepl2 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: highX, y: highY, z: highZ }), player.getDimensionId());
        const fakepl3 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: lowX, y: highY, z: highZ }), player.getDimensionId());
        const fakepl4 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: highX, y: highY, z: lowZ }), player.getDimensionId());
        const fakepl5 = player_1.SimulatedPlayer.create("", blockpos_1.Vec3.create({ x: (highX + lowX) / 2, y: highY, z: (lowZ + highZ) / 2 }), player.getDimensionId());
        setTimeout(() => {
            const startTime = Date.now();
            for (let x = lowX; x <= highX; x++) {
                for (let z = lowZ; z <= highZ;) {
                    player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ <= highZ ? z + PlaceOnceZ : highZ} ${p.block.getName().split(":")[1]} replace ${p.replace_block.getName().split(":")[1]} ${p.replace_block_states || "[]"}`);
                    doneBlocks += z + PlaceOnceZ <= highZ ? PlaceBlocksOnce : (highZ - (z + 1)) * Ytotal;
                    player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
                    z += PlaceOnceZ;
                }
                ;
            }
            ;
            const endTime = Date.now();
            fakepl1.simulateDisconnect();
            fakepl2.simulateDisconnect();
            fakepl3.simulateDisconnect();
            fakepl4.simulateDisconnect();
            fakepl5.simulateDisconnect();
            executed = true;
            player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
            player.sendMessage(`§d${posblocks[plname]} ${language_1.WorldeditLangs.TaskSuccess.replace} (${((endTime - startTime) / 1000).toFixed(2)} ${language_1.WorldeditLangs.TaskSuccess.usedTime})`);
            console.log(`${plname} Replaced ${posblocks[plname]} Blocks (${((endTime - startTime) / 1000).toFixed(2)} seconds)`.magenta);
        }, 500);
    }, {
        block: command_2.Command.Block,
        replace_block: command_2.Command.Block,
        replace_block_states: [nativetype_1.CxxString, true]
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
//커맨드 실행 단축어
const run = launcher_1.bedrockServer.executeCommand;
event_1.events.attackBlock.on((ev) => {
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
console.log((0, colors_1.green)("[World Edit] Activated!"));
//이 플러그인은 2차수정/배포를 절대 금지합니다
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGRlZGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid29ybGRlZGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUF1QztBQUN2QyxzQ0FBb0M7QUFDcEMsa0RBQXdEO0FBQ3hELDRDQUE4QztBQUM5Qyw4Q0FBMkM7QUFDM0Msd0NBQXFDO0FBQ3JDLGdEQUFxRDtBQUNyRCxtQ0FBK0I7QUFDL0IsNENBQWdFO0FBQ2hFLGdEQUF5QztBQUV6Qyx5Q0FBNEM7QUFHNUMsY0FBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRSxFQUFFO0lBRXpCLGlCQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSx5QkFBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsRUFBRTtRQUM1RSxJQUFJLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFO1lBQzlCLEVBQUUsQ0FBQyxLQUFLLENBQUMseUJBQWMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUMsT0FBTztTQUNQO1FBQUEsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQWtCLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFBRSxPQUFPO1FBRS9CLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNuQyxJQUFJLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUMxQyxFQUFFLENBQUMsS0FBSyxDQUFDLHlCQUFjLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDdEQsT0FBTztTQUNQO1FBQUEsQ0FBQztRQUVGLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRTVDLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssRUFBRTtZQUMvQixNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUkseUJBQWMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUMvRSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxXQUFXLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BFLE9BQU87U0FDUDtRQUFBLENBQUM7UUFFRixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssZUFBZSxFQUFFO1lBQzFDLEVBQUUsQ0FBQyxLQUFLLENBQUMseUJBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsT0FBTztTQUNQO1FBQUEsQ0FBQztRQUVGLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUVuQixNQUFNLE1BQU0sR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQzVCLE1BQU0sTUFBTSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7UUFFNUIsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUVuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxlQUFlLElBQUksS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlDLElBQUksZUFBZSxHQUFHLE1BQU0sR0FBRyxLQUFLLEVBQUU7Z0JBQ3JDLFVBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsTUFBTTthQUNOO1lBQUEsQ0FBQztZQUNGLElBQUksQ0FBQyxLQUFLLE1BQU0sRUFBRTtnQkFDakIsVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDZixNQUFNO2FBQ047WUFBQSxDQUFDO1lBRUYsZUFBZSxJQUFJLE1BQU0sQ0FBQztTQUMxQjtRQUFBLENBQUM7UUFHRixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFckIsY0FBTSxDQUFDLFVBQVUsQ0FBQyw4QkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO1lBQ2xELElBQUksUUFBUSxLQUFLLElBQUk7Z0JBQUUsT0FBTztZQUM5QixPQUFPLGVBQU0sQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsd0JBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDL0csTUFBTSxPQUFPLEdBQUcsd0JBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDakgsTUFBTSxPQUFPLEdBQUcsd0JBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDaEgsTUFBTSxPQUFPLEdBQUcsd0JBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDaEgsTUFBTSxPQUFPLEdBQUcsd0JBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFDLEtBQUssQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFF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QUVILE1BQU0sT0FBTyxHQUFHLHdCQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQy9HLE1BQU0sT0FBTyxHQUFHLHdCQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2pILE1BQU0sT0FBTyxHQUFHLHdCQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2hILE1BQU0sT0FBTyxHQUFHLHdCQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2hILE1BQU0sT0FBTyxHQUFHLHdCQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksR0FBQyxLQUFLLENBQUMsR0FBQyxDQUFDLEVB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RSxlQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2hILE1BQU0sT0FBTyxHQUFHLHdCQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2hILE1BQU0sT0FBTyxHQUFHLHdCQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFJLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksR0FBQyxLQUFLLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBRW5JLFVBQVUsQ0FBQyxHQUFFLEVBQUU7WUFDZCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLElBQUksVUFBVSxFQUFFO29CQUUvQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7d0JBQ2YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFDLFVBQVUsSUFBSSxLQUFLLENB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QUFDLEtBQUssQ0FBQyx5QkFBYyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3RELE9BQU87U0FDUDtRQUFBLENBQUM7UUFFRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUU1QyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLEVBQUU7WUFDL0IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3JNLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUkseUJBQWMsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNuRixPQUFPO1NBQ1A7UUFBQSxDQUFDO1FBRUYsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLE1BQU0sTUFBTSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDNUIsTUFBTSxNQUFNLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztRQUU1QixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLGVBQWUsSUFBSSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDOUMsSUFBSSxlQUFlLEdBQUcsTUFBTSxHQUFHLEtBQUssRUFBRTtnQkFDckMsVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDZixNQUFNO2FBQ047WUFBQSxDQUFDO1lBQ0YsSUFBSSxDQUFDLEtBQUssTUFBTSxFQUFFO2dCQUNqQixVQUFVLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLE1BQU07YUFDTjtZQUFBLENBQUM7WUFFRixlQUFlLElBQUksTUFBTSxDQUFDO1NBQzFCO1FBQUEsQ0FBQztRQUdGLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztRQUVyQixjQUFNLENBQUMsVUFBVSxDQUFDLDhCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUU7WUFDbEQsSUFBSSxRQUFRLEtBQUssSUFBSTtnQkFBRSxPQUFPO1lBQzlCLE9BQU8sZUFBTSxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyx3QkFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUMvRyxNQUFNLE9BQU8sR0FBRyx3QkFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUNqSCxNQUFNLE9BQU8sR0FBRyx3QkFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUNoSCxNQUFNLE9BQU8sR0FBRyx3QkFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUNoSCxNQUFNLE9BQU8sR0FBRyx3QkFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUMsS0FBSyxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUVuSSxV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QztZQUNyQyxJQUFJLFVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQzFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxDQUFDO2dCQUNQLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDL0UsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLHlCQUFjLENBQUMsV0FBVyxDQUFDLFdBQVcsS0FBSyxVQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssVUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNwSSxPQUFPLGVBQU0sQ0FBQzthQUNkO2lCQUFNO2dCQUNOLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyx5QkFBYyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEtBQUssVUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxVQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUM3RyxPQUFPLGVBQU0sQ0FBQzthQUNkO1NBQ0Q7S0FDRDtBQUVGLENBQUMsQ0FBQyxDQUFBO0FBRUYsa0JBQWtCO0FBRWxCLGNBQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDL0IsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQXNCLENBQUM7SUFDekMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDZixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2YsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNmLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdEMsSUFBSSxNQUFNLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLEVBQUU7UUFDNUMsSUFBSSxNQUFNLElBQUksc0JBQXNCLEVBQUU7WUFDckMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDakIsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxVQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUMxQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNsRCxJQUFJLEVBQUUsQ0FBQztvQkFDUCxJQUFJLEVBQUUsQ0FBQztvQkFDUCxJQUFJLEVBQUUsQ0FBQztvQkFDUCxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQy9FLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyx5QkFBYyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEtBQUssVUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxVQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEksV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDbkIsVUFBVSxDQUFDLGNBQWMsV0FBVyxHQUFHLEtBQUssQ0FBQSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDckQsT0FBTyxlQUFNLENBQUM7aUJBQ2Q7cUJBQU07b0JBQ04sTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLHlCQUFjLENBQUMsV0FBVyxDQUFDLFlBQVksS0FBSyxVQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssVUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7b0JBQzlHLFdBQVcsR0FBRyxJQUFJLENBQUM7b0JBQ25CLFVBQVUsQ0FBQyxjQUFjLFdBQVcsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3JELE9BQU8sZUFBTSxDQUFDO2lCQUNkO2FBQ0Q7WUFDRCxPQUFPLGVBQU0sQ0FBQztTQUNkO0tBQ0Q7QUFDRixDQUFDLENBQUMsQ0FBQTtBQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFLLEVBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO0FBRTlDLDJCQUEyQiJ9