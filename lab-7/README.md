<div align="center">

# Bank DApp · Lab 7

**อ่านยอดผ่าน Infura และยืนยันธุรกรรมผ่าน MetaMask บน Sepolia**

[![เปิด Lab 7](https://img.shields.io/badge/LAB_7-INFURA-9D3A21?style=for-the-badge)](https://namethzz.github.io/bank-dapp-labs/lab-7/) [![ดู Bank บน Sepolia](https://img.shields.io/badge/SEPOLIA-BANK_CONTRACT-43517D?style=for-the-badge)](https://sepolia.etherscan.io/address/0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca)

**ณเมธ วงค์มงคล** · รหัสนักศึกษา `66085327`

[กลับหน้าโปรเจกต์](../README.md) · [ดู Lab 6](../lab-6/README.md)

</div>

## วิธีใช้งาน

1. เปิด [Lab 7](https://namethzz.github.io/bank-dapp-labs/lab-7/) วาง Infura API key หรือ HTTPS Endpoint ของ **Ethereum Sepolia** จาก [Infura Dashboard](https://app.infura.io/) แล้วกด **เชื่อม Infura**
2. สำหรับอ่านยอด ให้วางที่อยู่กระเป๋าสาธารณะแบบเต็ม `0x…` แล้วกด **เช็กยอดผ่าน Infura** ขั้นตอนนี้ใช้ได้โดยไม่ต้องเปิด MetaMask
3. สำหรับฝากหรือถอน ให้เชื่อม MetaMask บน Sepolia กรอกจำนวนเป็น ETH แล้วกดปุ่มและยืนยันรายการในกระเป๋า เว็บจะอ่านยอดใหม่ผ่าน Infura เมื่อธุรกรรมสำเร็จ

> [!NOTE]
> Infura API key อยู่ในหน่วยความจำของแท็บและหายเมื่อโหลดหน้าใหม่ เก็บ API Secret ไว้ในบัญชี Infura

## ผลการทดสอบ

ทดสอบอ่านยอดด้วย Infura บน Sepolia สำเร็จ และตรวจหลักฐานธุรกรรมจาก Etherscan ได้ตามรายการนี้

| รายการ | หลักฐาน |
| --- | --- |
| ฝาก 0.0001 SepoliaETH | [Success](https://sepolia.etherscan.io/tx/0xb91f08b5964d3b7480239841d78127fe4c787fdd23a2ff389c8363136de1eefe) |
| ถอน 0.0001 SepoliaETH | [Success](https://sepolia.etherscan.io/tx/0x2173b888c2496201a5aac61af8f041a4cf5cf287be1361a0d1e5ac0f934de9bb) |

## Smart Contract

| รายการ | รายละเอียด |
| --- | --- |
| เครือข่าย | Ethereum Sepolia Testnet · Chain ID `11155111` |
| Contract Address | [`0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca`](https://sepolia.etherscan.io/address/0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca) |
| ธุรกรรม Deploy | [ดูบน Sepolia Etherscan](https://sepolia.etherscan.io/tx/0xe04655b7617f38660f952c9ea0cbad014469858589862b831d8f6930cc9ce344) |
| ซอร์ส Solidity | [Bank.sol](./Bank.sol) |
| ตั้งค่าเว็บ | [config.js](./config.js) |

| ฟังก์ชัน | การทำงาน |
| --- | --- |
| `deposit()` | รับ ETH ผ่าน `msg.value` และเพิ่มยอดของผู้ฝาก |
| `withdraw(uint256 amount)` | ตรวจยอดของผู้ถอนแล้วโอน ETH คืนเข้ากระเป๋า |
| `checkBlance()` | อ่านยอดในสัญญาของที่อยู่ผู้เรียก ใช้ชื่อฟังก์ชันตามซอร์ส Solidity |

## รันบนเครื่อง

โปรเจกต์ใช้ HTML, CSS และ JavaScript แบบ ES modules เปิด Terminal ที่โฟลเดอร์หลักของรีโปแล้วรัน

```bash
python -m http.server 8000
```

เปิด [http://localhost:8000/](http://localhost:8000/) แล้วเลือก Lab ที่ต้องการ ทั้งสอง Lab ตั้งค่า Contract Address ของ Sepolia ไว้แล้วใน `config.js` ส่วนเว็บ GitHub Pages เผยแพร่จาก branch `main` ที่โฟลเดอร์ `/(root)`

<details>
<summary><strong>Deploy สัญญาใหม่ด้วย Remix</strong></summary>

ถ้า Deploy สัญญา Bank ตามโจทย์ไว้บน Sepolia แล้ว สามารถใช้ Contract Address เดิมได้

1. เปิด [Remix IDE](https://remix.ethereum.org/) แล้วสร้างไฟล์ `Bank.sol` โดยใช้โค้ดจากไฟล์ที่แนบในโปรเจกต์
2. ไปที่ **Solidity Compiler** เลือก compiler 0.8.x และกด **Compile Bank.sol**
3. เลือกเครือข่าย **Sepolia** ใน MetaMask และเตรียม Sepolia ETH สำหรับค่าธรรมเนียมและทดสอบ  หากยังไม่เห็นเครือข่ายนี้ ให้เปิด **Show test networks** ใน MetaMask (Chain ID: `11155111`)
4. ใน **Deploy & Run Transactions** ตั้ง **Environment** เป็น **Browser Extension** แล้วเลือก MetaMask และสัญญา **Bank** กด **Deploy** และยืนยันใน MetaMask
5. เมื่อสัญญาปรากฏใต้ **Deployed Contracts** ให้คัดลอก Contract Address จากรายการนั้น การ Verify บน Explorer เป็นขั้นเสริมตามโจทย์ที่แนบมา

</details>
