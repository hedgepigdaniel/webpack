/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

class EnsureChunkConditionsPlugin {

	apply(compiler) {
		compiler.plugin("compilation", (compilation) => {
			compilation.plugin(["optimize-chunks-basic", "optimize-extracted-chunks-basic"], (chunks) => {
				let changed = false;
				chunks.forEach((chunk) => {
					chunk.forEachModule((module) => {
						if(!module.chunkCondition) return;
						if(!module.chunkCondition(chunk)) {
							const usedChunks = module._EnsureChunkConditionsPlugin_usedChunks = (module._EnsureChunkConditionsPlugin_usedChunks || []).concat(chunk);
							const newChunks = [];
							chunk.parents.forEach((parent) => {
								if(usedChunks.indexOf(parent) < 0) {
									parent.addModule(module);
									newChunks.push(parent);
								}
							});
							module.rewriteChunkInReasons(chunk, newChunks);
							chunk.removeModule(module);
							changed = true;
						}
					});
				});
				if(changed) return true;
			});
		});
	}
}
module.exports = EnsureChunkConditionsPlugin;
