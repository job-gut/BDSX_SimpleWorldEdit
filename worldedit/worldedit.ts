import { command } from "bdsx/command";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { bedrockServer } from "bdsx/launcher";
import { Command } from "bdsx/bds/command";
import { CANCEL } from "bdsx/common";
import { bool_t, int32_t } from "bdsx/nativetype";
import { green } from "colors";
import { ServerPlayer, SimulatedPlayer } from "bdsx/bds/player";
import { ChunkPos, Vec3 } from "bdsx/bds/blockpos";

import { WorldeditLangs } from "./language";
import { ChunkSource, LevelChunk } from "bdsx/bds/chunk";
import { procHacker } from "bdsx/prochacker";
import { JsonValue } from "bdsx/bds/connreq";

let isProcessing: boolean = false;

events.packetSend(MinecraftPacketIds.Text).on(() => {
	if (isProcessing === true) 
	return CANCEL;
});

// declare module "bdsx/bds/chunk" {
// 	interface ChunkSource {
// 		getOrLoadChunk(chunkPos: ChunkPos, LoadMode: number, unknown: boolean): LevelChunk
// 	}
// };

// ChunkSource.prototype.getOrLoadChunk = 
// procHacker.js("?getOrLoadChunk@ChunkSource@@UEAA?AV?$shared_ptr@VLevelChunk@@@std@@AEBVChunkPos@@W4LoadMode@1@_N@Z", LevelChunk, {
// 	this: LevelChunk
// });

events.serverOpen.on(()=> {

command.register("set", WorldeditLangs.Commands.set, 1).overload((p, o, op)=> {
	if (o.isServerCommandOrigin()) {
		op.error(WorldeditLangs.Errors.ifConsole);
		return;
	};

	const player = o.getEntity() as ServerPlayer;
	if (!player.isPlayer()) return;

	const plname = player.getNameTag();
	if (typeof posblocks[plname] !== 'number') {
		op.error(WorldeditLangs.Errors.notSettedBothPosition);
		return;
	};

	let highX = Math.max(x2[plname], x1[plname]);
	let highY = Math.max(y2[plname], y1[plname]);
	let highZ = Math.max(z2[plname], z1[plname]);
	let lowX = Math.min(x2[plname], x1[plname]);
	let lowY = Math.min(y2[plname], y1[plname]);
	let lowZ = Math.min(z2[plname], z1[plname]);

	if (p.block.getName() === "minecraft:tnt") {
		op.error(WorldeditLangs.Errors.TooManyTNT);
		return;
	};

	let doneBlocks = 0;

	const Ytotal = highY - lowY;
	const Ztotal = highZ - lowZ;

	let PlaceBlocksOnce = 0;
	let PlaceOnceZ = 1;

	for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
		if (PlaceBlocksOnce + Ytotal > 32767) {
			PlaceOnceZ = i || 1;
			break;
		};
		if (i === Ztotal) {
			PlaceOnceZ = i || 1;
			break;
		};

		PlaceBlocksOnce += Ytotal;
	};

	isProcessing = true;

	const fakepl1 = SimulatedPlayer.create("", Vec3.create({x: lowX, y: highY, z: lowZ}), player.getDimensionId());
	const fakepl2 = SimulatedPlayer.create("", Vec3.create({x: highX, y: highY, z: highZ}), player.getDimensionId());
	const fakepl3 = SimulatedPlayer.create("", Vec3.create({x: lowX, y: highY, z: highZ}), player.getDimensionId());
	const fakepl4 = SimulatedPlayer.create("", Vec3.create({x: highX, y: highY, z: lowZ}), player.getDimensionId());
	const fakepl5 = SimulatedPlayer.create("", Vec3.create({x: (highX+lowX)/2, y: highY, z: (lowZ+highZ)/2}), player.getDimensionId());

	setTimeout(()=> {
		const startTime = Date.now();

		for (let x = lowX; x <= highX; x++) {
			for (let z = lowZ; z <= highZ; z += PlaceOnceZ) {
				if (z + PlaceOnceZ > highZ) {
					player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${highZ} ${p.block.getName().split(":")[1]} ${p.block_states?.value().toString().replace("{", "[").replace("}", "]") || []}`);
					doneBlocks += (highZ - z + 1) * Ytotal;
				} else {
					player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ} ${p.block.getName().split(":")[1]} ${p.block_states?.value().toString().replace("{", "[").replace("}", "]") || []}`);
					doneBlocks += PlaceBlocksOnce;
				};
				player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
			};
		};
	
		const endTime = Date.now();
		fakepl1.simulateDisconnect();
		fakepl2.simulateDisconnect();
		fakepl3.simulateDisconnect();
		fakepl4.simulateDisconnect();
		fakepl5.simulateDisconnect();
	
		isProcessing = false;
	
		player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
		player.sendMessage(`§d${posblocks[plname]} ${WorldeditLangs.TaskSuccess.set} (${((endTime - startTime)/1000).toFixed(2)} ${WorldeditLangs.TaskSuccess.usedTime})`);
		console.log(`${plname} Placed ${posblocks[plname]} Blocks (${((endTime - startTime)/1000).toFixed(2)} seconds)`.magenta);
	}, 500);

}, {
	block: Command.Block,
	block_states: [JsonValue, true]
});

