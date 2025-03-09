export const authOptions = {
  providers: [],
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
};

export function getServerSession() {
  return {
    user: {
      name: "Admin User",
      email: "admin@example.com",
      image: "/placeholder.svg?height=50&width=50",
    },
  };
}
