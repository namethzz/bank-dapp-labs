# Bank DApp · Assignment Lab 6 และ Lab 7

เว็บธนาคารบน Ethereum Sepolia สำหรับทดลองฝาก ถอน และตรวจสอบยอดเงินในสัญญา Bank ผ่าน MetaMask งาน Lab 7 เพิ่ม Infura เป็นช่องทางอ่านข้อมูลจากบล็อกเชน

**ผู้จัดทำ** ณเมธ วงค์มงคล · รหัสนักศึกษา 66085327

| งาน | การเชื่อมต่อ | เว็บที่เผยแพร่ | ซอร์สโค้ด |
| --- | --- | --- | --- |
| Lab 6 | MetaMask สำหรับอ่านยอดและยืนยันธุรกรรม | [เปิด Lab 6](https://namethzz.github.io/bank-dapp-labs/lab-6/) | [lab-6](./lab-6/) |
| Lab 7 | Infura สำหรับอ่านยอด และ MetaMask สำหรับยืนยันธุรกรรม | [เปิด Lab 7](https://namethzz.github.io/bank-dapp-labs/lab-7/) | [lab-7](./lab-7/) |

## วิธีใช้งาน

### Lab 6 · MetaMask

1. เปิดเว็บ Lab 6 กด **เชื่อม MetaMask** แล้วเลือกบัญชีบน **Sepolia Testnet** ที่มี SepoliaETH สำหรับทดสอบและจ่ายค่า Gas
2. กด **เช็กยอด** เพื่อดูยอดของบัญชีที่เชื่อมไว้ในสัญญา Bank
3. กรอกจำนวนเป็น ETH เช่น `0.0001` แล้วกด **ฝากเงิน** ยืนยันใน MetaMask และรอให้หน้าเว็บแจ้งผล
4. กรอกจำนวนที่ต้องการถอนภายในยอดฝาก แล้วกด **ถอนเงิน** และยืนยันใน MetaMask ตรวจยอดใหม่หรือติดตามรายการจากลิงก์ **ดูธุรกรรมใน Explorer**

### Lab 7 · MetaMask และ Infura

1. เปิดเว็บ Lab 7 แล้วกรอก Infura API key หรือ HTTPS Endpoint ของ **Ethereum Sepolia** จาก [Infura Dashboard](https://app.infura.io/) จากนั้นกด **เชื่อม Infura** เว็บเก็บคีย์ในหน่วยความจำของแท็บระหว่างใช้งาน
2. หากต้องการอ่านยอดอย่างเดียว ให้วางที่อยู่กระเป๋าสาธารณะแบบเต็ม `0x…` แล้วกด **เช็กยอดผ่าน Infura** ขั้นตอนนี้ใช้ได้โดยไม่ต้องเชื่อม MetaMask
3. สำหรับการฝากและถอน ให้เชื่อม MetaMask บน Sepolia แล้วทำรายการแบบเดียวกับ Lab 6 หน้าเว็บจะอ่านยอดของบัญชีผ่าน Infura และแสดงผลใหม่หลังธุรกรรมยืนยัน

> ยอดที่เว็บแสดงคือยอดในสัญญา Bank ของแต่ละบัญชี บัญชีเดียวกันจึงเห็นยอดจากสัญญาเดียวกันทั้งสอง Lab หาก MetaMask แสดงคำเตือนด้านความปลอดภัยขณะเชื่อมหรือยืนยันธุรกรรม ให้ยกเลิกคำขอนั้น

## Smart Contract

| รายการ | รายละเอียด |
| --- | --- |
| เครือข่าย | Ethereum Sepolia Testnet · Chain ID `11155111` |
| Contract Address | [`0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca`](https://sepolia.etherscan.io/address/0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca) |
| ซอร์ส Solidity | [Bank.sol](./lab-7/Bank.sol) |
| ธุรกรรม Deploy | [ดูบน Sepolia Etherscan](https://sepolia.etherscan.io/tx/0xe04655b7617f38660f952c9ea0cbad014469858589862b831d8f6930cc9ce344) |

- `deposit()` รับ ETH ผ่าน `msg.value` และเพิ่มยอดในสัญญาของผู้ฝาก
- `withdraw(uint256 amount)` ตรวจยอดของผู้ถอน แล้วคืน ETH เข้ากระเป๋า
- `checkBlance()` อ่านยอดในสัญญาของที่อยู่ผู้เรียก ชื่อฟังก์ชันสะกดตาม `Bank.sol`

## ผลการทดสอบบน Sepolia

| รายการ | ผลที่ตรวจได้ |
| --- | --- |
| Lab 6 | เชื่อม MetaMask ฝากสำเร็จ และเว็บแสดงยอดในสัญญาหลังฝาก `0.0002 ETH` |
| Lab 7 · อ่านยอด | อ่านยอดบัญชีผ่าน Infura บน Sepolia สำเร็จ |
| Lab 7 · ฝาก | [`0.0001 SepoliaETH` · Success](https://sepolia.etherscan.io/tx/0xb91f08b5964d3b7480239841d78127fe4c787fdd23a2ff389c8363136de1eefe) |
| Lab 7 · ถอน | [`0.0001 SepoliaETH` · Success](https://sepolia.etherscan.io/tx/0x2173b888c2496201a5aac61af8f041a4cf5cf287be1361a0d1e5ac0f934de9bb) |

## รันบนเครื่อง

หน้าเว็บใช้ HTML, CSS และ JavaScript แบบ ES modules พร้อม Solidity สำหรับสัญญา Bank เปิด Terminal ที่โฟลเดอร์โปรเจกต์แล้วรัน

```bash
python -m http.server 8000
```

เปิด [http://localhost:8000/](http://localhost:8000/) แล้วเลือก Lab ที่ต้องการ โปรเจกต์นี้ตั้งค่า Contract Address ของ Sepolia ไว้แล้วใน `config.js` ของทั้งสอง Lab