command.register("cut", WorldeditLangs.Commands.cut, 1).overload((p, o, op)=> {
	if (o.isServerCommandOrigin()) {
		op.error(WorldeditLangs.Errors.ifConsole)
		return;
	};

	const player = o.getEntity() as ServerPlayer;
	if (!player.isPlayer()) return;

	const plname = player.getNameTag();
	if (typeof posblocks[plname] !== 'number') {
		op.error(WorldeditLangs.Errors.notSettedBothPosition);
		return;
	};

	let highX = Math.max(x2[plname], x1[plname]);
	let highY = Math.max(y2[plname], y1[plname]);
	let highZ = Math.max(z2[plname], z1[plname]);
	let lowX = Math.min(x2[plname], x1[plname]);
	let lowY = Math.min(y2[plname], y1[plname]);
	let lowZ = Math.min(z2[plname], z1[plname]);

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

	const fakepl1 = SimulatedPlayer.create("", Vec3.create({x: lowX, y: highY, z: lowZ}), player.getDimensionId());
	const fakepl2 = SimulatedPlayer.create("", Vec3.create({x: highX, y: highY, z: highZ}), player.getDimensionId());
	const fakepl3 = SimulatedPlayer.create("", Vec3.create({x: lowX, y: highY, z: highZ}), player.getDimensionId());
	const fakepl4 = SimulatedPlayer.create("", Vec3.create({x: highX, y: highY, z: lowZ}), player.getDimensionId());
	const fakepl5 = SimulatedPlayer.create("", Vec3.create({x: (highX+lowX)/2, y: highY, z: (lowZ+highZ)/2}), player.getDimensionId());

	setTimeout(()=> {
		const startTime = Date.now();

		for (let x = lowX; x <= highX; x++) {
			for (let z = lowZ; z <= highZ; z += PlaceOnceZ) {
				if (z + PlaceOnceZ > highZ) {
					player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${highZ} air`);
					doneBlocks += (highZ - z + 1) * Ytotal;
				} else {
					player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ} air`);
					doneBlocks += PlaceBlocksOnce;
				}
				player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
			}
		};

		fakepl1.simulateDisconnect();
		fakepl2.simulateDisconnect();
		fakepl3.simulateDisconnect();
		fakepl4.simulateDisconnect();
		fakepl5.simulateDisconnect();
		
		isProcessing = false;

		const endTime = Date.now();
	
		player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
		player.sendMessage(`§d${posblocks[plname]} ${WorldeditLangs.TaskSuccess.cut} (${((endTime - startTime)/1000).toFixed(2)} ${WorldeditLangs.TaskSuccess.usedTime})`);
		console.log(`${plname} Cutted ${posblocks[plname]} Blocks (${((endTime - startTime)/1000).toFixed(2)} seconds)`.magenta);
	}, 500);
}, {
});

