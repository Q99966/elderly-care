// // src/utils/serial.js

// export class SerialManager {
//     constructor() {
//       this.port = null;
//       this.reader = null;
//       this.keepReading = true;
//     }
  
//     // 1. 请求并打开串口
//     async connect(baudRate = 9600) {
//       try {
//         // 💡 虽然不能强制静默连接，但可以引导用户
//         console.log("请在弹窗中选择: JL_SPP (COM7)");
        
//         // 请求端口
//         this.port = await navigator.serial.requestPort();
        
//         // 检查是否已经是打开状态
//         if (this.port.writable) {
//           console.warn("该端口已在连接中");
//           return true;
//         }
    
//         await this.port.open({ 
//           baudRate: baudRate,
//           dataBits: 8,
//           stopBits: 1,
//           parity: 'none',
//           flowControl: 'none' // 蓝牙串口务必设为 none 避免断连
//         });
    
//         // 打印获取到的端口信息（调试用）
//         const info = this.port.getInfo();
//         console.log("已成功连接到设备信息:", info);
        
//         return true;
//       } catch (error) {
//         console.error("连接失败:", error);
//         return false;
//       }
//     }
//     // 2. 开始读取数据
//     async startReading(onDataReceived) {
//       this.keepReading = true;
//       while (this.port.readable && this.keepReading) {
//         const decoder = new TextDecoderStream('utf-8'); // 指定 UTF-8 格式
//         const inputDone = this.port.readable.pipeTo(decoder.writable);
//         const inputStream = decoder.readable;
//         this.reader = inputStream.getReader();
  
//         try {
//           while (true) {
//             const { value, done } = await this.reader.read();
//             if (done) break;
//             if (value) {
//               onDataReceived(value); // 将解析出的 UTF-8 字符串传回 UI 层
//             }
//           }
//         } catch (error) {
//           console.error("读取错误:", error);
//         } finally {
//           this.reader.releaseLock();
//         }
//       }
//     }
  
//     // 3. 断开连接
//     async disconnect() {
//       this.keepReading = false;
//       if (this.reader) {
//         await this.reader.cancel();
//       }
//       if (this.port) {
//         await this.port.close();
//       }
//       this.port = null;
//     }
//   }

// src/utils/serial.js

export class SerialManager {
  constructor() {
    this.port = null;
    this.reader = null;
    this.keepReading = true;
  }

  // 1. 请求并打开串口
  async connect(baudRate = 115200) { // 默认改为你硬件匹配的 115200
    try {
      this.port = await navigator.serial.requestPort();
      
      await this.port.open({ 
        baudRate: baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none' 
      });

      console.log("✅ 串口连接成功，波特率:", baudRate);
      return true;
    } catch (error) {
      console.error("❌ 连接失败:", error);
      return false;
    }
  }

  // 2. 持续读取数据
  async startReading(onDataReceived) {
    this.keepReading = true;
    const decoder = new TextDecoder();

    while (this.port && this.port.readable && this.keepReading) {
      this.reader = this.port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await this.reader.read();
          if (done) break;
          if (value) {
            // 将 Uint8Array 转换为 UTF-8 字符串
            const text = decoder.decode(value);
            onDataReceived(text);
          }
        }
      } catch (error) {
        console.error("读取异常:", error);
        // 如果是设备丢失，跳出循环
        if (error.name === 'NetworkError') break;
      } finally {
        // 💡 释放锁，这是确保能接收下一次数据的关键
        this.reader.releaseLock();
      }
      
      // 如果是非致命错误，稍微等待后重试循环
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // 3. 断开连接
  async disconnect() {
    this.keepReading = false;
    if (this.reader) {
      await this.reader.cancel();
    }
    if (this.port) {
      await this.port.close();
    }
    this.port = null;
    this.reader = null;
  }
}