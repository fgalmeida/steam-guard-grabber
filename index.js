const SteamTotp = require("steam-totp");
var SteamUser = require("steam-user");
var fs = require("fs");
const ReadLine = require("readline");
const reader = require("readline-sync");
const { exit } = require("process");

var i = 0;

let rl = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Instance for bots
var firstClient = new SteamUser();

// Get Account:
rl.question("Press Enter to Continue...\n", () => {
  var text = fs.readFileSync("./account.txt").toString("utf-8");
  var bot = text.split("\n");
  var firstLogonOptions = {
    accountName: bot[i].split(":")[0],
    password: bot[i].split(":")[1],
    twoFactorCode: SteamTotp.generateAuthCode(bot[i].split(":")[2]),
  };
  getAccount(
    firstLogonOptions.accountName,
    firstLogonOptions.password,
    firstLogonOptions.twoFactorCode
  );
});

function getAccount(accountName, password, twoFactorCode) {
  new Promise((r) => setTimeout(r, 2000));
  doLogin(accountName, password, twoFactorCode);
  logged(twoFactorCode, accountName, password);
}

// Login to the account:
function doLogin(accountName, password, shared) {
  firstClient.logOn({
    accountName: accountName,
    password: password,
    twoFactorCode: shared,
  });
}

// Steam Informations:
function logged(shared, accountName, password, err) {
  firstClient.on("loggedOn", () => {
    (async () => {
      console.log("Account: \n%s - Succesfully logged in", firstClient.steamID);
      console.log("%s - Account Name", accountName);
      console.log("%s - Account Password\n----------------------", password);
      console.log(
        `Steam Guard: \n%s - Steam Guard Code [30 Seconds]\n----------------------`,
        SteamTotp.generateAuthCode(shared)
      );
      await new Promise((r) => setTimeout(r, 2000));
      if (!err) {
        firstClient.logOff();
        console.log(
          "[%s] Succesfully logged off\n----------------------",
          firstClient.steamID
        );
      }
      if (err) {
        console.log("error posting: %s", err);
      }
      await new Promise((r) => setTimeout(r, 10000));
      process.exit();
    })();
  });
}