command.register("walls", WorldeditLangs.Commands.walls, 1).overload((p, o, op)=> {
	if (o.isServerCommandOrigin()) {
		op.error(WorldeditLangs.Errors.ifConsole)
		return;
	};

	const player = o.getEntity() as ServerPlayer;
	if (!player.isPlayer()) return;

	const plname = player.getNameTag();
	if (typeof posblocks[plname] !== 'number') {
		op.error(WorldeditLangs.Errors.notSettedBothPosition);
		return;
	};

	let highX = Math.max(x2[plname], x1[plname]);
	let highY = Math.max(y2[plname], y1[plname]);
	let highZ = Math.max(z2[plname], z1[plname]);
	let lowX = Math.min(x2[plname], x1[plname]);
	let lowY = Math.min(y2[plname], y1[plname]);
	let lowZ = Math.min(z2[plname], z1[plname]);

	let doneBlocks = 0;

	const Ytotal = highY - lowY;
	const Ztotal = highZ - lowZ;

	let PlaceBlocksOnce = 0;
	let PlaceOnceZ = 1;

	for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
		if (PlaceBlocksOnce + Ytotal > 32767) {
			PlaceOnceZ = i || 1;
			break;
		};
		if (i === Ztotal) {
			PlaceOnceZ = i || 1;
			break;
		};

		PlaceBlocksOnce += Ytotal;
	};

	isProcessing = true;

	const fakepl1 = SimulatedPlayer.create("", Vec3.create({x: lowX, y: highY, z: lowZ}), player.getDimensionId());
	const fakepl2 = SimulatedPlayer.create("", Vec3.create({x: highX, y: highY, z: highZ}), player.getDimensionId());
	const fakepl3 = SimulatedPlayer.create("", Vec3.create({x: lowX, y: highY, z: highZ}), player.getDimensionId());
	const fakepl4 = SimulatedPlayer.create("", Vec3.create({x: highX, y: highY, z: lowZ}), player.getDimensionId());
	const fakepl5 = SimulatedPlayer.create("", Vec3.create({x: (highX+lowX)/2, y: highY, z: (lowZ+highZ)/2}), player.getDimensionId());

	setTimeout(()=> {
		const startTime = Date.now();

		for (let x = lowX; x <= highX; x++) {
			for (let z = lowZ; z <= highZ; z += PlaceOnceZ) {
				if (x === lowX || x === highX || z === lowZ || z === highZ) {
					const endZ = Math.min(z + PlaceOnceZ, highZ);
					const isCeilingOrFloor = (z === lowZ || z === highZ);
					const startY = isCeilingOrFloor ? highY : lowY;
					const endY = isCeilingOrFloor ? highY : lowY;

					player.runCommand(`fill ${x} ${startY} ${z} ${x} ${endY} ${endZ} ${p.block.getName().split(":")[1]} ${p.block_states?.value().value().replace("{", "[").replace("}", "]") || "[]"}`);
					doneBlocks += (endZ - z + 1) * (endY - startY + 1);
					player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
				}
			}
		}

		fakepl1.simulateDisconnect();
		fakepl2.simulateDisconnect();
		fakepl3.simulateDisconnect();
		fakepl4.simulateDisconnect();
		fakepl5.simulateDisconnect();
		
		isProcessing = false;

		const endTime = Date.now();
	
		player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
		player.sendMessage(`§d${doneBlocks} ${WorldeditLangs.TaskSuccess.set} (${((endTime - startTime)/1000).toFixed(2)} ${WorldeditLangs.TaskSuccess.usedTime})`);
		console.log(`${plname} Walled ${doneBlocks} Blocks (${((endTime - startTime)/1000).toFixed(2)} seconds)`.magenta);
	}, 500);
}, {
	block : Command.Block,
	block_states : [JsonValue, true]
});

