//checkImageWH 必须为正方形  返回一个promise  检测通过返回resolve  失败返回reject阻止图片上传
export function checkImageSameWH(file) {
    return new Promise(function (resolve, reject) {
      let filereader = new FileReader()
      filereader.onload = e => {
        let src = e.target.result
        const image = new Image()
        image.onload = function () {
          if (this.width !== this.height) {
            // debugger
            Modal.error({
              title: '上传文件的宽高必须一致，请重新上传',
            })
            reject()
          } else {
            resolve()
          }
        }
        image.onerror = reject
        image.src = src
      }
      filereader.readAsDataURL(file)
    })
  }
  //检验文件大小
  export function checkSize(file, size) {
    return new Promise(function (resolve, reject) {
      if (file.size / 1024 / 1024 > size) {
        Modal.error({
          title: '文件大小超出限制，请重新上传',
        })
        reject()
      } else {
        resolve()
      }
    })
  }
  //检验文件类型
  export function checkType(file, typeList) {
    return new Promise(function (resolve, reject) {
      if (!typeList.includes(file.type)) {
        Modal.error({
          title: '文件类型错误，请重新上传',
        })
        reject()
      } else {
        resolve()
      }
    })
  }
  