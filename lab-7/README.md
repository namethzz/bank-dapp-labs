# Bank DApp · Assignment Lab 7 · Sepolia + Infura

**Bank บน Sepolia:** [`0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca`](https://sepolia.etherscan.io/address/0x9985C32b57B0F2B685Ac85b122BBEB65048C4dca) ตั้งค่าใน `config.js` แล้ว ใช้สัญญานี้ได้เลย ขั้นตอน Deploy ด้านล่างใช้เมื่อต้องการสร้างสัญญาใหม่

เว็บ HTML/CSS/JavaScript สำหรับเชื่อม MetaMask แล้วฝาก ถอน และเช็กยอดกับ Bank Smart Contract ตัวอย่างในสไลด์ Blueprint หน้า 3 โดยเรียก `checkBlance()` ตามชื่อฟังก์ชันในสไลด์ เว็บอ่านยอดและตรวจสัญญาผ่าน Infura JSON-RPC และให้ MetaMask ยืนยันรายการฝากและถอน และใช้ ABI ของฟังก์ชันทั้งสามที่เข้ารหัสไว้ใน `app.js` จึงเปิดใช้งานได้โดยไม่มีขั้นตอน build หรือติดตั้งแพ็กเกจ

## 1. Deploy Smart Contract ใน Remix

ถ้า Deploy สัญญา Bank ตามโจทย์ไว้บน Sepolia แล้ว สามารถใช้ Contract Address เดิมได้

1. เปิด [Remix IDE](https://remix.ethereum.org/) แล้วสร้างไฟล์ `Bank.sol` โดยใช้โค้ดจากไฟล์ที่แนบในโปรเจกต์
2. ไปที่ **Solidity Compiler** เลือก compiler 0.8.x และกด **Compile Bank.sol**
3. เลือกเครือข่าย **Sepolia** ใน MetaMask และเตรียม Sepolia ETH สำหรับค่าธรรมเนียมและทดสอบ  หากยังไม่เห็นเครือข่ายนี้ ให้เปิด **Show test networks** ใน MetaMask (Chain ID: `11155111`)
4. ใน **Deploy & Run Transactions** ตั้ง **Environment** เป็น **Browser Extension** แล้วเลือก MetaMask และสัญญา **Bank** กด **Deploy** และยืนยันใน MetaMask
5. เมื่อสัญญาปรากฏใต้ **Deployed Contracts** ให้คัดลอก Contract Address จากรายการนั้น การ Verify บน Explorer เป็นขั้นเสริมตามโจทย์ที่แนบมา

## 2. ตั้งค่าและทดสอบเว็บ

1. เปิด `config.js` กรอกเลขรหัสนักศึกษาใน `student.id` และตรวจชื่อใน `student.name`
2. วาง Contract Address ใน `bankAddress` โดยใช้ Address ของ Bank ที่ Deploy บน Sepolia
3. ใน VS Code เปิดเทอร์มินัลในโฟลเดอร์โปรเจกต์แล้วใช้ `python -m http.server 8000` จากนั้นเปิด [localhost:8000](http://localhost:8000/) ในเบราว์เซอร์ที่ติดตั้ง MetaMask
4. สร้าง Infura API key ที่เปิดใช้ Ethereum Sepolia จาก [Infura Dashboard](https://app.infura.io/) แล้วกรอก API key หรือ HTTPS Endpoint ในหน้าเว็บ จากนั้นกด **เชื่อม Infura** คีย์จะอยู่ในหน่วยความจำของแท็บและหายเมื่อโหลดหน้าใหม่ ผู้ทดสอบต้องกรอกคีย์เพื่อเชื่อมเอง ใช้ API key ของโปรเจกต์ที่เปิด Ethereum Sepolia ได้ และเก็บ API Secret ไว้นอกหน้าเว็บ
5. ทดสอบการอ่านด้วย Infura โดยกรอกที่อยู่กระเป๋าสาธารณะในช่อง **ที่อยู่กระเป๋าที่ต้องการเช็กยอด** แล้วคลิก **เช็กยอดผ่าน Infura** ระบบอ่าน `checkBlance()` สำหรับที่อยู่นั้นได้โดยไม่ต้องเชื่อม MetaMask
6. กด **เชื่อม MetaMask** แล้วทดสอบฝาก 0.001 ETH เช็กยอด ถอน 0.0005 ETH แล้วเช็กยอดอีกครั้ง ยอดสุดท้ายควรเพิ่มขึ้น 0.0005 ETH จากยอดเดิมในสัญญา

## 3. ส่งงานผ่าน GitHub Pages

1. สร้าง Repository สำหรับ Assignment Lab 7 แล้วอัปโหลดไฟล์จากด้านในโฟลเดอร์ให้ `index.html` อยู่ที่ระดับบนสุดของ branch `main`
2. ใน GitHub ไปที่ **Settings → Pages → Deploy from a branch** เลือก **main** และ **/(root)** แล้วกด **Save**
3. เปิด URL ที่แสดงใน **Settings → Pages** และทดสอบเชื่อม Infura และ MetaMask กับสัญญาบน Sepolia อีกครั้ง ก่อนส่ง URL ใน dlearning

[เอกสาร Remix](https://remix-ide.readthedocs.io/en/latest/run.html) · [คู่มือ GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