command.register("replace", WorldeditLangs.Commands.replace, 1).overload((p, o, op)=> {
	if (o.isServerCommandOrigin()) {
		op.error(WorldeditLangs.Errors.ifConsole)
		return;
	};

	const player = o.getEntity() as ServerPlayer;
	if (!player.isPlayer()) return;

	const plname = player.getNameTag();
	if (typeof posblocks[plname] !== 'number') {
		op.error(WorldeditLangs.Errors.notSettedBothPosition);
		return;
	};

	let highX = Math.max(x2[plname], x1[plname]);
	let highY = Math.max(y2[plname], y1[plname]);
	let highZ = Math.max(z2[plname], z1[plname]);
	let lowX = Math.min(x2[plname], x1[plname]);
	let lowY = Math.min(y2[plname], y1[plname]);
	let lowZ = Math.min(z2[plname], z1[plname]);

	let doneBlocks = 0;

	const Ytotal = highY - lowY;
	const Ztotal = highZ - lowZ;

	let PlaceBlocksOnce = 0;
	let PlaceOnceZ = 1;

	for (let i = 0; PlaceBlocksOnce <= 32767; i++) {
		if (PlaceBlocksOnce + Ytotal > 32767) {
			PlaceOnceZ = i || 1;
			break;
		};
		if (i === Ztotal) {
			PlaceOnceZ = i || 1;
			break;
		};

		PlaceBlocksOnce += Ytotal;
	};

	isProcessing = true;

	const fakepl1 = SimulatedPlayer.create("", Vec3.create({x: lowX, y: highY, z: lowZ}), player.getDimensionId());
	const fakepl2 = SimulatedPlayer.create("", Vec3.create({x: highX, y: highY, z: highZ}), player.getDimensionId());
	const fakepl3 = SimulatedPlayer.create("", Vec3.create({x: lowX, y: highY, z: highZ}), player.getDimensionId());
	const fakepl4 = SimulatedPlayer.create("", Vec3.create({x: highX, y: highY, z: lowZ}), player.getDimensionId());
	const fakepl5 = SimulatedPlayer.create("", Vec3.create({x: (highX+lowX)/2, y: highY, z: (lowZ+highZ)/2}), player.getDimensionId());

	setTimeout(()=> {
		const startTime = Date.now();

		for (let x = lowX; x <= highX; x++) {
			for (let z = lowZ; z <= highZ; z += PlaceOnceZ) {
				player.runCommand(`fill ${x} ${highY} ${z} ${x} ${lowY} ${z + PlaceOnceZ <= highZ ? z + PlaceOnceZ : highZ} ${p.block.getName().split(":")[1]} replace ${p.replace_block.getName().split(":")[1]} ${p.replace_block_states || "[]"}`);
				doneBlocks += z + PlaceOnceZ <= highZ ? PlaceBlocksOnce : (highZ - z) * Ytotal;
				player.sendActionbar(`§a[ ${doneBlocks} / ${posblocks[plname]} ]`);
			}
		}
	
		const endTime = Date.now();
		fakepl1.simulateDisconnect();
		fakepl2.simulateDisconnect();
		fakepl3.simulateDisconnect();
		fakepl4.simulateDisconnect();
		fakepl5.simulateDisconnect();

		isProcessing = false;
	
	
		player.sendActionbar(`§a[ ${posblocks[plname]} / ${posblocks[plname]} ]`);
		player.sendMessage(`§d${posblocks[plname]} ${WorldeditLangs.TaskSuccess.replace} (${((endTime - startTime)/1000).toFixed(2)} ${WorldeditLangs.TaskSuccess.usedTime})`);
		console.log(`${plname} Replaced ${posblocks[plname]} Blocks (${((endTime - startTime)/1000).toFixed(2)} seconds)`.magenta);
	}, 500);

}, {
	block: Command.Block,
	replace_block: Command.Block,
	replace_block_states: [JsonValue, true]
});

command.register('up', WorldeditLangs.Commands.up, 1).overload((p, o, op)=> {
	if (o.isServerCommandOrigin()) {
		op.error(WorldeditLangs.Errors.ifConsole)
		return;
	};

	const player = o.getEntity() as ServerPlayer;
	if (!player.isPlayer()) return;

	player.runCommand(`setblock ~ ~${p.blocks - 1} ~ glass`);
	player.runCommand(`tp ~ ~${p.blocks} ~`);
	player.sendMessage("§dWooosh!");	
}, {
	blocks: int32_t
});

