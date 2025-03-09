"use client"

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID

// Ініціалізація Facebook Pixel
export const initFBPixel = () => {
  if (typeof window !== "undefined" && !window.fbq) {
    const script1 = document.createElement("script")
    script1.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script1)

    const noscript = document.createElement("noscript")
    const img = document.createElement("img")
    img.height = 1
    img.width = 1
    img.style.display = "none"
    img.src = `https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`
    noscript.appendChild(img)
    document.head.appendChild(noscript)
  }
}

// Відстеження перегляду сторінки
export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView")
  }
}

// Відстеження події
export const event = (name: string, options = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, options)
  }
}

// Відстеження прослуховування
export const trackListening = (trackName: string, artistName: string) => {
  event("Listen", {
    content_name: `${trackName} - ${artistName}`,
    content_category: "Music",
  })
}

// Відстеження прослуховування радіо
export const trackRadioListening = (showName: string) => {
  event("ListenRadio", {
    content_name: showName,
    content_category: "Radio",
  })
}

