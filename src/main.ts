import { ErrorMapper } from "utils/ErrorMapper";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */

  // Memory extension samples
  interface Memory {
    sourceMap: { [sourceID: string]: Source };
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current tick is ${Game.time}`);
  if (Game.time % 1000 === 0) {
    // 刷新缓存能量源
    Memory.sourceMap = {};
    for (const roomName in Game.rooms) {
      Game.rooms[roomName].find(FIND_SOURCES).forEach(source => {
        Memory.sourceMap[source.id] = source;
        console.log("重新缓存能量源对象：" + JSON.stringify(source));
      });
    }
  }
  // 删除无效creep缓存
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
      console.log("删除无效creep缓存：" + name);
    }
  }
});
