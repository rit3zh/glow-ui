import { TOTP } from "totp-generator";

async function getAccessTokenURL() {
  const secretSauce = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const base32FromBytes = (e: Uint8Array) => {
    let t = 0;
    let n = 0;
    let r = "";
    for (let i = 0; i < e.length; i++) {
      n = (n << 8) | e[i];
      t += 8;
      while (t >= 5) {
        r += secretSauce[(n >>> (t - 5)) & 31];
        t -= 5;
      }
    }
    if (t > 0) {
      r += secretSauce[(n << (5 - t)) & 31];
    }
    return r;
  };

  function cleanBuffer(e: string): Uint8Array<ArrayBuffer> {
    e = e.replace(/ /g, "");
    const t = new ArrayBuffer(e.length / 2);
    const n = new Uint8Array(t);
    for (let r = 0; r < e.length; r += 2) {
      n[r / 2] = parseInt(e.substring(r, r + 2), 16);
    }
    return n;
  }

  const secretCipherBytes = [
    12, 56, 76, 33, 88, 44, 88, 33, 78, 78, 11, 66, 22, 22, 55, 69, 54,
  ].map((e, t) => e ^ ((t % 33) + 9));

  const secretBytes = new Uint8Array(
    cleanBuffer(
      Buffer.from(secretCipherBytes.join(""), "utf8").toString("hex")
    ).buffer
  );

  const secret = base32FromBytes(secretBytes);

  const res = await fetch("https://open.spotify.com/server-time").then((e) =>
    e.json()
  );
  const timestamp = res["serverTime"];

  const totp = TOTP.generate(secret, {
    algorithm: "SHA-1",
    digits: 6,
    period: 30,
    timestamp: timestamp * 1000,
  });

  const currentTimestamp = Math.floor(Date.now() / 1000);

  return `https://open.spotify.com/get_access_token?reason=transport&productType=web_player&totp=${totp.otp}&totpVer=5&ts=${currentTimestamp}`;
}

export async function getAccessToken() {
  const tokenURL: string = await getAccessTokenURL();
  const request = await fetch(tokenURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await request.json();

  return {
    accessToken: response["accessToken"],
    expiresIn: response["accessTokenExpirationTimestampMs"],
    clientId: response["clientId"],
  };
}