command.register('wand', WorldeditLangs.Commands.wand, 1).overload((p, o, op)=> {
	if (o.isServerCommandOrigin()) {
		op.error(WorldeditLangs.Errors.ifConsole)
		return;
	};

	const player = o.getEntity() as ServerPlayer;
	if (!player.isPlayer()) return;

	player.runCommand("give @s wooden_axe 1");
	player.sendMessage(WorldeditLangs.TaskSuccess.wand)
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
export const x1: any = {};
export const x2: any = {};
export const y1: any = {};
export const y2: any = {};
export const z1: any = {};
export const z2: any = {};

const posblocks: any = {};

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


events.blockDestroy.on((ev) => {
	const player = ev.player!;
	const plname = player.getNameTag();
	const blockpos = ev.blockPos;
	const wpname = player.getMainhandSlot().getName();
	if (player.getCommandPermissionLevel() >= 1) {
		if (wpname == "minecraft:wooden_axe") {
			x1[player.getNameTag()] = blockpos.x;
			y1[player.getNameTag()] = blockpos.y;
			z1[player.getNameTag()] = blockpos.z;
			if (x2[player.getNameTag()] !== undefined) {
				let max1 = Math.max(x2[player.getNameTag()], blockpos.x);
				let max2 = Math.max(y2[player.getNameTag()], blockpos.y);
				let max3 = Math.max(z2[player.getNameTag()], blockpos.z);
				const min1 = Math.min(x2[player.getNameTag()], blockpos.x);
				const min2 = Math.min(y2[player.getNameTag()], blockpos.y);
				const min3 = Math.min(z2[player.getNameTag()], blockpos.z);
				max1++;
				max2++;
				max3++;
				posblocks[player.getNameTag()] = (max1 - min1) * (max2 - min2) * (max3 - min3);
				player.sendMessage(`${WorldeditLangs.TaskSuccess.setFirstPos} (${x1[plname]}, ${y1[plname]}, ${z1[plname]}) (${posblocks[plname]})`)
				return CANCEL;
			} else {
				player.sendMessage(`${WorldeditLangs.TaskSuccess.setFirstPos} (${x1[plname]}, ${y1[plname]}, ${z1[plname]})`)
				return CANCEL;
			}
		}
	}

});

/*월엣 우클 감지, 좌클감지*/

events.itemUseOnBlock.on((ev) => {
	const player = ev.actor! as ServerPlayer;
	const plname = player.getNameTag();
	const x = ev.x;
	const y = ev.y;
	const z = ev.z;
	const wpname = ev.itemStack.getName();
	if (player.getCommandPermissionLevel() >= 1) {
		if (wpname == "minecraft:wooden_axe") {
			if (!rclickdelay) {
				x2[player.getNameTag()] = x;
				y2[player.getNameTag()] = y;
				z2[player.getNameTag()] = z;
				if (x1[player.getNameTag()] !== undefined) {
					let max1 = Math.max(x1[player.getNameTag()], x);
					let max2 = Math.max(y1[player.getNameTag()], y);
					let max3 = Math.max(z1[player.getNameTag()], z);
					const min1 = Math.min(x1[player.getNameTag()], x);
					const min2 = Math.min(y1[player.getNameTag()], y);
					const min3 = Math.min(z1[player.getNameTag()], z);
					max1++;
					max2++;
					max3++;
					posblocks[player.getNameTag()] = (max1 - min1) * (max2 - min2) * (max3 - min3);
					player.sendMessage(`${WorldeditLangs.TaskSuccess.setSecondPos} (${x2[plname]}, ${y2[plname]}, ${z2[plname]}) (${posblocks[plname]})`);
					rclickdelay = true;
					setTimeout(function () { rclickdelay = false }, 150);
					return CANCEL;
				} else {
					player.sendMessage(`${WorldeditLangs.TaskSuccess.setSecondPos} (${x2[plname]}, ${y2[plname]}, ${z2[plname]})`)
					rclickdelay = true;
					setTimeout(function () { rclickdelay = false }, 150);
					return CANCEL;
				}
			}
			return CANCEL;
		}
	}
})


// const dllLocation = Path.join(__dirname + '/bdsx-pregen.dll');
// const pregenDll = NativeModule.load(dllLocation);
// const _saveChunk: (source: ChunkSource, chunk: LevelChunk) => boolean = pregenDll.getFunction('testSave', bool_t, null, ChunkSource, LevelChunk);
// //Reffered SacriPudding's Pre-Gen Plugin


console.log(green("[World Edit] Activated!"));

//이 플러그인은 2차수정/배포를 절대 금지합니다