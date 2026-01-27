export const loadRazorpay = () => {
    return new Promise((resolve) => {
        // Check if Razorpay is already loaded to avoid adding multiple scripts
        if (window.Razorpay) {
            return resolve(true);
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}