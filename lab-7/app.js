import { student, network, bankAddress } from "./config.js";

const ui = Object.fromEntries(
  ["connect", "student-name", "student-id", "balance", "network", "check",
    "wallet", "contract", "amount", "deposit", "withdraw", "status", "transaction-link",
    "infura-form", "infura-key", "infura-connect", "infura-status",
    "lookup-form", "lookup-address", "lookup-submit", "lookup-result"]
    .map((id) => [id, document.getElementById(id)])
);

const injected = window.ethereum;
const wallet = injected?.providers?.find((provider) => provider.isMetaMask) ?? injected;
const configured = /^0x[\da-f]{40}$/i.test(bankAddress) && !/^0x0{40}$/i.test(bankAddress);
const weiPerEth = 10n ** 18n;
const maxUint256 = (1n << 256n) - 1n;

// 4 ไบต์แรกของ Keccak-256 จาก signature ใน Bank.sol
const selectors = {
  deposit: "0xd0e30db0", // deposit()
  withdraw: "0x2e1a7d4d", // withdraw(uint256)
  balance: "0x2a7cc41f", // checkBlance()
};

let account = "";
let chainId = "";
let ready = false;
let pending = false;
let session = 0;
let refreshing = false;
let infuraEndpoint = "";
let connectingInfura = false;
let lookingUpBalance = false;

const infuraOrigin = "https://sepolia.infura.io";

async function infuraRequest(endpoint, method, params = []) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      redirect: "error",
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error("HTTP error");
    const payload = await response.json();
    if (payload.error || !Object.hasOwn(payload, "result")) throw new Error("RPC error");
    return payload.result;
  } catch {
    throw new Error("Infura ตอบกลับไม่สำเร็จ กรุณาตรวจ API key และสิทธิ์ Ethereum Sepolia");
  }
}

async function connectInfura(event) {
  event.preventDefault();
  if (connectingInfura || pending || lookingUpBalance) return;

  const input = ui["infura-key"];
  const feedback = ui["infura-status"];
  const value = input.value.trim();
  const key = value.startsWith(infuraOrigin + "/v3/") ? value.slice(infuraOrigin.length + 4) : value;
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(key)) {
    feedback.textContent = "กรุณากรอก API key หรือ URL ของ Infura สำหรับ Sepolia";
    feedback.dataset.error = "true";
    return;
  }

  connectingInfura = true;
  refreshControls();
  feedback.textContent = "กำลังตรวจการเชื่อมต่อ Infura…";
  feedback.dataset.error = "false";

  try {
    const endpoint = infuraOrigin + "/v3/" + key;
    const chain = await infuraRequest(endpoint, "eth_chainId");
    if (chain !== network.chainId) throw new Error("Infura ต้องเชื่อมต่อ Ethereum Sepolia");
    infuraEndpoint = endpoint;
    input.value = "";
    feedback.textContent = "เชื่อม Infura กับ Ethereum Sepolia แล้ว";
    if (wallet) void syncWallet();
  } catch (error) {
    feedback.dataset.error = "true";
    feedback.textContent = error.message + (infuraEndpoint ? " · ยังใช้การเชื่อมต่อเดิม" : "");
  } finally {
    connectingInfura = false;
    refreshControls();
  }
}

const rpc = (method, params = []) => wallet.request({ method, params });

ui["student-name"].textContent = student.name;
ui["student-id"].textContent = "รหัสนักศึกษา " + (student.id || "—");
ui.network.textContent = network.name + " Testnet";
if (configured) ui.contract.textContent = bankAddress;

function status(message, error = false) {
  ui.status.textContent = message;
  ui.status.dataset.error = String(error);
}

function refreshControls() {
  ui["infura-key"].disabled = connectingInfura || pending || lookingUpBalance;
  ui["infura-connect"].disabled = connectingInfura || pending || lookingUpBalance;
  ui["lookup-submit"].disabled = !configured || !infuraEndpoint || lookingUpBalance || connectingInfura;
  ui["lookup-address"].disabled = lookingUpBalance;
  ui.connect.disabled = !wallet || refreshing || pending || connectingInfura || Boolean(account && chainId === network.chainId);
  ui.connect.textContent = account
    ? (chainId === network.chainId ? "เชื่อมต่อแล้ว" : "สลับไป " + network.name)
    : "เชื่อม MetaMask";
  for (const control of [ui.check, ui.amount, ui.deposit, ui.withdraw]) {
    control.disabled = !ready || pending || connectingInfura;
  }
}

