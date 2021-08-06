import hre from "hardhat";
import { expect } from "chai";
import { Artifact } from "hardhat/types";
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { TKN } from "../typechain/TKN";
import { WTKN } from "../typechain/WTKN";
import { Signers } from "../types";

const { deployContract } = hre.waffle;

describe("WTKN", () => {
  beforeEach(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.alice = signers[1];

    const supply = 1000;
    const tknArtifact: Artifact = await hre.artifacts.readArtifact("TKN");
    this.tkn = <TKN>await deployContract(this.signers.admin, tknArtifact, [supply]);

    const wtknArtifact: Artifact = await hre.artifacts.readArtifact("WTKN");
    this.wtkn = <WTKN>await deployContract(this.signers.admin, wtknArtifact, [this.tkn.address]);
  });

  describe("wrap / unwrap", () => {
    beforeEach(async function () {
      await this.tkn.connect(this.signers.alice).faucet(10);
    });

    it("should be possible to wrap the token", async function () {
      // 10 with 18 zeros
      const amount = BigNumber.from("10000000000000000000");

      await this.tkn.connect(this.signers.alice).approve(this.wtkn.address, amount);
      await this.wtkn.connect(this.signers.alice).depositFor(this.signers.alice.address, amount);

      expect(await this.tkn.balanceOf(this.signers.alice.address)).to.equal(0);
      expect(await this.wtkn.balanceOf(this.signers.alice.address)).to.equal(amount);
    });

    it("should be possible to unwrap the token", async function () {
      // 10 with 18 zeros
      const amount = BigNumber.from("10000000000000000000");

      await this.tkn.connect(this.signers.alice).approve(this.wtkn.address, amount);
      await this.wtkn.connect(this.signers.alice).depositFor(this.signers.alice.address, amount);
      await this.wtkn.connect(this.signers.alice).withdrawTo(this.signers.alice.address, amount);

      expect(await this.tkn.balanceOf(this.signers.alice.address)).to.equal(amount);
      expect(await this.wtkn.balanceOf(this.signers.alice.address)).to.equal(0);
    });
  });
});
