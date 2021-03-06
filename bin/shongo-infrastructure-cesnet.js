/**
 * CESNET infrastructures for Shongo.
 *
 * @author Martin Srom <martin.srom@cesnet.cz>
 */
var common = require('../../../shongo-deployment/bin/shongo-infrastructure-common');

/**
 * Existing room names in CESNET devices.
 */
const EXISTING_ROOM_NAMES = [
    // mcuc.cesnet.cz
    "Akutne","BBMRI-CZ","CC","CEITEC CSR - telekonference","CESNET","CESNET2011","CESNET office","CEZ","Content_test","Datova uloziste","DELLIISS","eduID","EInfrastruktura","ELI","EUAsiaGrid","FEL-Recording","Fond rozvoje","FROV JCU","GN3plus-SAB","Gridy","ICASSP","ICRC","IMETE-ICT","IPv6-wg","Klub reditelu","Mneme","Monitoring a konfigurace","Multimedia","MZK","NEAT-FT","NIDV","NRENPC","OIS","OKaVV","OOaP","Opticke site","PHW 602","Podpora_VaVaI","Pokusna","pokustemppstn","Povros","Predstavenstvo","PSaC","PSaC_Akce","Roadmap","RR","ServiceDesk","Sitova identita","Sitova infrastruktura","Sitove aplikace","Skoda Power","TWAREN","UJV REZ","UPa-IC","VSB-CIT","VSB-IT4I",
    // connect.cesnet.cz
    "aai","antispit","athena","budnik","cerit-sc","cinch","cit-sukb-komenskeho","clarin","cuni-cozp","cuni-lfp-ukbh","cuni-natur","cuni-natur-admiral","cvut-fd-decin","cvut-fel-multimediatech","delliss","egi-eb-private","egi-vt-elixir","ei","elf-dilna","elf-intro","encryption_weak_randomness","entanglement_distillation","eudat","eudml","fedcloud","fykos","gembus","inovacentrum","inovacom","ithanet","levyna","lindat-tech","medigrid","metacentrum","mu-adhoc-a","mu-adhoc-b","mu-adhoc-c","mu-adhoc-d","mu-adhoc-e","mu-ff-cit","mu-ff-kisk-uisk","mu-ff-kniharum","mu-ff-kpi","mu-ff-kpi-seminar","mu-ff-simane","mu-ff-zounek","mu-fsps-kineziologie","mu-ics-oss","mu-lf-adhoc-a","mu-lf-adhoc-b","mu-lf-adhoc-c","mu-lf-adhoc-d","mu-lf-adhoc-e","mu-lf-video","mu-sitmu","mu-ukb-cit","mu-ukb-cit2","mu-ukb-kuk","mu-ukb-video","mu-uvt-ovss","mu-uvt-vedeni","odz","osu","parseme-sc","perun","petrus2","pokus","psac","qkd_weak_randomness","r65127795","radiact","rcna-pilsen","rdc","rebok-konzultace","sa7t5","seminar-iptel","shongo","simultaneous_contract_signing","t2t1","t2t2","talnet-a","talnet-cafe","talnet-i","talnet-kurz-1","talnet-kurz-2","talnet-kurz-3","talnet-kurz-4","talnet-nafta","telovych","telovych2","test","testsem","testsem2","uk-is","uk-is-tutorials","uk-lfp-ovavt","uvt-uk","vienna_group","vsb","vsb-test","vtpup","vut","zcu","zcu-kiv-pd"
];

/**
 * Deployed domains.
 */
const DOMAINS = {
    "meetings": "meetings.cesnet.cz",
    "shongo-dev": "shongo-dev.cesnet.cz"
};

/**
 * @param domain
 * @returns {Array} of resources for given {@code mode}
 */
