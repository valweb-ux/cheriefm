export async function getSiteSettings() {
  return {
    siteName: "CherieFM",
    siteDescription: "Радіо CherieFM",
    contactEmail: "contact@cheriefm.com",
    contactPhone: "+380123456789",
    contactAddress: "Київ, Україна",
    socialLinks: {
      facebook: "https://facebook.com/cheriefm",
      twitter: "https://twitter.com/cheriefm",
      instagram: "https://instagram.com/cheriefm",
    },
  }
}

export async function getThemeSettings() {
  return {
    primaryColor: "#ff0000",
    secondaryColor: "#0000ff",
    fontFamily: "Inter, sans-serif",
    darkMode: false,
  }
}

export async function getHomepageSettings() {
  return {
    heroTitle: "Ласкаво просимо на CherieFM",
    heroSubtitle: "Найкраще радіо в Україні",
    featuredCategories: ["1", "2"],
    showLatestNews: true,
    showPopularTracks: true,
  }
}

export async function getAllNavigationItems() {
  return [
    { id: "1", label: "Головна", url: "/", order: 1 },
    { id: "2", label: "Новини", url: "/news", order: 2 },
    { id: "3", label: "Радіо", url: "/radio", order: 3 },
    { id: "4", label: "Музика", url: "/music", order: 4 },
    { id: "5", label: "Про нас", url: "/about", order: 5 },
    { id: "6", label: "Контакти", url: "/contact", order: 6 },
  ]
}

