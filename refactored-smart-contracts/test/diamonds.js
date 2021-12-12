const { expect } = require("chai");

const FacetCutAction_ADD = 0;
const FacetCutAction_REPLACE = 1;
const FacetCutAction_REMOVE = 2;

const initialRAIR777Supply = 1000;
const priceToDeploy = 150;

const firstDeploymentAddress = '0x33791c463B145298c575b4409d52c2BcF743BF67';
const secondDeploymentAddress = '0x9472EF1614f103Ae8f714cCeeF4B438D353Ce1Fa';

let usedSelectorsForFactory = {};
let usedSelectorsForMarketplace = {};

// get function selectors from ABI
function getSelectors (contract, usedSelectors) {
	const signatures = Object.keys(contract.interface.functions)
	const selectors = signatures.reduce((acc, val) => {
		if (val !== 'init(bytes)') {
			let selector = contract.interface.getSighash(val);
			if (usedSelectors[selector] !== undefined) {
				//console.log('Function', val, 'already exists on', contract.address)	
				return acc;
			}
			usedSelectors[selector] = {
				address: contract.address,
				name: val,
				selector: selector
			};
			acc.push(selector)
		}
		return acc
	}, [])
	selectors.contract = contract
	selectors.remove = remove
	selectors.get = get
	return selectors
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
function remove (functionNames) {
  const selectors = this.filter((v) => {
	for (const functionName of functionNames) {
	  if (v === this.contract.interface.getSighash(functionName)) {
		return false
	  }
	}
	return true
  })
  selectors.contract = this.contract
  selectors.remove = this.remove
  selectors.get = this.get
  return selectors
}

// used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
function get (functionNames) {
  const selectors = this.filter((v) => {
	for (const functionName of functionNames) {
	  if (v === this.contract.interface.getSighash(functionName)) {
		return true
	  }
	}
	return false
  })
  selectors.contract = this.contract
  selectors.remove = this.remove
  selectors.get = this.get
  return selectors
}

describe("Diamonds", function () {
	let owner, addr1, addr2, addr3, addr4, addrs;

	let FactoryDiamondFactory, factoryDiamondInstance;
	let MarketDiamondFactory, marketDiamondInstance;
	
	let DiamondCutFacetFactory, diamondCutFacetInstance;
	let OwnershipFacetFactory, ownershipFacetInstance;
	let DiamondLoupeFacetFactory, diamondLoupeFacetInstance;

	let ERC777ReceiverFacetFactory, erc777ReceiverFacetInstance;
	let CreatorsFacetFactory, creatorsFacetInstance;
	let TokensFacetFactory, tokensFacetInstance;

	let ERC777Factory, erc777Instance, extraERC777Instance;

	let ERC721FacetFactory, erc721FacetInstance;
	let RAIRMetadataFacetFactory, rairMetadataFacetInstance;
	let RAIRProductFacetFactory, rairProductFacetInstance;
	let RAIRRangesFacetFactory, rairRangesFacetInstance;

	let MintingOffersFacetFactory, mintingOfferFacetsInstance;
	let FeesFacetFactory, feesFacetInstance;
	
	before(async () => {
		[owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();	
		// Nick Mudge's facets
		DiamondCutFacetFactory = await ethers.getContractFactory("DiamondCutFacet");
		OwnershipFacetFactory = await ethers.getContractFactory("OwnershipFacet");
		DiamondLoupeFacetFactory = await ethers.getContractFactory("DiamondLoupeFacet");
		
		// Factory
		FactoryDiamondFactory = await ethers.getContractFactory("FactoryDiamond");
		// Marketplace
		MarketDiamondFactory = await ethers.getContractFactory("MarketplaceDiamond");

		// Factory's facets
		ERC777ReceiverFacetFactory = await ethers.getContractFactory("ERC777ReceiverFacet");
		ERC777Factory = await ethers.getContractFactory("RAIR777");
		CreatorsFacetFactory = await ethers.getContractFactory("creatorFacet");
		TokensFacetFactory = await ethers.getContractFactory("TokensFacet");

		// ERC721's Facets
		ERC721FacetFactory = await ethers.getContractFactory("ERC721Facet");
		RAIRMetadataFacetFactory = await ethers.getContractFactory("RAIRMetadataFacet");
		RAIRProductFacetFactory = await ethers.getContractFactory("RAIRProductFacet");
		RAIRRangesFacetFactory = await ethers.getContractFactory("RAIRRangesFacet");

		// Marketplace's Facets
		MintingOffersFacetFactory = await ethers.getContractFactory("MintingOffersFacet");
		FeesFacetFactory = await ethers.getContractFactory("FeesFacet");
	});

	describe("Deploying external contracts", () => {
		it ("Should deploy two ERC777 contracts", async () => {
			erc777Instance = await ERC777Factory.deploy(initialRAIR777Supply, [addr1.address]);
			extraERC777Instance = await ERC777Factory.deploy(initialRAIR777Supply / 2, [addr2.address]);
			await erc777Instance.deployed();
			await extraERC777Instance.deployed();
		})
	});

	describe("Deploying the Diamond Contract", () => {
		it ("Should deploy the diamondCut facet", async () => {
			diamondCutFacetInstance = await DiamondCutFacetFactory.deploy();
			await diamondCutFacetInstance.deployed();
		});

		it ("Should deploy the base Factory Diamond", async () => {
			factoryDiamondInstance = await FactoryDiamondFactory.deploy(diamondCutFacetInstance.address);
			await factoryDiamondInstance.deployed();
		});

		it ("Should deploy the base Marketplace Diamond", async () => {
			marketDiamondInstance = await MarketDiamondFactory.deploy(diamondCutFacetInstance.address);
			await marketDiamondInstance.deployed();
		});

		it ("Should deploy the Diamond Ownership facet", async () => {
			ownershipFacetInstance = await OwnershipFacetFactory.deploy();
			await ownershipFacetInstance.deployed();
		});

		it ("Should deploy the Diamond Loupe facet", async () => {
			diamondLoupeFacetInstance = await DiamondLoupeFacetFactory.deploy();
			await diamondLoupeFacetInstance.deployed();
		});


		//// Custom Facets

		it ("Should deploy the Creators Facet", async() => {
			creatorsFacetInstance = await CreatorsFacetFactory.deploy();
			await creatorsFacetInstance.deployed();
		});

		it ("Should deploy the ERC777Receiver facet", async () => {
			erc777ReceiverFacetInstance = await ERC777ReceiverFacetFactory.deploy();
			await erc777ReceiverFacetInstance.deployed();
		});

		it ("Should deploy the Creators Facet", async() => {
			tokensFacetInstance = await TokensFacetFactory.deploy();
			await tokensFacetInstance.deployed();
		});

		it ("Should deploy the ERC721 Facet", async () => {
			erc721FacetInstance = await ERC721FacetFactory.deploy();
			await erc721FacetInstance.deployed();
		});

		it ("Should deploy the RAIR Ranges Facet", async () => {
			rairRangesFacetInstance = await RAIRRangesFacetFactory.deploy();
			await rairRangesFacetInstance.deployed();
		});

		it ("Should deploy the RAIR Metadata Facet", async () => {
			rairMetadataFacetInstance = await RAIRMetadataFacetFactory.deploy();
			await rairMetadataFacetInstance.deployed();
		});

		it ("Should deploy the RAIR Product Facet", async () => {
			rairProductFacetInstance = await RAIRProductFacetFactory.deploy();
			await rairProductFacetInstance.deployed();
		});

		// Marketplace Custom Facets
		it ("Should deploy the Market Minting Offers Facet", async () => {
			mintingOfferFacetsInstance = await MintingOffersFacetFactory.deploy();
			await mintingOfferFacetsInstance.deployed();
		});

		it ("Should deploy the Market Minting Offers Facet", async () => {
			feesFacetInstance = await FeesFacetFactory.deploy();
			await feesFacetInstance.deployed();
		});
	});

	describe("Adding facets to the Factory Diamond contract", () => {
		it ("Should add the ownership facet", async () => {
			let diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const ownershipCutItem = {
				facetAddress: ownershipFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(ownershipFacetInstance, usedSelectorsForFactory)
			}
			await expect(await diamondCut.diamondCut([ownershipCutItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");

			// Also add the facet to the Marketplace Diamond
			diamondCut = await ethers.getContractAt('IDiamondCut', marketDiamondInstance.address);
			await expect(await diamondCut.diamondCut([ownershipCutItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
		});

		it ("Should add the Loupe facet", async () => {
			let diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const loupeFacetItem = {
				facetAddress: diamondLoupeFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(diamondLoupeFacetInstance, usedSelectorsForFactory)
			}
			await expect(await diamondCut.diamondCut([loupeFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");

			// Also add the facet to the Marketplace Diamond
			diamondCut = await ethers.getContractAt('IDiamondCut', marketDiamondInstance.address);
			await expect(await diamondCut.diamondCut([loupeFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
		});

		it ("Should add the Tokens facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: creatorsFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(creatorsFacetInstance, usedSelectorsForFactory)
			}
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should add the ERC777 Receiver facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: erc777ReceiverFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(erc777ReceiverFacetInstance, usedSelectorsForFactory)
			}
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should add the Tokens facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: tokensFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(tokensFacetInstance, usedSelectorsForFactory)
			}
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should add the ERC721 facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: erc721FacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(erc721FacetInstance, usedSelectorsForFactory)
			}
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should add the RAIR Metadata facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: rairMetadataFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(rairMetadataFacetInstance, usedSelectorsForFactory)
			}
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should add the RAIR Product facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: rairProductFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(rairProductFacetInstance, usedSelectorsForFactory)
			}
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should add the RAIR Ranges facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: rairRangesFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(rairRangesFacetInstance, usedSelectorsForFactory)
			}
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});
	});

	describe("Adding facets to the Marketplace Diamond contract", () => {
		it ("Should add the Minting Offers facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', marketDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: mintingOfferFacetsInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(mintingOfferFacetsInstance, usedSelectorsForMarketplace)
			}
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});

		it ("Should add the Minting Offers facet", async () => {
			const diamondCut = await ethers.getContractAt('IDiamondCut', marketDiamondInstance.address);
			const receiverFacetItem = {
				facetAddress: feesFacetInstance.address,
				action: FacetCutAction_ADD,
				functionSelectors: getSelectors(feesFacetInstance, usedSelectorsForMarketplace)
			}
			await expect(await diamondCut.diamondCut([receiverFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.emit(diamondCut, "DiamondCut");
				//.withArgs([facetCutItem], ethers.constants.AddressZero, "");
		});
	});


	describe("Modifying facets", () => {
		it ("Shouldn't let other addresses modify the facets", async () => {
			const diamondCut = (await ethers.getContractAt('IDiamondCut', factoryDiamondInstance.address)).connect(addr1);
			const loupeFacetItem = {
				facetAddress: diamondLoupeFacetInstance.address,
				action: FacetCutAction_REPLACE,
				functionSelectors: getSelectors(diamondLoupeFacetInstance, usedSelectorsForFactory)
			}
			await expect(diamondCut.diamondCut([loupeFacetItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')))
				.to.be.revertedWith("LibDiamond: Must be contract owner");
		});

		it ("Should replace facets");
		it ("Should remove facets");
	});

	describe("AccessControl", () => {
		it ("Roles should be set up", async () => {
			await expect(await factoryDiamondInstance.hasRole(await factoryDiamondInstance.OWNER(), owner.address))
				.to.equal(true);
			await expect(await factoryDiamondInstance.hasRole(await factoryDiamondInstance.DEFAULT_ADMIN_ROLE(), owner.address))
				.to.equal(true);
			await expect(await factoryDiamondInstance.getRoleAdmin(await factoryDiamondInstance.OWNER()))
				.to.equal(await factoryDiamondInstance.OWNER());
			await expect(await factoryDiamondInstance.getRoleAdmin(await factoryDiamondInstance.ERC777()))
				.to.equal(await factoryDiamondInstance.OWNER());
		});

		it ("Should grant ERC777 roles", async () => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			await expect(await factoryDiamondInstance.hasRole(await factoryDiamondInstance.DEFAULT_ADMIN_ROLE(), owner.address))
				.to.equal(true);
			await expect(await factoryDiamondInstance.grantRole(await factoryDiamondInstance.ERC777(), addr1.address))
				.to.emit(factoryDiamondInstance, 'RoleGranted')
				.withArgs(await factoryDiamondInstance.ERC777(), addr1.address, owner.address);
			await expect(await factoryDiamondInstance.hasRole(await factoryDiamondInstance.ERC777(), addr1.address))
				.to.equal(true);
		});

		it ("Should properly add an ERC777 token to the Receiver Facet", async () => {
			const tokensFacet = await ethers.getContractAt('TokensFacet', factoryDiamondInstance.address);
			await expect(await tokensFacet.acceptNewToken(erc777Instance.address, priceToDeploy))
				.to.emit(factoryDiamondInstance, 'RoleGranted')
				.withArgs(await factoryDiamondInstance.ERC777(), erc777Instance.address, owner.address)
				.to.emit(tokensFacet, 'NewTokenAccepted')
				.withArgs(erc777Instance.address, priceToDeploy, owner.address);
		});
	});

	describe("Deployment using the ERC777 tokensReceived Function", () => {
		it ("Should return the deployment cost of an ERC777 contract", async () => {
			const tokensFacet = await ethers.getContractAt('TokensFacet', factoryDiamondInstance.address);
			await expect(await tokensFacet.getDeploymentCost(erc777Instance.address))
				.to.equal(priceToDeploy);
			await expect(await tokensFacet.getDeploymentCost(extraERC777Instance.address))
				.to.equal(0);
		})

		it ("Shouldn't be able to execute the tokensReceived function from external addresses", async () => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			expect(receiverFacet.tokensReceived(owner.address, owner.address, factoryDiamondInstance.address, priceToDeploy, ethers.utils.toUtf8Bytes(''),  ethers.utils.toUtf8Bytes('')))
					.to.be.revertedWith(`AccessControl: account ${owner.address.toLowerCase()} is missing role ${await factoryDiamondInstance.ERC777()}`);
		});

		it ("Should not deploy a contract if it receives ERC777 tokens from an unapproved ERC777 contract", async () => {
			await expect(extraERC777Instance.send(factoryDiamondInstance.address, priceToDeploy, ethers.utils.toUtf8Bytes('')))
				.to.be.revertedWith(`AccessControl: account ${extraERC777Instance.address.toLowerCase()} is missing role ${await factoryDiamondInstance.ERC777()}`);
		});

		it ("Should not deploy a contract if it receives less than the required amount", async () => {
			await expect(erc777Instance.send(factoryDiamondInstance.address, priceToDeploy - 1, ethers.utils.toUtf8Bytes('')))
				.to.be.revertedWith(`RAIR Factory: not enough RAIR tokens to deploy a contract`);
		});

		it ("Should deploy a RAIR contract if it receives ERC777 tokens from an approved address", async() => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			await expect(await erc777Instance.send(factoryDiamondInstance.address, priceToDeploy, ethers.utils.toUtf8Bytes('TestRairOne!')))
				//.to.emit(erc777Instance, "Sent")
				//.withArgs(owner.address, owner.address, factoryDiamondInstance.address, priceToDeploy, ethers.utils.toUtf8Bytes('TestRair!'), ethers.utils.toUtf8Bytes(''))
				.to.emit(receiverFacet, 'NewContractDeployed')
				.withArgs(owner.address, 1, firstDeploymentAddress, 'TestRairOne!');
		});

		it ("Should return excess tokens from the deployment", async() => {
			const receiverFacet = await ethers.getContractAt('ERC777ReceiverFacet', factoryDiamondInstance.address);
			await expect(await erc777Instance.send(factoryDiamondInstance.address, priceToDeploy + 5, ethers.utils.toUtf8Bytes('TestRairTwo!')))
				//.to.emit(erc777Instance, "Sent")
				//.withArgs(owner.address, owner.address, factoryDiamondInstance.address, priceToDeploy + 5, ethers.utils.toUtf8Bytes('TestRair!'), ethers.utils.toUtf8Bytes(''))
				//.to.emit(erc777Instance, "Sent")
				//.withArgs(factoryDiamondInstance.address, factoryDiamondInstance.address, owner.address, 5, ethers.utils.toUtf8Bytes('TestRair!'), ethers.utils.toUtf8Bytes(''))
				.to.emit(receiverFacet, 'NewContractDeployed')
				.withArgs(owner.address, 2, secondDeploymentAddress, 'TestRairTwo!');
			await expect(await erc777Instance.balanceOf(owner.address))
				.to.equal(initialRAIR777Supply - (priceToDeploy * 2));
			await expect(await erc777Instance.balanceOf(factoryDiamondInstance.address))
				.to.equal(priceToDeploy * 2);
		});
	});

	describe("Creators Facet", () => {
		it ("Should return the correct amount of creators", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			await expect(await creatorFacet.getCreatorsCount()).to.equal(1);
		});

		it ("Should return the address of the creators", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			await expect(await creatorFacet.getCreatorAtIndex(0))
				.to.equal(owner.address);
		});

		it ("Should return the correct amount of contracts deployed by a creator", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			await expect(await creatorFacet.getContractCountOf(owner.address)).to.equal(2);
		})

		it ("Should return the contracts deployed by a creator individually", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			await expect(await creatorFacet.creatorToContractIndex(owner.address, 0))
				.to.equal(firstDeploymentAddress);
			await expect(await creatorFacet.creatorToContractIndex(owner.address, 1))
				.to.equal(secondDeploymentAddress);
		})
		
		it ("Should return the contracts deployed by a creator in a full list", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			let contracts = await creatorFacet.creatorToContractList(owner.address);
			await expect(contracts[0]).to.equal(firstDeploymentAddress);
			await expect(contracts[1]).to.equal(secondDeploymentAddress);
		});

		it ("Should return the creator of a token deployed", async () => {
			const creatorFacet = await ethers.getContractAt('creatorFacet', factoryDiamondInstance.address);
			await expect(await creatorFacet.contractToCreator(firstDeploymentAddress))
				.to.equal(owner.address);
			await expect(await creatorFacet.contractToCreator(secondDeploymentAddress))
				.to.equal(owner.address);
		});
	});

	describe("Tokens Facet", () => {
		it ("Should display the balance of each approved token", async () => {
			let tokenFacet = await ethers.getContractAt('TokensFacet', factoryDiamondInstance.address);
			await expect(await erc777Instance.balanceOf(tokenFacet.address))
				.to.equal(priceToDeploy * 2); //2 deployments
		});

		it ("Shouldn't let the owners withdraw more than what the address holds", async () => {
			let tokenFacet = await ethers.getContractAt('TokensFacet', factoryDiamondInstance.address);
			await expect(tokenFacet.withdrawTokens(erc777Instance.address, priceToDeploy * 2 + 1))
				.to.be.revertedWith("ERC777: transfer amount exceeds balance");
		});

		it ("Should let the owners withdraw tokens", async () => {
			let tokenFacet = await ethers.getContractAt('TokensFacet', factoryDiamondInstance.address);
			await expect(await tokenFacet.withdrawTokens(erc777Instance.address, priceToDeploy * 2))
				.to.emit(erc777Instance, 'Sent')
				/*.withArgs(
					tokenFacet.address,
					tokenFacet.address,
					owner.address,
					priceToDeploy * 2,
					'Factory Withdraw',
					''
				);*/
		});

		it ("Shouldn't let other addresses add erc777 tokens", async () => {
			const tokensFacet = (await ethers.getContractAt('TokensFacet', factoryDiamondInstance.address)).connect(addr1);
			await expect(tokensFacet.acceptNewToken(extraERC777Instance.address, priceToDeploy))
				.to.be.revertedWith(`AccessControl: account ${addr1.address.toLowerCase()} is missing role ${await factoryDiamondInstance.OWNER()}`);
		});

		it ("Should remove erc777 tokens", async () => {
			const tokensFacet = await ethers.getContractAt('TokensFacet', factoryDiamondInstance.address);
			await expect(await tokensFacet.removeToken(erc777Instance.address))
				.to.emit(factoryDiamondInstance, 'RoleRevoked')
				.withArgs(await factoryDiamondInstance.ERC777(), erc777Instance.address, owner.address)
				.to.emit(tokensFacet, 'TokenNoLongerAccepted')
				.withArgs(erc777Instance.address, owner.address);
		});

		it ("Should let owners grant their role to other addresses", async () => {
			await expect(await factoryDiamondInstance.grantRole(await factoryDiamondInstance.OWNER(), addr1.address))
				.to.emit(factoryDiamondInstance, 'RoleGranted')
				.withArgs(await factoryDiamondInstance.OWNER(), addr1.address, owner.address);
		});

		it ("Should let owners revoke their role to other addresses", async () => {
			await expect(await factoryDiamondInstance.revokeRole(await factoryDiamondInstance.OWNER(), addr1.address))
				.to.emit(factoryDiamondInstance, 'RoleRevoked')
				.withArgs(await factoryDiamondInstance.OWNER(), addr1.address, owner.address);
		});

		it ("Shouldn't let other owners renounce an address' role", async () => {
			await expect(factoryDiamondInstance.renounceRole(await factoryDiamondInstance.OWNER(), addr1.address))
				.to.be.revertedWith("AccessControl: can only renounce roles for self")
		});

		it ("Should let owners renounce their role", async () => {
			await expect(await factoryDiamondInstance.grantRole(await factoryDiamondInstance.OWNER(), addr1.address))
				.to.emit(factoryDiamondInstance, 'RoleGranted')
				.withArgs(await factoryDiamondInstance.OWNER(), addr1.address, owner.address);
			let factoryAsAddress1 = await factoryDiamondInstance.connect(addr1);
			await expect(await factoryAsAddress1.renounceRole(await factoryDiamondInstance.OWNER(), addr1.address))
				.to.emit(factoryDiamondInstance, 'RoleRevoked')
				.withArgs(await factoryDiamondInstance.OWNER(), addr1.address, addr1.address);
			await expect(await factoryAsAddress1.renounceRole(await factoryDiamondInstance.ERC777(), addr1.address))
				.to.emit(factoryDiamondInstance, 'RoleRevoked')
				.withArgs(await factoryDiamondInstance.ERC777(), addr1.address, addr1.address);
		});

		it ("Should return the number of owners in the factory", async () => {
			await expect(await factoryDiamondInstance.getRoleMemberCount(await factoryDiamondInstance.OWNER()))
				.to.equal(1);
		});

		it ("Should return the address of each owners in the factory", async () => {
			await expect(await factoryDiamondInstance.getRoleMember(await factoryDiamondInstance.OWNER(), 0))
				.to.equal(owner.address);
		});
	});

	describe("RAIR ERC721", () => {
		it ("Should have the RAIR symbol", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			await expect(await erc721Facet.symbol())
				.to.equal("RAIR");
			erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.symbol())
				.to.equal("RAIR");
		});

		it ("Should have the user defined name", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			await expect(await erc721Facet.name())
				.to.equal("TestRairOne!");
			erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.name())
				.to.equal("TestRairTwo!");
		});

		it ("Should return the factory's address", async () => {
			let erc721Facet = await ethers.getContractAt('RAIR_ERC721_Diamond', firstDeploymentAddress);
			await expect(await erc721Facet.getFactoryAddress())
				.to.equal(factoryDiamondInstance.address);
			erc721Facet = await ethers.getContractAt('RAIR_ERC721_Diamond', secondDeploymentAddress);
			await expect(await erc721Facet.getFactoryAddress())
				.to.equal(factoryDiamondInstance.address);
		})
	});

	describe("RAIR Metadata Facet", () => {
		it ("Should return the contract's creator address", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			await expect(await erc721Facet.getRoleMember(await erc721Facet.CREATOR(), 0))
				.to.equal(owner.address);
		});
	});

	describe("RAIR Product Facet", () => {
		it ("Should create a product", async () => {
			let productFacet = await ethers.getContractAt('RAIRProductFacet', firstDeploymentAddress);
			await expect(await productFacet.createProduct("FirstFirst", 1000))
				.to.emit(productFacet, 'ProductCreated')
				.withArgs(0, "FirstFirst", 0, 1000);
			await expect(await productFacet.createProduct("FirstSecond", 50))
				.to.emit(productFacet, 'ProductCreated')
				.withArgs(1, "FirstSecond", 1000, 50);

			productFacet = await ethers.getContractAt('RAIRProductFacet', secondDeploymentAddress);
			await expect(await productFacet.createProduct("SecondFirst", 100))
				.to.emit(productFacet, 'ProductCreated')
				.withArgs(0, "SecondFirst", 0, 100);
			await expect(await productFacet.createProduct("SecondSecond", 900))
				.to.emit(productFacet, 'ProductCreated')
				.withArgs(1, "SecondSecond", 100, 900);
		});

		it ("Should show information about the products", async () => {
			let productFacet = await ethers.getContractAt('RAIRProductFacet', firstDeploymentAddress);
			await expect(await productFacet.getProductCount())
				.to.equal(2);
			await expect(await productFacet.mintedTokensInProduct(0))
				.to.equal(0)

			productFacet = await ethers.getContractAt('RAIRProductFacet', secondDeploymentAddress);
			await expect(await productFacet.getProductCount())
				.to.equal(2);
			await expect(await productFacet.mintedTokensInProduct(0))
				.to.equal(0)
			await expect(await productFacet.mintedTokensInProduct(1))
				.to.equal(0)
		})
	});

	describe("RAIR Ranges Facet", () => {
		it ("Should not create offers for invalid products", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', firstDeploymentAddress);
			// createRange(uint productId, uint rangeStart, uint rangeEnd, uint price, uint tokensAllowed, uint lockedTokens, string calldata name)
			await expect(rangesFacet.createRange(2, 0, 10, 1000, 950, 50, 'First First First'))
				.to.be.revertedWith('RAIR ERC721: Product does not exist');
		});

		it ("Shouldn't create ranges with invalid information", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', firstDeploymentAddress);
			await expect(rangesFacet.createRange(0, 10, 0, 1000, 950, 50, 'First First First'))
				.to.be.revertedWith('RAIR ERC721: Invalid starting or ending token');
			await expect(rangesFacet.createRange(0, 0, 10, 1000, 950, 50, 'First First First'))
				.to.be.revertedWith("RAIR ERC721: Allowed tokens should be less than range's length");
			await expect(rangesFacet.createRange(0, 0, 10, 1000, 9, 50, 'First First First'))
				.to.be.revertedWith("RAIR ERC721: Locked tokens should be less than range's length");
		});


		it ("Should create ranges", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', firstDeploymentAddress);
			await expect(await rangesFacet.createRange(0, 0, 10, 1000, 9, 5, 'First First First'))
				.to.emit(rangesFacet, 'CreatedRange')
				.withArgs(0, 0, 10, 1000, 9, 5, 'First First First', 0)
				.to.emit(rangesFacet, 'TradingLocked')
				.withArgs(0, 0, 10, 5);
				//Index, From, To, Tokens to Locked
			await expect(await rangesFacet.createRange(1, 0, 25, 100000, 26, 0, 'First Second First'))
				.to.emit(rangesFacet, 'CreatedRange')
				.withArgs(1, 0, 25, 100000, 26, 0, 'First Second First', 1)
				.to.emit(rangesFacet, 'TradingUnlocked')
				.withArgs(1, 0, 25);
			await expect(await rangesFacet.createRange(1, 26, 49, 200000, 24, 0, 'First Second Second'))
				.to.emit(rangesFacet, 'CreatedRange')
				.withArgs(1, 26, 49, 200000, 24, 0, 'First Second Second', 2)
				.to.emit(rangesFacet, 'TradingUnlocked')
				.withArgs(2, 26, 49);
		});

		it ("Should create offers in batches", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', secondDeploymentAddress);
			await expect(await rangesFacet.createRangeBatch(0, [
				{
					rangeStart: 0,
					rangeEnd: 10,
					price: 2000,
					tokensAllowed: 9 ,
					lockedTokens: 1,
					name: 'Second First First'
				}, {
					rangeStart: 11,
					rangeEnd: 99,
					price: 3500,
					tokensAllowed: 50 ,
					lockedTokens: 10,
					name: 'Second First Second'
				}
			]))
				.to.emit(rangesFacet, 'CreatedRange')
				.withArgs(0, 0, 10, 2000, 9, 1, 'Second First First', 0)
				.to.emit(rangesFacet, 'CreatedRange')
				.withArgs(0, 11, 99, 3500, 50, 10, 'Second First Second', 1)
				.to.emit(rangesFacet, 'TradingLocked')
				.withArgs(0, 0, 10, 1)
				.to.emit(rangesFacet, 'TradingLocked')
				.withArgs(1, 11, 99, 10);

			await expect(await rangesFacet.createRangeBatch(1, [
				{
					rangeStart: 0,
					rangeEnd: 100,
					price: 20000,
					tokensAllowed: 5,
					lockedTokens: 5,
					name: 'Second Second First'
				}, {
					rangeStart: 101,
					rangeEnd: 250,
					price: 35000,
					tokensAllowed: 50 ,
					lockedTokens: 10,
					name: 'Second Second Second'
				}
			]))
				.to.emit(rangesFacet, 'CreatedRange')
				.withArgs(1, 0, 100, 20000, 5, 5, 'Second Second First', 2)
				.to.emit(rangesFacet, 'CreatedRange')
				.withArgs(1, 101, 250, 35000, 50, 10, 'Second Second Second', 3)
				.to.emit(rangesFacet, 'TradingLocked')
				.withArgs(2, 0, 100, 5)
				.to.emit(rangesFacet, 'TradingLocked')
				.withArgs(3, 101, 250, 10);
		});

		it ("Should return the information about the offers", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', firstDeploymentAddress);
			const infoZero = await rangesFacet.rangeInfo(0);
			const infoProductZero = await rangesFacet.productRangeInfo(0,0);
			await expect(infoZero.rangeStart)
				.to.equal(infoProductZero.rangeStart)
				.to.equal(0);
			await expect(infoZero.rangeEnd)
				.to.equal(infoProductZero.rangeEnd)
				.to.equal(10);
			await expect(infoZero.tokensAllowed)
				.to.equal(infoProductZero.tokensAllowed)
				.to.equal(9);
			await expect(infoZero.lockedTokens)
				.to.equal(infoProductZero.lockedTokens)
				.to.equal(5);
			await expect(infoZero.rangePrice)
				.to.equal(infoProductZero.rangePrice)
				.to.equal(1000);
			await expect(infoZero.rangeName)
				.to.equal(infoProductZero.rangeName)
				.to.equal('First First First');

			rangesFacet = await ethers.getContractAt('RAIRRangesFacet', secondDeploymentAddress);
			const secondInfoZero = await rangesFacet.rangeInfo(1);
			const secondInfoProductZero = await rangesFacet.productRangeInfo(0,1);
			await expect(secondInfoZero.rangeStart)
				.to.equal(secondInfoProductZero.rangeStart)
				.to.equal(11);
			await expect(secondInfoZero.rangeEnd)
				.to.equal(secondInfoProductZero.rangeEnd)
				.to.equal(99);
			await expect(secondInfoZero.tokensAllowed)
				.to.equal(secondInfoProductZero.tokensAllowed)
				.to.equal(50);
			await expect(secondInfoZero.lockedTokens)
				.to.equal(secondInfoProductZero.lockedTokens)
				.to.equal(10);
			await expect(secondInfoZero.rangePrice)
				.to.equal(secondInfoProductZero.rangePrice)
				.to.equal(3500);
			await expect(secondInfoZero.rangeName)
				.to.equal(secondInfoProductZero.rangeName)
				.to.equal('Second First Second');
		});

		it ("Should update offers", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', secondDeploymentAddress);
			await expect(await rangesFacet.updateRange(0, 3750, 45, 5))
				.to.emit(rangesFacet, 'UpdatedRange')
				.withArgs(0, 3750, 45, 5);
			const {rangeStart, rangeEnd, tokensAllowed, lockedTokens, rangePrice, rangeName} = await rangesFacet.productRangeInfo(0,0);
			await expect(rangeStart).to.equal(0);
			await expect(rangeEnd).to.equal(10);
			await expect(tokensAllowed).to.equal(45);
			await expect(lockedTokens).to.equal(5);
			await expect(rangePrice).to.equal(3750);
			await expect(rangeName).to.equal('Second First First');
		});

		it ("Should show if a range can be created", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', secondDeploymentAddress);
			await expect(await rangesFacet.canCreateRange(1, 2, 99))
				.to.equal(false);
			await expect(await rangesFacet.canCreateRange(1, 101, 249))
				.to.equal(false);
			await expect(await rangesFacet.canCreateRange(1, 50, 150))
				.to.equal(false);
			await expect(await rangesFacet.canCreateRange(1, 150, 350))
				.to.equal(false);
			await expect(await rangesFacet.canCreateRange(1, 251, 350))
				.to.equal(true);
		});
	});

	describe ("Creator side minting", () => {
		it ("Shouldn't let other addresses mint tokens", async () => {
			let erc721Facet = (await ethers.getContractAt('ERC721Facet', firstDeploymentAddress)).connect(addr1);
			await expect(erc721Facet.mintFromRange(addr2.address, 0, 0))
				.to.be.revertedWith(`AccessControl: account ${addr1.address.toLowerCase()} is missing role ${await erc721Facet.MINTER()}`);
			erc721Facet = (await ethers.getContractAt('ERC721Facet', secondDeploymentAddress)).connect(addr2);
			await expect(erc721Facet.mintFromRange(addr1.address, 1, 3))
				.to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${await erc721Facet.MINTER()}`);
		});

		it ("Shouldn't mint tokens outside of the range's boundaries", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(erc721Facet.mintFromRange(addr3.address, 1, 3))
				.to.be.revertedWith("RAIR ERC721: Invalid token index");
		});

		it ("Should let the creator mint tokens from ranges", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.mintFromRange(addr3.address, 2, 0))
				.to.emit(erc721Facet, 'Transfer')
				.withArgs(ethers.constants.AddressZero, addr3.address, 100);
		});

		it ("Shouldn't mint tokens from invalid ranges", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			await expect(erc721Facet.mintFromRange(addr3.address, 3, 0))
				.to.be.revertedWith("RAIR ERC721: Range does not exist");
		});

		it ("Should return the owner of each token", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.ownerOf(100))
				.to.equal(addr3.address);
		});

		it ("Shouldn't return the owner of a non existant token", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(erc721Facet.ownerOf(101))
				.to.be.revertedWith("ERC721: owner query for nonexistent token");
		});

		it ("Should return the next mintable token of an offer", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.nextMintableTokenInRange(2))
				.to.equal(1);
		});

		it ("Should let a token's owner to approve other addresses to spend tokens", async () => {
			let erc721Facet = (await ethers.getContractAt('ERC721Facet', secondDeploymentAddress)).connect(addr3);
			await expect(await erc721Facet.approve(addr4.address, 100))
				.to.emit(erc721Facet, 'Approval')
				.withArgs(addr3.address, addr4.address, 100);
			await expect(await erc721Facet.getApproved(100))
				.to.equal(addr4.address);
		});

		it ("Should approve all tokens to third parties", async () => {
			let erc721Facet = (await ethers.getContractAt('ERC721Facet', secondDeploymentAddress)).connect(addr3);
			await expect(await erc721Facet.setApprovalForAll(addr1.address, true))
				.to.emit(erc721Facet, 'ApprovalForAll');
			await expect(await erc721Facet.isApprovedForAll(addr3.address, addr1.address))
				.to.equal(true);
		});

		it ("Should translate from standard token index to product index", async () => {
			let productFacet = await ethers.getContractAt('RAIRProductFacet', secondDeploymentAddress);
			await expect(await productFacet.tokenToProductIndex(100))
				.to.equal(0);
		});

		it ("Should translate from product token index to standard index", async () => {
			let productFacet = await ethers.getContractAt('RAIRProductFacet', secondDeploymentAddress);
			await expect(await productFacet.productToToken(1, 0))
				.to.equal(100);
		});

		it ("Should show the total number of tokens minted", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.totalSupply())
				.to.equal(1);
		})

		it ("Should show how many tokens an address holds", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.balanceOf(addr3.address))
				.to.equal(1);
		})

		it ("Should list the tokens owned by an address", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.tokenOfOwnerByIndex(addr3.address, 0))
				.to.equal(100);
		});

		it ("Should list the tokens minted", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.tokenByIndex(0))
				.to.equal(100);
		});

		it ("Should list the tokens minted in each product", async () => {
			let productFacet = await ethers.getContractAt('RAIRProductFacet', secondDeploymentAddress);
			await expect(await productFacet.tokenByProduct(1, 0))
				.to.equal(100);
		});

		it ("Shouldn't list the tokens minted in each product if the product doesn't exist", async () => {
			let productFacet = await ethers.getContractAt('RAIRProductFacet', secondDeploymentAddress);
			await expect(productFacet.tokenByProduct(2, 0))
				.to.be.revertedWith('RAIR ERC721: Product does not exist');
		});

		it ("Should say if an address owns a token inside a product", async () => {
			let productFacet = await ethers.getContractAt('RAIRProductFacet', secondDeploymentAddress);
			await expect(await productFacet.ownsTokenInProduct(addr3.address, 0))
				.to.equal(false);
			await expect(await productFacet.ownsTokenInProduct(addr3.address, 1))
				.to.equal(true);
		});

		it ("Should say if an address owns a token inside a range", async () => {
			let productFacet = await ethers.getContractAt('RAIRProductFacet', secondDeploymentAddress);
			await expect(await productFacet.ownsTokenInRange(addr3.address, 0))
				.to.equal(false);
			await expect(await productFacet.ownsTokenInRange(addr3.address, 1))
				.to.equal(false);
			await expect(await productFacet.ownsTokenInRange(addr3.address, 2))
				.to.equal(true);
		});
	});

	describe ("Minting", () => {
		it ("Should let the creator mint tokens from ranges in batches", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.mintFromRangeBatch(
				[addr1.address, addr2.address, addr3.address],
				2,
				[1, 2, 3]
			))
			.to.emit(erc721Facet, 'Transfer')
			.withArgs(ethers.constants.AddressZero, addr1.address, 101)
			.to.emit(erc721Facet, 'Transfer')
			.withArgs(ethers.constants.AddressZero, addr2.address, 102)
			.to.emit(erc721Facet, 'Transfer')
			.withArgs(ethers.constants.AddressZero, addr3.address, 103);
		});

		it ("Should unlock the product for trading if all tokens are minted", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(await erc721Facet.mintFromRange(addr3.address, 2, 4))
				.to.emit(erc721Facet, 'Transfer')
				.withArgs(ethers.constants.AddressZero, addr3.address, 104)
				.to.emit(erc721Facet, 'TradingUnlocked')
				.withArgs(2, 0, 100);
		});

		it ("Should lock the range again if an update changes the number of locked tokens", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', secondDeploymentAddress);
			// rangeId, price, tokens allowed, tokens locked
			await expect(await rangesFacet.updateRange(2, 20000, 0, 5))
				.to.emit(rangesFacet, 'UpdatedRange')
				.withArgs(2, 20000, 0, 5)
				.to.emit(rangesFacet, 'TradingLocked')
				.withArgs(2, 0, 100, 5);
		});

		it ("Shouldn't mint more tokens if the allowed number is 0", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(erc721Facet.mintFromRange(addr3.address, 2, 5))
				.to.be.revertedWith("RAIR ERC721: Not allowed to mint more tokens from this range!");
		})

		it ("Should emit an event if the entire range is minted", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			const neededTokens = 26;
			await expect(await erc721Facet.mintFromRangeBatch(
				Array.from(Array(neededTokens).keys()).map(item => addr2.address),
				1,
				Array.from(Array(neededTokens).keys()).map((item, index) => index)
			))
				.to.emit(erc721Facet, 'RangeCompleted')
				// Range ID, Product ID
				.withArgs(1, 1);
		});

		it ("Shouldn't mint more tokens if the range is complete", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			await expect(erc721Facet.mintFromRange(addr3.address, 1, 7))
				.to.be.revertedWith("RAIR ERC721: Cannot mint more tokens from this range!");
		})

		it ("Should emit an event if the entire product is minted", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			const neededTokens = 24;
			await expect(await erc721Facet.mintFromRangeBatch(
				Array.from(Array(neededTokens).keys()).map(item => addr2.address),
				2,
				Array.from(Array(neededTokens).keys()).map((item, index) => 26 + index)
			))
				.to.emit(erc721Facet, 'RangeCompleted')
				.withArgs(2, 1)
				.to.emit(erc721Facet, 'ProductCompleted')
				.withArgs(1);
		});

		it ("Shouldn't mint more tokens if the range is complete", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			await expect(erc721Facet.mintFromRange(addr3.address, 1, 7))
				.to.be.revertedWith("RAIR ERC721: Cannot mint more tokens from this product!");
			await expect(erc721Facet.mintFromRange(addr3.address, 2, 27))
				.to.be.revertedWith("RAIR ERC721: Cannot mint more tokens from this product!");
		});
	});

	describe ("Token URI", () => {
		it ("Shouldn't let any non-creator address to modify the metadata", async () => {
			let metadataFacet = (await ethers.getContractAt('RAIRMetadataFacet', secondDeploymentAddress)).connect(addr2);
			await expect(metadataFacet.setContractURI("DEV.RAIR.TECH"))
				.to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${await metadataFacet.CREATOR()}`);
			await expect(metadataFacet.setBaseURI("devs.rairs.techs/"))
				.to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${await metadataFacet.CREATOR()}`);
			await expect(metadataFacet.setProductURI(1, 'first.rair.tech'))
				.to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${await metadataFacet.CREATOR()}`);
			await expect(metadataFacet.setUniqueURI(100, 'hundreth.rair.tech/ASDF'))
				.to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${await metadataFacet.CREATOR()}`);
		});

		it ("Should set the contract's URI", async () => {
			let metadataFacet = await ethers.getContractAt('RAIRMetadataFacet', secondDeploymentAddress);
			await expect(await metadataFacet.setContractURI("DEV.RAIR.TECH"))
				.to.emit(metadataFacet, 'ContractURIChanged')
				.withArgs('DEV.RAIR.TECH');
			await expect(await metadataFacet.contractURI())
				.to.equal('DEV.RAIR.TECH');
		});

		it ("Should set the token's base URI", async () => {
			let metadataFacet = await ethers.getContractAt('RAIRMetadataFacet', secondDeploymentAddress);
			await expect(await metadataFacet.setBaseURI("devs.rairs.techs/"))
				.to.emit(metadataFacet, 'BaseURIChanged')
				.withArgs('devs.rairs.techs/');
			await expect(await metadataFacet.tokenURI(100))
				.to.equal("devs.rairs.techs/100");
		});

		it ("Should set the token's product URI", async () => {
			let metadataFacet = await ethers.getContractAt('RAIRMetadataFacet', secondDeploymentAddress);
			await expect(await metadataFacet.setProductURI(1, 'first.rair.tech/'))
				.to.emit(metadataFacet, 'ProductURIChanged')
				.withArgs(1, 'first.rair.tech/');
			await expect(await metadataFacet.tokenURI(100))
				.to.equal("first.rair.tech/0");
		});

		it ("Should emit the OpenSea event to freeze the metadata", async () => {
			let metadataFacet = await ethers.getContractAt('RAIRMetadataFacet', secondDeploymentAddress);
			await expect(await metadataFacet.freezeMetadata(100))
				.to.emit(metadataFacet, 'PermanentURI');
		});

		it ("Should set the token's unique URI", async () => {
			let metadataFacet = await ethers.getContractAt('RAIRMetadataFacet', secondDeploymentAddress);
			await expect(await metadataFacet.setUniqueURI(100, 'hundreth.rair.tech/ASDF'))
				.to.emit(metadataFacet, 'TokenURIChanged')
				.withArgs(100, 'hundreth.rair.tech/ASDF');
			await expect(await metadataFacet.tokenURI(100))
				.to.equal("hundreth.rair.tech/ASDF");
		});

		it ("Should set the token's unique URI in batches", async () => {
			let metadataFacet = await ethers.getContractAt('RAIRMetadataFacet', secondDeploymentAddress);
			await expect(await metadataFacet.setUniqueURIBatch(
				[101, 102, 103],
				[
					'101.rair.tech/QWERTY',
					'102.rair.tech/QWERTY',
					'103.rair.tech/QWERTY'
				]
			))
				.to.emit(metadataFacet, 'TokenURIChanged')
				.withArgs(101, '101.rair.tech/QWERTY')
				.to.emit(metadataFacet, 'TokenURIChanged')
				.withArgs(102, '102.rair.tech/QWERTY')
				.to.emit(metadataFacet, 'TokenURIChanged')
				.withArgs(103, '103.rair.tech/QWERTY');
			await expect(await metadataFacet.tokenURI(101))
				.to.equal("101.rair.tech/QWERTY");
			await expect(await metadataFacet.tokenURI(102))
				.to.equal("102.rair.tech/QWERTY");
			await expect(await metadataFacet.tokenURI(103))
				.to.equal("103.rair.tech/QWERTY");
		});

		it ("Should delete the URIs", async () => {
			let metadataFacet = await ethers.getContractAt('RAIRMetadataFacet', secondDeploymentAddress);

			await expect(await metadataFacet.tokenURI(100))
				.to.equal("hundreth.rair.tech/ASDF");
			await expect(await metadataFacet.setUniqueURI(100, ''))
				.to.emit(metadataFacet, 'TokenURIChanged')
				.withArgs(100, '');

			await expect(await metadataFacet.tokenURI(100))
				.to.equal("first.rair.tech/0");
			await expect(await metadataFacet.setProductURI(1, ''))
				.to.emit(metadataFacet, 'ProductURIChanged')
				.withArgs(1, '');

			await expect(await metadataFacet.tokenURI(100))
				.to.equal("devs.rairs.techs/100");
			await expect(await metadataFacet.setBaseURI(""))
				.to.emit(metadataFacet, 'BaseURIChanged')
				.withArgs('');

			await expect(await metadataFacet.tokenURI(100))
				.to.equal("");
		})
	});

	describe("NFT Trading", () => {
		it ("Should only let Traders trade tokens", async () => {
			let erc721Facet = (await ethers.getContractAt('ERC721Facet', firstDeploymentAddress)).connect(addr2);
			await expect(erc721Facet['safeTransferFrom(address,address,uint256)'](addr2.address, addr3.address, 1004))
				.to.be.revertedWith(`AccessControl: account ${addr2.address.toLowerCase()} is missing role ${await erc721Facet.TRADER()}`);
			erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
			await expect(await erc721Facet['safeTransferFrom(address,address,uint256)'](addr2.address, addr3.address, 1004))
				.to.emit(erc721Facet, 'Transfer')
				.withArgs(addr2.address, addr3.address, 1004);
		});

		it ("Shouldn't trade tokens if the range is locked", async () => {
			let erc721Facet = await ethers.getContractAt('ERC721Facet', secondDeploymentAddress);
			await expect(erc721Facet['safeTransferFrom(address,address,uint256)'](addr3.address, addr2.address, 100))
				.to.be.revertedWith("RAIR ERC721: Cannot transfer from a locked range!");
		});

		it ("Should say if a range is locked", async () => {
			let rangesFacet = await ethers.getContractAt('RAIRRangesFacet', firstDeploymentAddress);
			await expect(await rangesFacet.isRangeLocked(0))
				.to.equal(true);
			await expect(await rangesFacet.isRangeLocked(1))
				.to.equal(false);
			await expect(await rangesFacet.isRangeLocked(2))
				.to.equal(false);
			rangesFacet = await ethers.getContractAt('RAIRRangesFacet', secondDeploymentAddress);
			await expect(await rangesFacet.isRangeLocked(0))
				.to.equal(true);
			await expect(await rangesFacet.isRangeLocked(1))
				.to.equal(true);
			await expect(await rangesFacet.isRangeLocked(2))
				.to.equal(true);
			await expect(await rangesFacet.isRangeLocked(3))
				.to.equal(true);
		});
	});

	describe("Minter Marketplace", () => {
		describe("Fee Setup", () => {
			it ("Should display decimal information", async () => {
				let feesFacet = await ethers.getContractAt('FeesFacet', marketDiamondInstance.address);
				await expect(await feesFacet.getDecimals())
					.to.equal(3);
			});

			it ("Should have no treasury address right after deployment", async () => {
				let feesFacet = await ethers.getContractAt('FeesFacet', marketDiamondInstance.address);
				await expect(await feesFacet.getTreasuryAddress())
					.to.equal(ethers.constants.AddressZero);
			});

			it ("Should update the treasury address", async () => {
				let feesFacet = await ethers.getContractAt('FeesFacet', marketDiamondInstance.address);
				await expect(await feesFacet.updateTreasuryAddress(addr4.address))
					.to.emit(feesFacet, 'UpdatedTreasuryAddress')
					.withArgs(addr4.address);
				await expect(await feesFacet.getTreasuryAddress())
					.to.equal(addr4.address);
			});

			it ("Should have the default 1% node fee", async () => {
				let feesFacet = await ethers.getContractAt('FeesFacet', marketDiamondInstance.address);
				let response = await feesFacet.getNodeFee()
				await expect(response.decimals)
					.to.equal(3);
				await expect(response.nodeFee)
					.to.equal(1000);
			});

			it ("Should have the default 1% node fee", async () => {
				let feesFacet = await ethers.getContractAt('FeesFacet', marketDiamondInstance.address);
				let response = await feesFacet.getTreasuryFee()
				await expect(response.decimals)
					.to.equal(3);
				await expect(response.treasuryFee)
					.to.equal(9000);
			});
		});
		
		describe("Validation for Minting Offers", () => {
			it ("Shouldn't add offers without the marketplace as a Minter", async () => {
				let mintingOffersFacet = await ethers.getContractAt('MintingOffersFacet', marketDiamondInstance.address);
				await expect(mintingOffersFacet.addMintingOffer(firstDeploymentAddress, 2, [
					{recipient: addr1.address, percentage: 30000},
					{recipient: addr2.address, percentage: 60000}
				], true, addr4.address))
					.to.be.revertedWith("Minter Marketplace: This Marketplace isn't a Minter!");
			});

			it ("Should be granted the Minter role from the ERC721 Instance", async () => {
				let erc721Facet = await ethers.getContractAt('ERC721Facet', firstDeploymentAddress);
				await expect(await erc721Facet.grantRole(await erc721Facet.MINTER(), marketDiamondInstance.address))
					.to.emit(erc721Facet, 'RoleGranted')
					.withArgs(await erc721Facet.MINTER(), marketDiamondInstance.address, owner.address);
			});

			it ("Shouldn't add offers from other addresses", async () => {
				let mintingOffersFacet = (await ethers.getContractAt('MintingOffersFacet', marketDiamondInstance.address)).connect(addr4);
				await expect(mintingOffersFacet.addMintingOffer(firstDeploymentAddress, 2, [
					{recipient: addr1.address, percentage: 30000},
					{recipient: addr2.address, percentage: 60000}
				], true, addr4.address))
					.to.be.revertedWith("Minter Marketplace: Sender isn't the creator of the contract!");
			});

			it ("Shouldn't add an offer if the percentages don't add up to a 100%", async () => {
				let mintingOffersFacet = await ethers.getContractAt('MintingOffersFacet', marketDiamondInstance.address);
				await expect(mintingOffersFacet.addMintingOffer(firstDeploymentAddress, 2, [
					{recipient: addr1.address, percentage: 29999},
					{recipient: addr2.address, percentage: 60000}
				], true, addr4.address))
					.to.be.revertedWith("Minter Marketplace: Fees don't add up to 100%");
			});
		});

		describe("Adding Products and Minting", () => {
			it ("Shouldn't set up custom payment rates if the offer doesn't exist (Part 1 - The first offer)");
			it ("Shouldn't add a number of tokens higher than the mintable limit");
			it ("Shouldn't add a range with wrong lengths");
			it ("Should revert if info is asked for non-existant offers");
			it ("Should add an offer");
			it ("Shouldn't add an offer for the same product and contract");
			it ("Should revert if info is asked for a non-existant product offer");
			it ("Should give info about the offers");
			it ("Should add another offer for the same contract + A range with a single token");
			it ("Should append a range to an existing offer");
			it ("Should append a batch of ranges to an existing offer");
			it ("Should mint with permissions");
			it ("Should create a new offer (Used on the custom payment rate)");
			it ("Shouldn't batch mint with wrong info");
			it ("Should batch mint");
			it ("Shouldn't mint without permissions");
			it ("Shouldn't mint past the allowed number of tokens");
		});

		describe("Updating Products", () => {
			it ("Shouldn't let the creator update the collection info limits with wrong info");
			it ("Should let the creator update the collection info limits");
			it ("Shouldn't mint out of bounds");
			it ("Should mint specific tokens");
			it ("Shouldn't mint if the collection is completely minted");
			it ("Shouldn't set up custom payment rates if the percentages don't add up to 100%");
			it ("Shouldn't set up custom payment rates if the offer doesn't exist");
			it ("Should set up custom payment rates");
			it ("Should do a custom payment split (Single)");
		});
	});

	describe("Loupe Facet", () => {
		it ("Should show all facets", async () => {
			const loupeFacet = await ethers.getContractAt('DiamondLoupeFacet', factoryDiamondInstance.address);
		})
	});
})
