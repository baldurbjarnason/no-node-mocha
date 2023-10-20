import { blake3 } from "npm:hash-wasm";
export async function grass() {
	const grassHash = await blake3("Grass!");
	return grassHash;
}
