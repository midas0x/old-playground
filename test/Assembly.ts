import hre from "hardhat";
import { expect } from "chai";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { Assembly } from "../typechain/Assembly";
import { Signers } from "../types";

const { deployContract } = hre.waffle;

describe("Assembly", () => {
  beforeEach(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];

    const assemblyArtifact: Artifact = await hre.artifacts.readArtifact("Assembly");
    this.assembly = <Assembly>await deployContract(this.signers.admin, assemblyArtifact);
  });

  describe("main", () => {
    it("should work", async function () {
      expect(await this.assembly.main()).to.equal(25);
    });
  });
});
