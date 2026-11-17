<div align="center">

# Bank DApp · Lab 6

**เชื่อมกระเป๋าและทำรายการผ่าน MetaMask บน Sepolia**

[![เปิด Lab 6](https://img.shields.io/badge/LAB_6-METAMASK-14634D?style=for-the-badge)](https://namethzz.github.io/bank-dapp-labs/lab-6/) [![ดู Bank บน Sepolia](https://img.shields.io/badge/SEPOLIA-BANK_CONTRACT-43517D?style=for-the-badge)](https://sepolia.etherscan.io/address/0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca)

**ณเมธ วงค์มงคล** · รหัสนักศึกษา `66085327`

[กลับหน้าโปรเจกต์](../README.md) · [ดู Lab 7](../lab-7/README.md)

</div>

## วิธีใช้งาน

1. เปิด [Lab 6](https://namethzz.github.io/bank-dapp-labs/lab-6/) กด **เชื่อม MetaMask** แล้วเลือกบัญชีบน **Sepolia Testnet** ที่มี SepoliaETH สำหรับทดสอบและจ่ายค่า Gas
2. กด **เช็กยอด** เพื่ออ่านยอดของบัญชีในสัญญา Bank
3. กรอกจำนวนเป็น ETH เช่น `0.0001` กด **ฝากเงิน** แล้วยืนยันใน MetaMask
4. กรอกจำนวนภายในยอดฝาก กด **ถอนเงิน** แล้วยืนยันใน MetaMask เมื่อรายการสำเร็จให้ตรวจยอดและเปิด **ดูธุรกรรมใน Explorer** ได้จากหน้าเว็บ

## ผลการทดสอบ

ภาพการทดสอบแสดงว่าเชื่อม MetaMask สำเร็จ ฝากเงินสำเร็จ และหน้าเว็บอ่านยอดในสัญญาหลังฝากได้ **0.0002 ETH**

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

1. เปิด [Remix IDE](https://remix.ethereum.org/) แล้วสร้างไฟล์ `Bank.sol` โดยใช้โค้ดจากไฟล์ที่แนบในโปรเจกต์
2. ไปที่ **Solidity Compiler** เลือก compiler 0.8.x และกด **Compile Bank.sol**
3. เลือกเครือข่าย **Sepolia** ใน MetaMask และเตรียม Sepolia ETH สำหรับค่าธรรมเนียมและทดสอบ  หากยังไม่เห็นเครือข่ายนี้ ให้เปิด **Show test networks** ใน MetaMask (Chain ID: `11155111`)
4. ใน **Deploy & Run Transactions** ตั้ง **Environment** เป็น **Browser Extension** แล้วเลือก MetaMask และสัญญา **Bank** กด **Deploy** และยืนยันใน MetaMask
5. เมื่อสัญญาปรากฏใต้ **Deployed Contracts** ให้คัดลอก Contract Address จากรายการนั้น การ Verify บน Explorer เป็นขั้นเสริมตามโจทย์ที่แนบมา

</details>
