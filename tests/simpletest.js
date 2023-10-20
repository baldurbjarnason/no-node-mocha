import { grassy } from "../src/index.js";

const { assert } = chai;

describe("Grass", function () {
	describe("grassy()", function () {
		it("Should return a matching Blake3 hash", async function () {
			const grassyHash = await grassy();
			assert.equal(
				grassyHash,
				"36e3a50e69f24282f97c61b85c6a2a87f407d49b41c7d4771c22e98dafffae5a",
			);
		});
	});
});
