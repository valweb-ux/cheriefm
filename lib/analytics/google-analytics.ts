"use client"

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Ініціалізація Google Analytics
export const initGA = () => {
  if (typeof window !== "undefined" && !window.gtag) {
    const script1 = document.createElement("script")
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    document.head.appendChild(script1)

    const script2 = document.createElement("script")
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}', {
        page_path: window.location.pathname,
      });
    `
    document.head.appendChild(script2)
  }
}

// Відстеження перегляду сторінки
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Відстеження події
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Відстеження прослуховування
export const trackListening = (trackId: string, trackName: string, artistName: string, duration: number) => {
  event({
    action: "listen",
    category: "Music",
    label: `${trackName} - ${artistName}`,
    value: Math.round(duration),
  })
}

// Відстеження прослуховування радіо
export const trackRadioListening = (showName: string, duration: number) => {
  event({
    action: "listen_radio",
    category: "Radio",
    label: showName,
    value: Math.round(duration),
  })
}

