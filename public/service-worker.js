"use strict";

// if (typeof window !== "undefined") {
//   // Check if the web app is installed
//   window.addEventListener("beforeinstallprompt", function (event) {
//     event.userChoice.then(function (choiceResult) {
//       if (choiceResult.outcome === "dismissed") {
//         console.log("User cancelled installation");
//       } else {
//         console.log("User installed the web app");
//       }
//     });
//   });
// }

if (typeof window !== "undefined") {
  // Check if the web app is installed
  window.addEventListener("beforeinstallprompt", function (event) {
    event.userChoice.then(function (choiceResult) {
      if (choiceResult.outcome === "dismissed") {
        console.log("User cancelled installation");
      } else {
        console.log("User installed the web app");
      }
    });
  });

  // Check if the service worker is registered
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log("Service worker registration successful");
      })
      .catch(function (err) {
        console.log("Service worker registration failed: ", err);
      });
  }
}

// Service worker code
self.addEventListener("install", function (event) {
  // Open a cache and cache the necessary resources
  event.waitUntil(
    caches.open("my-cache").then(function (cache) {
      return cache.addAll(["/", "/index.html", "/style.css", "/app.js"]);
    })
  );
});