function errorMessage(error) {
  if (Number(error?.code) === 4001) return "คุณยกเลิกคำขอใน MetaMask";
  if (Number(error?.code) === -32002) return "มีคำขอเปิดอยู่ กรุณาตรวจใน MetaMask";
  return error?.message || "ทำรายการไม่สำเร็จ กรุณาลองอีกครั้ง";
}

function parseAmount() {
  const text = ui.amount.value.trim();
  if (!/^(?:\d{1,78}(?:\.\d{0,18})?|\.\d{1,18})$/.test(text)) {
    throw new Error("กรอกจำนวน ETH เป็นตัวเลข (ทศนิยมสูงสุด 18 ตำแหน่ง)");
  }
  const [whole, decimals = ""] = text.split(".");
  const amount = BigInt(whole || "0") * weiPerEth + BigInt(decimals.padEnd(18, "0"));
  if (amount <= 0n || amount > maxUint256) throw new Error("กรุณากรอกจำนวน ETH มากกว่า 0 และอยู่ในช่วงที่รองรับ");
  return amount;
}

function formatAmount(amount) {
  const fraction = (amount % weiPerEth).toString().padStart(18, "0").replace(/0+$/, "");
  return (amount / weiPerEth).toString() + (fraction ? "." + fraction : "");
}

async function balanceOf(address) {
  const result = await infuraRequest(infuraEndpoint, "eth_call", [{ from: address, to: bankAddress, data: selectors.balance }, "latest"]);
  if (!/^0x[\da-f]{64}$/i.test(result)) throw new Error("สัญญาไม่คืนยอดเงิน กรุณาตรวจสอบ Address ของ Bank");
  return BigInt(result);
}

async function lookupBalance(event) {
  event.preventDefault();
  if (!configured || !infuraEndpoint || lookingUpBalance || connectingInfura) return;

  const address = ui["lookup-address"].value.trim();
  const feedback = ui["lookup-result"];
  if (!/^0x[\da-f]{40}$/i.test(address)) {
    feedback.textContent = "กรอกที่อยู่กระเป๋า Ethereum แบบ 0x และตัวเลขฐานสิบหก 40 ตัว";
    feedback.dataset.error = "true";
    return;
  }

  lookingUpBalance = true;
  feedback.dataset.error = "false";
  feedback.textContent = "กำลังอ่านยอดผ่าน Infura…";
  refreshControls();

  try {
    const amount = await balanceOf(address);
    feedback.textContent = `ยอดในสัญญา Bank ของ ${address}: ${formatAmount(amount)} ETH · อ่านผ่าน Infura บน Sepolia`;
  } catch (error) {
    feedback.dataset.error = "true";
    feedback.textContent = errorMessage(error);
  } finally {
    lookingUpBalance = false;
    refreshControls();
  }
}

async function syncWallet() {
  const current = ++session;
  refreshing = true;
  ready = false;
  ui.balance.textContent = "—";
  ui["transaction-link"].hidden = true;
  refreshControls();

  try {
    const [accounts, currentChain] = await Promise.all([rpc("eth_accounts"), rpc("eth_chainId")]);
    if (current !== session) return;
    account = accounts[0] || "";
    chainId = currentChain.toLowerCase();
    ui.wallet.textContent = account || "ยังไม่เชื่อมต่อ";

    if (!account) return status("เชื่อม MetaMask เพื่อเริ่มใช้งาน");
    if (chainId !== network.chainId) return status("กรุณาสลับ MetaMask เป็น " + network.name);
    if (!configured) return status("กรุณาใส่ Contract Address ในไฟล์ config.js");
    if (!infuraEndpoint) return status("เชื่อม Infura เพื่ออ่านยอดและเปิดใช้ปุ่มทำรายการ");

    const code = await infuraRequest(infuraEndpoint, "eth_getCode", [bankAddress, "latest"]);
    if (current !== session) return;
    if (!code || code === "0x") return status("ไม่พบ Smart Contract ที่ Address นี้บน " + network.name, true);

    const amount = await balanceOf(account);
    if (current !== session) return;
    ui.balance.textContent = formatAmount(amount);
    ready = true;
    status("พร้อมทำรายการ");
  } catch (error) {
    if (current === session) status(errorMessage(error), true);
  } finally {
    if (current === session) {
      refreshing = false;
      refreshControls();
    }
  }
}

