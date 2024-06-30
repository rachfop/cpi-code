import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { expect } from "chai";
import { Puppet } from "../target/types/puppet";
import { PuppetMaster } from "../target/types/puppet_master";

describe("puppet", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const puppetProgram = anchor.workspace.Puppet as Program<Puppet>;
  const puppetMasterProgram = anchor.workspace
    .PuppetMaster as Program<PuppetMaster>;

  const counterKeypair = Keypair.generate();

  it("Performs CPI to increment counter!", async () => {
    await puppetProgram.methods
      .initialize()
      .accounts({
        counter: counterKeypair.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([counterKeypair])
      .rpc();

    await puppetMasterProgram.methods
      .controlPuppet()
      .accounts({
        puppetProgram: puppetProgram.programId,
        counter: counterKeypair.publicKey,
      })
      .rpc();

    const counterAccount = await puppetProgram.account.counter.fetch(counterKeypair.publicKey);
    expect(counterAccount.value.toNumber()).to.equal(1);
  });
});
