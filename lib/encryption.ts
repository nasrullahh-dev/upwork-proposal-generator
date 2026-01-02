// Simple encryption/decryption for storing API keys
// In a production app, you would use a more secure method

export async function encrypt(text: string): Promise<string> {
  // This is a simple base64 encoding - in a real app, use proper encryption
  return Buffer.from(text).toString("base64")
}

export async function decrypt(encryptedText: string): Promise<string> {
  // This is a simple base64 decoding - in a real app, use proper decryption
  return Buffer.from(encryptedText, "base64").toString()
}
