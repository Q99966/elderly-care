// src/utils/location.js

export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('浏览器不支持定位')
        return
      }
  
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            // 调用 OpenStreetMap 逆地理编码
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=zh-CN`
            )
            const data = await res.json()
            if (data.address) {
              const city = data.address.city || data.address.state || ''
              const district = data.address.district || ''
              const road = data.address.road || ''
              resolve(`${city}${district} ${road}`)
            } else {
              resolve(`未知位置 (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`)
            }
          } catch (e) {
            // 接口挂了至少返回经纬度
            resolve(`定位成功 (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`)
          }
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 5000 }
      )
    })
  }