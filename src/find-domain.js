require("dotenv/config");

const { JsonRpcProvider } = require("@ethersproject/providers");
const { multicall } = require("./lib/multical");
const fs = require("fs/promises");

const RPC = process.env.RPC;

const CONTRACT = "0x6d910edfed06d7fa12df252693622920fef7eaa6";

const MULTICALL = "0x41263cBA59EB80dC200F3E2544eda4ed6A90E76C";

export const generateNumber = (s, e) => [...Array(e - s).keys()].map((c) => s + c);

export const randomId = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const START_NUMBER = 1000;

const END_NUMBER = 2000;

const main = async () => {
  const provider = new JsonRpcProvider(RPC);
  const numbers = generateNumber(START_NUMBER, END_NUMBER);

  const domains = numbers.map(() => randomId(3).toString());

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

  console.log(`Find space id domain from ${START_NUMBER} to ${END_NUMBER} number`);

  console.log("Result", validDomains.length);

  if (validDomains.length) {
    await fs.writeFile(
      `./output/${START_NUMBER}-${END_NUMBER}.json`,
      JSON.stringify(validDomains, null, 2)
    );
  }
};

main().catch((error) => {
  console.log("error", error);
});
