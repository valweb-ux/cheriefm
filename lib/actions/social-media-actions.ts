export async function disconnectSocialMediaAccount(accountId: string) {
  return { success: true }
}

export async function refreshSocialMediaAccount(accountId: string) {
  return { success: true }
}

export async function refreshSocialMediaTokens() {
  return { success: true }
}

export async function deleteSocialMediaPost(postId: string) {
  return { success: true }
}

export async function republishSocialMediaPost(postId: string) {
  return { success: true }
}

export async function createSocialMediaPost(data: any) {
  return { id: Date.now().toString(), ...data }
}