function getResources(domain, defaultAdministrator) {
    var resources = [];

    // Resource administrators
    var resourceAdministrators = [];
    if (domain == "meetings") {
        resourceAdministrators.push({email: "meetings-announce@cesnet.cz"});
    }
    else if (domain == "shongo-dev") {
        resourceAdministrators.push({userId: 3859}); // srom@cesnet.cz
        resourceAdministrators.push({userId: 13728}); // pavelka@cesnet.cz
    }
    else {
        resourceAdministrators.push(defaultAdministrator);
    }
    // Alias name prefix
    var aliasNamePrefix = common.select(domain, {
        "meetings": "",
        "default": "YY-"
    });
    // Maximum Future
    var maximumFuture = "P2Y";

    // Naming service
    resources.push({
        type: "value",
        name: "namingService",
        description: "Naming service for all technologies",
        allocatable: 1,
        patternPrefix: common.select(domain, {
            "meetings": "ZZ-shongo-",
            "shongo-dev": "shongo-dev-",
            "default": "shongo-local-"
        })
    });

    // Connect
    resources.push({
        type: "connect",
        name: "connect1",
        description: common.select(domain, {
            "meetings": "CESNET Production Adobe Connect",
            "default": "CESNET Testing Adobe Connect"
        }),
        allocatable: 1,
        allocationOrder: 1,
        maximumFuture: maximumFuture,
        agent: common.select(domain, {
            "meetings": "connect1",
            "default": "connect-test"
        }),
        address: common.select(domain, {
            "meetings": "https://connect.cesnet.cz",
            "default": "https://tconn.cesnet.cz"
        }),
        aliases: {
            name: {
                prefix: aliasNamePrefix,
                valueProvider: "namingService"
            }
        },
        licenseCount: common.select(domain, {
            "meetings": 100,
            "default": 20
        }),
        administrators: resourceAdministrators
    });

    // MCU numbers
    resources.push({
        type: "value",
        name: "mcuNumbers",
        description: "Value provider for MCU numbers",
        pattern: common.select(domain, {
            "meetings": "950083[200:399]",
            "shongo-dev": "950083[050:099]",
            "default": "950083[090:099]"
        })
    });

    // MCU1
    resources.push({
        type: "mcu",
        name: "mcu1",
        description: "CESNET Cisco MCU 1",
        allocatable: 1,
        allocationOrder: 1,
        maximumFuture: maximumFuture,
        agent: "mcu1",
        address: "mcuc.cesnet.cz",
        aliases: {
            name: {
                prefix: aliasNamePrefix,
                valueProvider: "namingService"
            },
            number: {
                prefix: "950087",
                valuePattern: common.select(domain, {
                    "meetings": "[200:299]",
                    "shongo-dev": "[050:099]",
                    "default": "[090:099]"
                }),
                domain: "cesnet.cz"
            }
        },
        licenseCount: common.select(domain, {
            "meetings": 15,
            "default": 10
        }),
        administrators: resourceAdministrators
    });

    // MCU2
    resources.push({
        type: "mcu",
        name: "mcu2",
        description: "CESNET Cisco MCU 2",
        allocatable: 1,
        allocationOrder: 2,
        maximumFuture: maximumFuture,
        agent: "mcu2",
        address: "mcuc2.cesnet.cz",
        aliases: {
            name: {
                prefix: aliasNamePrefix,
                valueProvider: "namingService"
            },
            number: {
                valueProvider: "mcuNumbers",
                domain: "cesnet.cz"
            }
        },
        licenseCount: common.select(domain, {
            "meetings": 15,
            "default": 10
        }),
        administrators: resourceAdministrators
    });

    // MCU3
    resources.push({
        type: "mcu",
        name: "mcu3",
        description: "CESNET Cisco MCU 3",
        allocatable: 1,
        allocationOrder: 3,
        maximumFuture: maximumFuture,
        agent: "mcu3",
        address: "mcuc3.cesnet.cz",
        aliases: {
            name: {
                prefix: aliasNamePrefix,
                valueProvider: "namingService"
            },
            number: {
                valueProvider: "mcuNumbers",
                domain: "cesnet.cz"
            }
        },
        licenseCount: common.select(domain, {
            "meetings": 15,
            "default": 10
        }),
        administrators: resourceAdministrators
    });

    // TCS1
    resources.push({
        type: "tcs",
        name: "tcs1",
        allocatable: 1,
        allocationOrder: 2,
        maximumFuture: maximumFuture,
        agent: "tcs1",
        address: "rec1.cesnet.cz",
        licenseCount: common.select(domain, {
            "meetings": 5,
            "default": 2
        }),
        administrators: resourceAdministrators
    });

    // TCS2
    resources.push({
        type: "tcs",
        name: "tcs2",
        allocatable: 1,
        allocationOrder: 1,
        maximumFuture: maximumFuture,
        agent: "tcs2",
        address: "rec2.cesnet.cz",
        licenseCount: common.select(domain, {
            "meetings": 5,
            "default": 2
        }),
        administrators: resourceAdministrators
    });

    return resources;
}

