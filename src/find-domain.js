require("dotenv/config");

const { JsonRpcProvider } = require("@ethersproject/providers");
const { multicall } = require("./lib/multical");
const fs = require("fs/promises");

const RPC = process.env.RPC;

const CONTRACT = "0x6d910edfed06d7fa12df252693622920fef7eaa6";

const MULTICALL = "0x41263cBA59EB80dC200F3E2544eda4ed6A90E76C";

const a = (s, e) => [...Array(e - s).keys()].map((c) => s + c);

const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const start = 78000;

const end = 79999;

const getValidDomain = async (provider) => {
  const numbers = a(start, end);

  // const domains = numbers.map((item) => makeid(3).toString());

  const domains = numbers.map((item) => item.toString());

  console.log("domains", domains);

  const calls = domains.map((domain) => {
    return {
      target: CONTRACT,
      signature: "available(string) view returns(bool)",
      params: [domain],
    };
  });
  const validDomains = [];
  const response = await multicall(provider, MULTICALL, calls);
  console.log("response", response);
  response.forEach((item, index) => {
    if (item[0]) {
      validDomains.push(domains[index]);
    }
  });

  console.log(`Find space id domain from ${start} to ${end} number`);

  console.log("Result", validDomains.length);

  if (validDomains.length) {
    await fs.writeFile(
      `./output/${start}-${end}.json`,
      JSON.stringify(validDomains, null, 2)
    );
  }
};

const main = async () => {
  const provider = new JsonRpcProvider(RPC);
  await getValidDomain(provider);
};

main().catch((error) => {
  console.log("error", error);
});
