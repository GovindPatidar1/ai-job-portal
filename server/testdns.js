const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.sxza1g9.mongodb.net",
  (err, records) => {
    if (err) {
      console.error("DNS ERROR:");
      console.error(err);
    } else {
      console.log("SUCCESS:");
      console.log(records);
    }
  }
);