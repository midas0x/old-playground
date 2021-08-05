import hre from "hardhat";
import { expect } from "chai";
import { Artifact } from "hardhat/types";
import { BigNumber } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { TKN } from "../typechain/TKN";
import { Signers } from "../types";

const { deployContract } = hre.waffle;

describe("TKN", () => {
  before(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];

    const supply = 1000;
    const tknArtifact: Artifact = await hre.artifacts.readArtifact("TKN");
    this.tkn = <TKN>await deployContract(this.signers.admin, tknArtifact, [supply]);
  });

  describe("faucet", () => {
    it("should be possible to get TKN tokens from the faucet", async function () {
      const amount = 10;
      // 10 with 18 zeros
      const expected = BigNumber.from("10000000000000000000");

      await this.tkn.faucet(amount);
      expect(await this.tkn.balanceOf(this.signers.admin.address)).to.equal(expected);
    });
  });
});
