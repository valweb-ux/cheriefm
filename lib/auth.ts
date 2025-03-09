// Створюємо заглушку для authOptions
export const authOptions = {
  providers: [],
  callbacks: {
    async session({ session, token, user }: any) {
      return session
    },
    async jwt({ token, user, account, profile }: any) {
      return token
    },
  },
}

