const printBtn = document.getElementById("printBtn");

printBtn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    printBtn.disabled = true;
    printBtn.textContent = "Processing...";

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {

           

            const removeAdContent = () => {
                // Utility function to remove element by selector
                const removeBySelector = (selector) => {
                    document.querySelectorAll(selector).forEach(el => el.remove());
                };

                // 1. Remove ads by known class or ID
                removeBySelector("#adbox");
                removeBySelector(".adsbox");
                removeBySelector(".ad-box");
                removeBySelector(".banner-ads");
                removeBySelector(".advert");

                // 2. Remove premium banner container
                removeBySelector(".PremiumBannerBlobWrapper_overflow-wrapper__xsaS8");

                // 3. Optional: Unblur any blurred content
                document.querySelectorAll("*").forEach(el => {
                    if (el.style.filter?.includes("blur") || el.className.toString().includes("blur")) {
                        el.style.filter = "none";
                        el.classList.remove("blur");
                    }
                });

                // 4. Optional: Remove dark overlays
                document.querySelectorAll("div, section, aside").forEach(el => {
                    const bg = window.getComputedStyle(el).backgroundColor;
                    if (bg.includes("rgba") && bg.includes("0.5")) {
                        el.remove();
                    }
                });
            }

            const delay = (ms) => new Promise((res) => setTimeout(res, ms));

            const scrollPageToBottom = async () => {
                let totalHeight = 0;
                const distance = 300;

                return new Promise((resolve) => {
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= scrollHeight - window.innerHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 300);
                });
            };

            const applyPrintStyles = () => {
                const style = document.createElement("style");
                style.id = "print-style-extension";
                style.innerHTML = `
          @media print {
            header, footer, nav, aside, .no-print, .ads, .sidebar,
            .premium-banner, .ViewerToolbar, .Layout_info-bar-wrapper__He0Ho,
            .Sidebar_sidebar-scrollable__kqeBZ, .HeaderWrapper_header-wrapper__mCmf3,
            .Layout_visible-content-bottom-wrapper-sticky__yaaAB,
            .Layout_bottom-section-wrapper__yBWWk,
            .Layout_footer-wrapper__bheJQ, .InlineBanner_inline-banner-wrapper__DAi5X,
            .banner-wrapper, #top-bar-wrapper,
            .Layout_sidebar-wrapper__unavM,
            .Layout_is-open__9DQr4 {
              display: none !important;
            }

            body {
              background: white !important;
              color: black !important;
            }

            * {
              box-shadow: none !important;
              background: transparent !important;
            }

            .Viewer_document-wrapper__JPBWQ,
            .Viewer_document-wrapper__LXzoQ,
            .Viewer_document-wrapper__XsO4j,
            .page-content {
              display: flex !important;
            }
          }
        `;
                document.head.appendChild(style);
            };

            const scrollDownAndPrint = async () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                await delay(500);

                await scrollPageToBottom();

                window.scrollTo({ top: 0, behavior: "smooth" });
                await delay(1000);

                applyPrintStyles();

                window.print();

                window.onafterprint = () => {
                    document.getElementById("print-style-extension")?.remove();
                      chrome.runtime.sendMessage({ type: "PRINT_DONE" });

                };
            };

            removeAdContent();
            scrollDownAndPrint();
        },
    });
});



document.getElementById("unblurBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            // Utility function to remove element by selector
            const removeBySelector = (selector) => {
                document.querySelectorAll(selector).forEach(el => el.remove());
            };

            // 1. Remove ads by known class or ID
            removeBySelector("#adbox");
            removeBySelector(".adsbox");
            removeBySelector(".ad-box");
            removeBySelector(".banner-ads");
            removeBySelector(".advert");

            // 2. Remove premium banner container
            removeBySelector(".PremiumBannerBlobWrapper_overflow-wrapper__xsaS8");

            // 3. Optional: Unblur any blurred content
            document.querySelectorAll("*").forEach(el => {
                if (el.style.filter?.includes("blur") || el.className.toString().includes("blur")) {
                    el.style.filter = "none";
                    el.classList.remove("blur");
                }
            });

            // 4. Optional: Remove dark overlays
            document.querySelectorAll("div, section, aside").forEach(el => {
                const bg = window.getComputedStyle(el).backgroundColor;
                if (bg.includes("rgba") && bg.includes("0.5")) {
                    el.remove();
                }
            });

            alert("🔓 Ads and premium banner removed!");
        }
    });
});



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PRINT_DONE") {
    const printBtn = document.getElementById("printBtn");
    printBtn.disabled = false;
    printBtn.textContent = "Print";
  }
});

