const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistryBackendHash", function () {
  let LandRegistryBackendHash, landRegistry, owner, landOfficer, user1, user2;
  const zeroAddress = ethers.AddressZero;
  const sampleLandHash = ethers.keccak256(ethers.toUtf8Bytes("Sample Land Data"));

  beforeEach(async function () {
    // Get contract factory and signers
    LandRegistryBackendHash = await ethers.getContractFactory("LandRegistryBackendHash");
    [owner, landOfficer, user1, user2] = await ethers.getSigners();

    // Deploy the contract
    landRegistry = await LandRegistryBackendHash.deploy();
    await landRegistry.waitForDeployment();

    // Assign LAND_OFFICER_ROLE to landOfficer
    await landRegistry.addLandOfficer(landOfficer.address);
  });

  describe("Land Registration", function () {
    it("should allow user to submit a registration request", async function () {
      await expect(landRegistry.connect(user1).submitRegistrationRequest(sampleLandHash))
        .to.emit(landRegistry, "RegistrationRequested")
        .withArgs(1, user1.address, sampleLandHash);

      const request = await landRegistry.registrationRequests(1);
      expect(request.landHash).to.equal(sampleLandHash);
      expect(request.requester).to.equal(user1.address);
      expect(request.approved).to.be.false;
    });

    it("should allow land officer to approve registration request", async function () {
      await landRegistry.connect(user1).submitRegistrationRequest(sampleLandHash);

      await expect(landRegistry.connect(landOfficer).approveRegistrationRequest(1))
        .to.emit(landRegistry, "LandRegistered")
        .withArgs(1, user1.address, sampleLandHash)
        .and.to.emit(landRegistry, "RegistrationApproved")
        .withArgs(1, landOfficer.address);

      const land = await landRegistry.lands(1);
      expect(land.landId).to.equal(1);
      expect(land.owner).to.equal(user1.address);
      expect(land.landHash).to.equal(sampleLandHash);
      expect(land.isVerified).to.be.false;
    });

    it("should revert if non-land officer tries to approve registration", async function () {
      await landRegistry.connect(user1).submitRegistrationRequest(sampleLandHash);
      await expect(
        landRegistry.connect(user2).approveRegistrationRequest(1)
      ).to.be.revertedWithCustomError(landRegistry, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Land Verification", function () {
    beforeEach(async function () {
      await landRegistry.connect(user1).submitRegistrationRequest(sampleLandHash);
      await landRegistry.connect(landOfficer).approveRegistrationRequest(1);
    });

    it("should allow land officer to verify land", async function () {
      await expect(landRegistry.connect(landOfficer).verifyLand(1))
        .to.emit(landRegistry, "LandVerified")
        .withArgs(1, landOfficer.address);

      const land = await landRegistry.lands(1);
      expect(land.isVerified).to.be.true;
    });

    it("should revert if non-land officer tries to verify land", async function () {
      await expect(
        landRegistry.connect(user1).verifyLand(1)
      ).to.be.revertedWithCustomError(landRegistry, "AccessControlUnauthorizedAccount");
    });

    it("should revert if land is already verified", async function () {
      await landRegistry.connect(landOfficer).verifyLand(1);
      await expect(
        landRegistry.connect(landOfficer).verifyLand(1)
      ).to.be.revertedWith("Already verified");
    });
  });

  describe("Land Transfer", function () {
    beforeEach(async function () {
      await landRegistry.connect(user1).submitRegistrationRequest(sampleLandHash);
      await landRegistry.connect(landOfficer).approveRegistrationRequest(1);
      await landRegistry.connect(landOfficer).verifyLand(1);
    });

    it("should allow owner to initiate transfer", async function () {
      await expect(landRegistry.connect(user1).initiateTransfer(1, user2.address))
        .to.emit(landRegistry, "TransferInitiated")
        .withArgs(1, user1.address, user2.address);

      const transfer = await landRegistry.transfers(1);
      expect(transfer.landId).to.equal(1);
      expect(transfer.from).to.equal(user1.address);
      expect(transfer.to).to.equal(user2.address);
      expect(transfer.approved).to.be.false;
    });

    it("should allow land officer to approve transfer", async function () {
      await landRegistry.connect(user1).initiateTransfer(1, user2.address);
      await expect(landRegistry.connect(landOfficer).approveTransfer(1))
        .to.emit(landRegistry, "TransferApproved")
        .withArgs(1, landOfficer.address);

      const transfer = await landRegistry.transfers(1);
      expect(transfer.approved).to.be.true;
    });

    it("should allow recipient to finalize transfer", async function () {
      await landRegistry.connect(user1).initiateTransfer(1, user2.address);
      await landRegistry.connect(landOfficer).approveTransfer(1);

      await expect(landRegistry.connect(user2).finalizeTransfer(1))
        .to.emit(landRegistry, "OwnershipTransferred")
        .withArgs(1, user1.address, user2.address);

      const land = await landRegistry.lands(1);
      expect(land.owner).to.equal(user2.address);

      const history = await landRegistry.getOwnershipHistory(1);
      expect(history.length).to.equal(2);
      expect(history[0]).to.equal(user1.address);
      expect(history[1]).to.equal(user2.address);
    });

    it("should revert if non-recipient tries to finalize transfer", async function () {
      await landRegistry.connect(user1).initiateTransfer(1, user2.address);
      await landRegistry.connect(landOfficer).approveTransfer(1);
      await expect(
        landRegistry.connect(user1).finalizeTransfer(1)
      ).to.be.revertedWith("Only recipient can accept");
    });
  });

  describe("Land Details and Verification", function () {
    beforeEach(async function () {
      await landRegistry.connect(user1).submitRegistrationRequest(sampleLandHash);
      await landRegistry.connect(landOfficer).approveRegistrationRequest(1);
    });

    it("should verify certificate hash", async function () {
      expect(await landRegistry.verifyCertificate(1, sampleLandHash)).to.be.true;
      expect(await landRegistry.verifyCertificate(1, ethers.keccak256(ethers.toUtf8Bytes("Wrong Hash")))).to.be.false;
    });

    it("should return land details", async function () {
      const [ownerAddr, isVerified, landHash] = await landRegistry.getLand(1);
      expect(ownerAddr).to.equal(user1.address);
      expect(isVerified).to.be.false;
      expect(landHash).to.equal(sampleLandHash);
    });

    it("should return ownership history", async function () {
      const history = await landRegistry.getOwnershipHistory(1);
      expect(history.length).to.equal(1);
      expect(history[0]).to.equal(user1.address);
    });
  });

  describe("Access Control", function () {
    it("should allow admin to add land officer", async function () {
      await expect(landRegistry.connect(owner).addLandOfficer(user2.address))
        .to.emit(landRegistry, "RoleGranted")
        .withArgs(
          await landRegistry.LAND_OFFICER_ROLE(),
          user2.address,
          owner.address
        );
    });

    it("should revert if non-admin tries to add land officer", async function () {
      await expect(
        landRegistry.connect(user1).addLandOfficer(user2.address)
      ).to.be.revertedWithCustomError(landRegistry, "AccessControlUnauthorizedAccount");
    });
  });
});