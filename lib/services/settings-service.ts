export async function getThemeSettings() {
  return {
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    fontFamily: "Inter, sans-serif",
    borderRadius: "rounded-md",
    darkMode: true,
  }
}

export async function getSiteSettings() {
  return {
    siteName: "Cherie FM",
    siteDescription: "Найкраще радіо",
    siteUrl: "https://cheriefm.com",
    contactEmail: "info@cheriefm.com",
    contactPhone: "+380123456789",
    contactAddress: "Київ, Україна",
    socialLinks: {
      facebook: "https://facebook.com/cheriefm",
      twitter: "https://twitter.com/cheriefm",
      instagram: "https://instagram.com/cheriefm",
    },
  }
}

export async function getHomepageSettings() {
  return {
    heroTitle: "Слухай найкращу музику",
    heroSubtitle: "Радіо, яке завжди з тобою",
    featuredNews: ["1", "2", "3"],
    featuredPrograms: ["1", "2"],
    showLatestNews: true,
    showUpcomingPrograms: true,
  }
}

export async function getAllNavigationItems() {
  return [
    { id: "1", title: "Головна", url: "/", order: 1, parent: null },
    { id: "2", title: "Новини", url: "/news", order: 2, parent: null },
    { id: "3", title: "Радіо", url: "/radio", order: 3, parent: null },
    { id: "4", title: "Музика", url: "/music", order: 4, parent: null },
    { id: "5", title: "Про нас", url: "/about", order: 5, parent: null },
    { id: "6", title: "Контакти", url: "/contacts", order: 6, parent: null },
  ]
}