// Start script
console.info("+----------------------------------+");
console.info("| Shongo Infrastructure for CESNET |");
console.info("+----------------------------------+");

// Check first argument and print help if it doesn't exist
if (!common.hasArgument(0)) {
    console.error("usage: " + common.getBin() + " <domain|administrator-email> [<security-token>] [<url>]");
    console.error("\n  <domain> can have the following values:");
    for (var domain in DOMAINS) {
        var domainUrl = DOMAINS[domain];
        console.error("      '" + domain +"' - create infrastructure for " + domainUrl);
    }
    console.error("       other values - create infrastructure for localhost development and the other value");
    console.error("                      will be used as resource administrator email");
    return 1;
}
var debug = false;
if (common.hasArgument(1) && common.getArgument(1) == "--debug") {
    debug = true;
    console.info("Running in " + common.formatColored("DEBUG", common.Color.RED) + " mode...");
}

// Get domain, url, email and resources
var domain = common.getArgument(0);
var token = common.getArgument(1);
var domainUrl = DOMAINS[domain];
var administrator = {email: "pavelka@cesnet.cz"};
var localUrl = common.getArgument(2);

if (domainUrl != null) {
    if (token != null && token.indexOf("--token=") === 0) {
      common.Configuration.controllerToken = token.replace("--token=","");
    }
		else {
	    var retrieveTokenCommand = "ssh " + domainUrl + " -l root \"cat /app/shongo/shongo-deployment/root.access-token\"";
	    common.Configuration.controllerToken = common.exec(retrieveTokenCommand);
		}
    common.Configuration.controllerUrl = domainUrl;
    common.Configuration.controllerSsl = true;
    if (common.Configuration.controllerToken == "") {
        throw "Security token for " + domainUrl + " cannot be retrieved by cmd:\n" + retrieveTokenCommand + "";
    }
    console.log("Using '" + common.Configuration.controllerToken + "' as security token.");
}
else {
    if (domain.substring(0, 5) == "user:") {
        domain = domain.substring(5);
        console.log("Using user '" + domain + "' as resource administrator.");
        administrator = {userId: domain};
    }
    else {
        console.log("Using '" + domain + "' as resource administrator email.");
        administrator = {email: domain};
    }
    domainUrl = "localhost";
    domain = "local"
		if (localUrl != null) {
				domainUrl = localUrl;
		    common.Configuration.controllerUrl = domainUrl;
	      common.Configuration.controllerToken = token;
		    if (common.Configuration.controllerToken == "") {
    		    throw "Security token for " + domainUrl + " cannot be retrieved by cmd:\n" + retrieveTokenCommand + "";
		    }
    		console.log("Using '" + common.Configuration.controllerToken + "' as security token.");
		}
}
var resources = getResources(domain, administrator);

// Print current configuration
console.log("You have selected '" + domain + "' domain.");
console.log("Controller URL is '" + domainUrl + "'.");
console.log("Resources:");
console.log(common.formatResources(resources));
common.waitForKeyPress("Check the configuration and press any key to create or update the infrastructure" +
    (debug ? (" in " + common.formatColored("DEBUG", common.Color.RED) + " mode") : "") + "...");

// Check controller availability
if (!common.execClientCliCommand("status")) {
    console.error("Controller at '" + domainUrl + "' isn't available.");
    return;
}
// Create or update resources
for (var index = 0; index < resources.length; index++) {
    console.log();
    common.mergeResource(resources[index], debug);
}
if (debug) {
    return;
}
// Book values in namingService
console.log();
common.bookValues("namingService", "existing-room-names", EXISTING_ROOM_NAMES);
