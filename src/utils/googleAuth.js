const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const initGoogleAuth = () => {
    return new Promise((resolve, reject) => {
        if (window.google) {
            resolve(window.google);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(window.google);
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

export const getGoogleClientId = () => GOOGLE_CLIENT_ID;

export const signInWithGoogleCode = async () => {
    const google = await initGoogleAuth();
    return new Promise((resolve, reject) => {
        try {
            const client = google.accounts.oauth2.initCodeClient({
                client_id: getGoogleClientId(),
                scope: "openid email profile",
                ux_mode: "popup",
                redirect_uri: "postmessage",
                callback: (response) => {
                    if (response && response.code) {
                        resolve(response.code);
                    } else {
                        reject(new Error(response?.error || "Failed to obtain authorization code"));
                    }
                },
            });
            client.requestCode();
        } catch (err) {
            reject(err);
        }
    });
};

export const storeAuthToken = (token) => {
    localStorage.setItem("auth_token", token);
};

export const getAuthToken = () => {
    return localStorage.getItem("auth_token");
};

export const removeAuthToken = () => {
    localStorage.removeItem("auth_token");
};

export const storeUserData = (userData) => {
    localStorage.setItem("user_data", JSON.stringify(userData));
};

export const getUserData = () => {
    const data = localStorage.getItem("user_data");
    return data ? JSON.parse(data) : null;
};

export const removeUserData = () => {
    localStorage.removeItem("user_data");
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};

export const logout = () => {
    removeAuthToken();
    removeUserData();
    window.location.href = "/";
};

export const decodeJWT = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};


