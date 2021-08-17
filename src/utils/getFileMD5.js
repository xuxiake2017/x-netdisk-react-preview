import SparkMD5 from 'spark-md5'

/**
 * 计算文件md5值
 * @param file
 * @param uid
 */
export default function GetFileMD5 (file, uid) {

  return new Promise((resolve) => {
    let md5Hex = null;
    let fileReader = new FileReader()
    let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
  
    let fileSize = file.size;
    let fileRealName = file.name;
    let lastModifiedDate = file.lastModifiedDate.getTime();
    let chunkSize = 2097152;
    // read in chunks of 2MB
    let chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    let spark = new SparkMD5();
  
    fileReader.onload = function (e) {
      spark.appendBinary(e.target.result); // append binary string
      currentChunk++;
  
      if (currentChunk < chunks) {
        loadNext();
      } else {
        md5Hex = spark.end();
        // 回调
        // call()
        resolve({uid, md5Hex, fileSize, fileRealName, lastModifiedDate})
      }
    };
    function loadNext () {
      let start = currentChunk * chunkSize
      let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsBinaryString(blobSlice.call(file, start, end));
    }
    loadNext();
  })
}
