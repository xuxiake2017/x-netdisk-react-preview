import JSEncrypt from 'jsencrypt'

// 与后端 resources/private.key 配对的公钥，密码修改接口要求 RSA(PKCS#1 v1.5) 加密后提交
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBuCd3Nij/0v1f+zoErXKYfBEt
Ws7zMIJ8NWKtzDJST2SCD2bnmGnNY4AE+cEcf/yu0rcmIg8BlnX8drFx2KGsh/P1
1vuvxy7WaD434aF9bQBkdGDU3F/SlJs9uawdeCdrH5IwfcDaE/3wLkcjLOaKgfNv
UL1KdwvKRwmZJDX0YwIDAQAB
-----END PUBLIC KEY-----`

export function rsaEncrypt (text: string): string {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(PUBLIC_KEY)
  const encrypted = encryptor.encrypt(text)
  if (typeof encrypted !== 'string') {
    throw new Error('密码加密失败')
  }
  return encrypted
}
