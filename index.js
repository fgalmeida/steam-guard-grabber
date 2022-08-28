const SteamTotp = require("steam-totp");
var fs = require("fs");

// Instance for account
var firstClient = new SteamUser();

// Config
var config = JSON.parse(fs.readFileSync("./config.json"));

var firstLogonOptions = {
  accountName: config.account.username,
  password: config.account.password,
  twoFactorCode: config.account.shared_secret,
};

console.log("----------------------\nAccount: \n%s - Succesfully logged in");
console.log("%s - Account Name", firstLogonOptions.accountName);
console.log("%s - Account Password", firstLogonOptions.password);
console.log(
  "%s - Account Shared Secret\n----------------------",
  firstLogonOptions.twoFactorCode
);
console.log(
  `Steam Guard: \n%s - Steam Guard Code [30 Seconds]\n----------------------`,
  SteamTotp.getAuthCode(config.account.shared_secret)
);