async function connect() {
  pending = true;
  refreshControls();
  try {
    if (account && chainId !== network.chainId) {
      const chain = { chainId: network.chainId };
      try {
        await rpc("wallet_switchEthereumChain", [chain]);
      } catch (error) {
        if (Number(error?.code) !== 4902) throw error;
        await rpc("wallet_addEthereumChain", [{
          ...chain,
          chainName: network.name + " Testnet",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: [network.rpcUrl],
          blockExplorerUrls: [network.explorer],
        }]);
        if ((await rpc("eth_chainId")).toLowerCase() !== network.chainId) {
          await rpc("wallet_switchEthereumChain", [chain]);
        }
      }
    } else {
      await rpc("eth_requestAccounts");
    }
    await syncWallet();
  } catch (error) {
    status(errorMessage(error), true);
  } finally {
    pending = false;
    refreshControls();
  }
}

async function waitForReceipt(hash, current) {
  for (let attempt = 0; attempt < 90 && current === session; attempt += 1) {
    const receipt = await rpc("eth_getTransactionReceipt", [hash]);
    if (receipt) return receipt;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if (current === session) throw new Error("ยังไม่ได้รับผลยืนยัน กรุณาตรวจสถานะจากลิงก์ธุรกรรม");
}

async function run(action) {
  if (!ready || pending || connectingInfura) return;
  const current = session;
  const address = account;
  pending = true;
  refreshControls();
  ui["transaction-link"].hidden = true;

  try {
    if (action === "check") {
      const amount = await balanceOf(address);
      if (current === session) {
        ui.balance.textContent = formatAmount(amount);
        status("อัปเดตยอดเงินแล้ว");
      }
      return;
    }

    const amount = parseAmount();
    if (action === "withdraw" && amount > await balanceOf(address)) {
      throw new Error("ยอดในสัญญาไม่เพียงพอสำหรับถอน");
    }
    const [accounts, currentChain] = await Promise.all([rpc("eth_accounts"), rpc("eth_chainId")]);
    if (current !== session) return;
    if (accounts[0]?.toLowerCase() !== address.toLowerCase() || currentChain.toLowerCase() !== network.chainId) {
      await syncWallet();
      return;
    }

    const transaction = { from: address, to: bankAddress, data: selectors[action] };
    if (action === "deposit") transaction.value = "0x" + amount.toString(16);
    if (action === "withdraw") transaction.data += amount.toString(16).padStart(64, "0");

    status("กรุณายืนยันธุรกรรมใน MetaMask");
    const hash = await rpc("eth_sendTransaction", [transaction]);
    if (current !== session) return;
    if (/^0x[\da-f]{64}$/i.test(hash)) {
      ui["transaction-link"].href = network.explorer + "/tx/" + hash;
      ui["transaction-link"].hidden = false;
    }
    status("ส่งธุรกรรมแล้ว กำลังรอการยืนยัน");
    const receipt = await waitForReceipt(hash, current);
    if (current !== session) return;
    if (receipt?.status !== "0x1") throw new Error("ธุรกรรมถูกยกเลิกโดยเครือข่าย");

    const message = action === "deposit" ? "ฝากเงินสำเร็จ" : "ถอนเงินสำเร็จ";
    ui.amount.value = "";
    try {
      const updated = await balanceOf(address);
      if (current === session) {
        ui.balance.textContent = formatAmount(updated);
        status(message);
      }
    } catch {
      if (current === session) {
        ui.balance.textContent = "—";
        status(message + " กรุณากดเช็กยอดเพื่ออัปเดต");
      }
    }
  } catch (error) {
    if (current === session) status(errorMessage(error), true);
  } finally {
    pending = false;
    refreshControls();
  }
}

ui["infura-form"].addEventListener("submit", connectInfura);
ui["lookup-form"].addEventListener("submit", lookupBalance);
ui.connect.addEventListener("click", connect);
ui.check.addEventListener("click", () => run("check"));
ui.deposit.addEventListener("click", () => run("deposit"));
ui.withdraw.addEventListener("click", () => run("withdraw"));

if (wallet) {
  wallet.on?.("accountsChanged", syncWallet);
  wallet.on?.("chainChanged", syncWallet);
  wallet.on?.("disconnect", syncWallet);
  syncWallet();
} else {
  status("การฝากและถอนต้องใช้เบราว์เซอร์ที่มี MetaMask");
  refreshControls();
}
