<div align="center">

# Bank DApp
**Assignment Lab 6 และ Lab 7 · Ethereum Sepolia**

เว็บทดลองฝาก ถอน และเช็กยอดเงินในสัญญา Bank

[![เปิด Lab 6](https://img.shields.io/badge/LAB_6-METAMASK-14634D?style=for-the-badge)](https://namethzz.github.io/bank-dapp-labs/lab-6/) [![เปิด Lab 7](https://img.shields.io/badge/LAB_7-INFURA-9D3A21?style=for-the-badge)](https://namethzz.github.io/bank-dapp-labs/lab-7/) [![ดู Bank บน Sepolia](https://img.shields.io/badge/SEPOLIA-BANK_CONTRACT-43517D?style=for-the-badge)](https://sepolia.etherscan.io/address/0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca)

**ณเมธ วงค์มงคล** · รหัสนักศึกษา `66085327`

</div>

## เลือกงานที่ต้องการทดสอบ

| งาน | ช่องทางอ่านยอด | ช่องทางยืนยันฝาก–ถอน | คู่มือ |
| --- | --- | --- | --- |
| **Lab 6 · MetaMask** | MetaMask | MetaMask | [วิธีใช้ Lab 6](./lab-6/README.md) |
| **Lab 7 · Infura** | Infura JSON-RPC | MetaMask | [วิธีใช้ Lab 7](./lab-7/README.md) |

> [!TIP]
> Lab 7 รองรับการเช็กยอดจากที่อยู่กระเป๋าสาธารณะผ่าน Infura โดยไม่ต้องเชื่อม MetaMask

## วิธีใช้งาน

<details>
<summary><strong>Lab 6 · เชื่อม MetaMask และทำรายการ</strong></summary>

1. เปิด [Lab 6](https://namethzz.github.io/bank-dapp-labs/lab-6/) กด **เชื่อม MetaMask** แล้วเลือกบัญชีบน **Sepolia Testnet** ที่มี SepoliaETH สำหรับทดสอบและจ่ายค่า Gas
2. กด **เช็กยอด** เพื่ออ่านยอดของบัญชีในสัญญา Bank
3. กรอกจำนวนเป็น ETH เช่น `0.0001` กด **ฝากเงิน** แล้วยืนยันใน MetaMask
4. กรอกจำนวนภายในยอดฝาก กด **ถอนเงิน** แล้วยืนยันใน MetaMask เมื่อรายการสำเร็จให้ตรวจยอดและเปิด **ดูธุรกรรมใน Explorer** ได้จากหน้าเว็บ

</details>

<details>
<summary><strong>Lab 7 · เชื่อม Infura และอ่านยอด</strong></summary>

1. เปิด [Lab 7](https://namethzz.github.io/bank-dapp-labs/lab-7/) วาง Infura API key หรือ HTTPS Endpoint ของ **Ethereum Sepolia** จาก [Infura Dashboard](https://app.infura.io/) แล้วกด **เชื่อม Infura**
2. สำหรับอ่านยอด ให้วางที่อยู่กระเป๋าสาธารณะแบบเต็ม `0x…` แล้วกด **เช็กยอดผ่าน Infura** ขั้นตอนนี้ใช้ได้โดยไม่ต้องเปิด MetaMask
3. สำหรับฝากหรือถอน ให้เชื่อม MetaMask บน Sepolia กรอกจำนวนเป็น ETH แล้วกดปุ่มและยืนยันรายการในกระเป๋า เว็บจะอ่านยอดใหม่ผ่าน Infura เมื่อธุรกรรมสำเร็จ

</details>

## ผลการทดสอบบน Sepolia

| รายการ | ผลที่ตรวจได้ |
| --- | --- |
| Lab 6 · MetaMask | เชื่อมกระเป๋า ฝากสำเร็จ และแสดงยอดในสัญญาหลังฝาก `0.0002 ETH` |
| Lab 7 · อ่านยอด | อ่านยอดบัญชีผ่าน Infura บน Sepolia สำเร็จ |
| Lab 7 · ฝาก | [`0.0001 SepoliaETH` · Success](https://sepolia.etherscan.io/tx/0xb91f08b5964d3b7480239841d78127fe4c787fdd23a2ff389c8363136de1eefe) |
| Lab 7 · ถอน | [`0.0001 SepoliaETH` · Success](https://sepolia.etherscan.io/tx/0x2173b888c2496201a5aac61af8f041a4cf5cf287be1361a0d1e5ac0f934de9bb) |

## Smart Contract

ทั้งสอง Lab ใช้สัญญา Bank เดียวกัน ยอดในสัญญาจึงตรงกันเมื่อดูจากกระเป๋าบัญชีเดียวกัน

| รายการ | รายละเอียด |
| --- | --- |
| เครือข่าย | Ethereum Sepolia Testnet · Chain ID `11155111` |
| Contract Address | [`0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca`](https://sepolia.etherscan.io/address/0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca) |
| ธุรกรรม Deploy | [ดูบน Sepolia Etherscan](https://sepolia.etherscan.io/tx/0xe04655b7617f38660f952c9ea0cbad014469858589862b831d8f6930cc9ce344) |
| ซอร์ส Solidity | [Bank.sol](./lab-7/Bank.sol) |

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
