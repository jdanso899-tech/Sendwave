const { useState, useEffect, useRef } = React;

// Fetch real-time exchange rates
async function fetchExchangeRates() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.log("Using fallback rates");
    return null;
  }
}

const NETWORKS = {
  "MTN Mobile Money": { color: "#FFCC00", text: "#1a1a00", icon: "📱", countries: ["GH","NG","UG","RW","CI","CM","ZM","BJ","GN","SN"] },
  "Airtel Money": { color: "#E4002B", text: "#fff", icon: "📲", countries: ["UG","KE","TZ","ZM","MW","MG","CD","CG","RW","GH","BI","TD","SN","GN","CI"] },
  "M-Pesa": { color: "#00A650", text: "#fff", icon: "💚", countries: ["KE","TZ","GH","MZ","ZM","LS","EG"] },
  "Orange Money": { color: "#FF6600", text: "#fff", icon: "🟠", countries: ["SN","ML","BF","CI","CM","GN","MR","NE","MG","TN","EG","CD"] },
  "Wave": { color: "#1E88E5", text: "#fff", icon: "🌊", countries: ["SN","ML","BF","CI","GN","UG","CD"] },
  "Moov Money": { color: "#00AEEF", text: "#fff", icon: "💙", countries: ["BJ","TG","BF","CI","NE","ML","CD","MG","TN"] },
  "T-Cash": { color: "#9C27B0", text: "#fff", icon: "💜", countries: ["TG"] },
  "Ecocash": { color: "#009933", text: "#fff", icon: "💰", countries: ["ZW","ZM"] },
  "Visa / Mastercard": { color: "#1A1F71", text: "#fff", icon: "💳", countries: ["ALL"] },
};

const COUNTRIES = [
  // East Africa
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES", currencyName: "Kenyan Shilling", symbol: "KSh", rate: 129.50 },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", currency: "TZS", currencyName: "Tanzanian Shilling", symbol: "TSh", rate: 2680 },
  { code: "UG", name: "Uganda", flag: "🇺🇬", currency: "UGX", currencyName: "Ugandan Shilling", symbol: "USh", rate: 3760 },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", currency: "RWF", currencyName: "Rwandan Franc", symbol: "Fr", rate: 1380 },
  { code: "BI", name: "Burundi", flag: "🇧🇮", currency: "BIF", currencyName: "Burundian Franc", symbol: "Fr", rate: 2900 },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", currency: "ETB", currencyName: "Ethiopian Birr", symbol: "Br", rate: 124 },
  { code: "SO", name: "Somalia", flag: "🇸🇴", currency: "SOS", currencyName: "Somali Shilling", symbol: "Sh", rate: 571 },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯", currency: "DJF", currencyName: "Djiboutian Franc", symbol: "Fr", rate: 177.8 },
  { code: "ER", name: "Eritrea", flag: "🇪🇷", currency: "ERN", currencyName: "Eritrean Nakfa", symbol: "Nfk", rate: 15 },
  // West Africa
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN", currencyName: "Nigerian Naira", symbol: "₦", rate: 1620 },
  { code: "GH", name: "Ghana", flag: "🇬🇭", currency: "GHS", currencyName: "Ghanaian Cedi", symbol: "₵", rate: 15.4 },
  { code: "SN", name: "Senegal", flag: "🇸🇳", currency: "XOF", currencyName: "West African CFA Franc", symbol: "CFA", rate: 621 },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", currency: "XOF", currencyName: "West African CFA Franc", symbol: "CFA", rate: 621 },
  { code: "ML", name: "Mali", flag: "🇲🇱", currency: "XOF", currencyName: "West African CFA Franc", symbol: "CFA", rate: 621 },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", currency: "XOF", currencyName: "West African CFA Franc", symbol: "CFA", rate: 621 },
  { code: "NE", name: "Niger", flag: "🇳🇪", currency: "XOF", currencyName: "West African CFA Franc", symbol: "CFA", rate: 621 },
  { code: "TG", name: "Togo", flag: "🇹🇬", currency: "XOF", currencyName: "West African CFA Franc", symbol: "CFA", rate: 621 },
  { code: "BJ", name: "Benin", flag: "🇧🇯", currency: "XOF", currencyName: "West African CFA Franc", symbol: "CFA", rate: 621 },
  { code: "GN", name: "Guinea", flag: "🇬🇳", currency: "GNF", currencyName: "Guinean Franc", symbol: "Fr", rate: 8630 },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱", currency: "SLL", currencyName: "Sierra Leonean Leone", symbol: "Le", rate: 22500 },
  { code: "LR", name: "Liberia", flag: "🇱🇷", currency: "LRD", currencyName: "Liberian Dollar", symbol: "L$", rate: 193 },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼", currency: "XOF", currencyName: "West African CFA Franc", symbol: "CFA", rate: 621 },
  { code: "GM", name: "Gambia", flag: "🇬🇲", currency: "GMD", currencyName: "Gambian Dalasi", symbol: "D", rate: 72 },
  { code: "CV", name: "Cape Verde", flag: "🇨🇻", currency: "CVE", currencyName: "Cape Verdean Escudo", symbol: "Esc", rate: 110.5 },
  { code: "MR", name: "Mauritania", flag: "🇲🇷", currency: "MRU", currencyName: "Mauritanian Ouguiya", symbol: "UM", rate: 39.7 },
  // North Africa
  { code: "EG", name: "Egypt", flag: "🇪🇬", currency: "EGP", currencyName: "Egyptian Pound", symbol: "E£", rate: 50.5 },
  { code: "MA", name: "Morocco", flag: "🇲🇦", currency: "MAD", currencyName: "Moroccan Dirham", symbol: "د.م.", rate: 10.05 },
  { code: "TN", name: "Tunisia", flag: "🇹🇳", currency: "TND", currencyName: "Tunisian Dinar", symbol: "DT", rate: 3.12 },
  { code: "DZ", name: "Algeria", flag: "🇩🇿", currency: "DZD", currencyName: "Algerian Dinar", symbol: "دج", rate: 134.5 },
  { code: "LY", name: "Libya", flag: "🇱🇾", currency: "LYD", currencyName: "Libyan Dinar", symbol: "LD", rate: 4.85 },
  { code: "SD", name: "Sudan", flag: "🇸🇩", currency: "SDG", currencyName: "Sudanese Pound", symbol: "£SD", rate: 601 },
  // Central Africa
  { code: "CM", name: "Cameroon", flag: "🇨🇲", currency: "XAF", currencyName: "Central African CFA Franc", symbol: "FCFA", rate: 621 },
  { code: "CD", name: "DR Congo", flag: "🇨🇩", currency: "CDF", currencyName: "Congolese Franc", symbol: "FC", rate: 2800 },
  { code: "CG", name: "Congo", flag: "🇨🇬", currency: "XAF", currencyName: "Central African CFA Franc", symbol: "FCFA", rate: 621 },
  { code: "TD", name: "Chad", flag: "🇹🇩", currency: "XAF", currencyName: "Central African CFA Franc", symbol: "FCFA", rate: 621 },
  { code: "CF", name: "C. African Rep.", flag: "🇨🇫", currency: "XAF", currencyName: "Central African CFA Franc", symbol: "FCFA", rate: 621 },
  { code: "GA", name: "Gabon", flag: "🇬🇦", currency: "XAF", currencyName: "Central African CFA Franc", symbol: "FCFA", rate: 621 },
  { code: "GQ", name: "Eq. Guinea", flag: "🇬🇶", currency: "XAF", currencyName: "Central African CFA Franc", symbol: "FCFA", rate: 621 },
  { code: "ST", name: "São Tomé", flag: "🇸🇹", currency: "STN", currencyName: "São Tomé Dobra", symbol: "Db", rate: 23.6 },
  // Southern Africa
  { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR", currencyName: "South African Rand", symbol: "R", rate: 18.6 },
  { code: "ZM", name: "Zambia", flag: "🇿🇲", currency: "ZMW", currencyName: "Zambian Kwacha", symbol: "K", rate: 27.5 },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", currency: "ZiG", currencyName: "Zimbabwe Gold", symbol: "ZiG", rate: 27.2 },
  { code: "MW", name: "Malawi", flag: "🇲🇼", currency: "MWK", currencyName: "Malawian Kwacha", symbol: "MK", rate: 1740 },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿", currency: "MZN", currencyName: "Mozambican Metical", symbol: "MT", rate: 64.1 },
  { code: "BW", name: "Botswana", flag: "🇧🇼", currency: "BWP", currencyName: "Botswana Pula", symbol: "P", rate: 13.7 },
  { code: "NA", name: "Namibia", flag: "🇳🇦", currency: "NAD", currencyName: "Namibian Dollar", symbol: "N$", rate: 18.6 },
  { code: "LS", name: "Lesotho", flag: "🇱🇸", currency: "LSL", currencyName: "Lesotho Loti", symbol: "L", rate: 18.6 },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿", currency: "SZL", currencyName: "Swazi Lilangeni", symbol: "L", rate: 18.6 },
  { code: "AO", name: "Angola", flag: "🇦🇴", currency: "AOA", currencyName: "Angolan Kwanza", symbol: "Kz", rate: 912 },
  // Indian Ocean
  { code: "MG", name: "Madagascar", flag: "🇲🇬", currency: "MGA", currencyName: "Malagasy Ariary", symbol: "Ar", rate: 4620 },
  { code: "MU", name: "Mauritius", flag: "🇲🇺", currency: "MUR", currencyName: "Mauritian Rupee", symbol: "₨", rate: 46.5 },
  { code: "SC", name: "Seychelles", flag: "🇸🇨", currency: "SCR", currencyName: "Seychellois Rupee", symbol: "₨", rate: 14.2 },
  { code: "KM", name: "Comoros", flag: "🇰🇲", currency: "KMF", currencyName: "Comorian Franc", symbol: "Fr", rate: 466 },
];

const DEMO_CONTACTS = [
  { name: "Amara Diallo", flag: "🇸🇳", country: "SN", network: "Wave", phone: "+221 77 123 4567", avatar: "AD" },
  { name: "Kwame Mensah", flag: "🇬🇭", country: "GH", network: "MTN Mobile Money", phone: "+233 24 456 7890", avatar: "KM" },
  { name: "Fatima Al-Rashid", flag: "🇪🇬", country: "EG", network: "M-Pesa", phone: "+20 10 2345 6789", avatar: "FA" },
  { name: "Chidi Okonkwo", flag: "🇳🇬", country: "NG", network: "Airtel Money", phone: "+234 803 456 7890", avatar: "CO" },
];

const TRANSACTIONS = [
  { id: 1, type: "sent", name: "Kwame Mensah", flag: "🇬🇭", amount: 50, currency: "USD", received: "₵770 GHS", date: "Today, 2:14 PM", status: "completed", network: "MTN Mobile Money" },
  { id: 2, type: "sent", name: "Amara Diallo", flag: "🇸🇳", amount: 100, currency: "USD", received: "CFA62,100 XOF", date: "Yesterday, 9:30 AM", status: "completed", network: "Wave" },
  { id: 3, type: "loaded", name: "Visa Card •4231", flag: "💳", amount: 200, currency: "USD", received: "$200 USD", date: "May 28, 4:05 PM", status: "completed", network: "Visa" },
  { id: 4, type: "sent", name: "Chidi Okonkwo", flag: "🇳🇬", amount: 75, currency: "USD", received: "₦121,500 NGN", date: "May 26, 11:20 AM", status: "pending", network: "Airtel Money" },
];

const avatarColors = ["#C7522A", "#4CAF50", "#2196F3", "#9C27B0", "#FF5722", "#009688"];
function avatarColor(str) { let h = 0; for (let c of str) h = (h * 31 + c.charCodeAt(0)) % avatarColors.length; return avatarColors[h]; }

function Sendwave() {
  const [screen, setScreen] = useState("home");
  const [homeCountry, setHomeCountry] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileVerified, setProfileVerified] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [exchangeRates, setExchangeRates] = useState(null);
  const [homeBalance, setHomeBalance] = useState(347.50);
  const [isOnline, setIsOnline] = useState(true);
  const [sendStep, setSendStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState("");
  const [recipientMethod, setRecipientMethod] = useState("mobileMoney");
  const [sendPhone, setSendPhone] = useState("");
  const [sendPhoneVerified, setSendPhoneVerified] = useState(false);
  const [sendPhoneError, setSendPhoneError] = useState("");
  const [recipientCardNum, setRecipientCardNum] = useState("");
  const [recipientCardName, setRecipientCardName] = useState("");
  const [recipientCardExpiry, setRecipientCardExpiry] = useState("");
  const [recipientCardCvv, setRecipientCardCvv] = useState("");
  const [recipientCardVerified, setRecipientCardVerified] = useState(false);
  const [recipientCardError, setRecipientCardError] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [loadStep, setLoadStep] = useState(1);
  const [loadAmount, setLoadAmount] = useState("");
  const [loadNetwork, setLoadNetwork] = useState(null);
  const [loadPhone, setLoadPhone] = useState("");
  const [loadPhoneVerified, setLoadPhoneVerified] = useState(false);
  const [loadPhoneError, setLoadPhoneError] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [loadCvv, setLoadCvv] = useState("");
  const [cardVerified, setCardVerified] = useState(false);
  const [cardError, setCardError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [notification, setNotification] = useState(null);
  const [cardNum, setCardNum] = useState("");
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    fetchExchangeRates().then(rates => {
      if (rates) setExchangeRates(rates);
    });
  }, []);

  function isValidPhoneNumber(value) {
    return /^\+\d{7,15}$/.test(value.trim());
  }

  function luhnCheck(value) {
    const digits = value.replace(/\D/g, "");
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0 && digits.length >= 13 && digits.length <= 19;
  }

  function isValidExpiry(value) {
    return /^(0[1-9]|1[0-2])\/(\d{2})$/.test(value.trim());
  }

  function toast(msg, type = "success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }

  function getRate(fromCurrency, toCurrency) {
    if (!exchangeRates) return COUNTRIES.find(c => c.currency === toCurrency)?.rate || 129.50;
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    return toRate / fromRate;
  }

  function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    const rate = getRate(fromCurrency, toCurrency);
    return parseFloat((amount * rate).toFixed(2));
  }

  function formatCurrency(value, currencyCode, country) {
    const symbol = country?.symbol || "";
    if (value >= 1000) {
      return `${symbol}${(value / 1000).toFixed(1)}K`;
    }
    return `${symbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }


  function toast(msg, type = "success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }

  function verifySendPhone() {
    if (!sendPhone) {
      setSendPhoneError("Enter recipient phone number");
      return;
    }
    if (!isValidPhoneNumber(sendPhone)) {
      setSendPhoneError("Phone must be in international format, e.g. +233123456789");
      return;
    }
    setSendPhoneError("");
    setSendPhoneVerified(true);
    toast("Recipient phone verified", "success");
  }

  function verifyRecipientCard() {
    const number = recipientCardNum.replace(/\D/g, "");
    if (!luhnCheck(number)) {
      setRecipientCardError("Enter a valid card number");
      return;
    }
    if (!recipientCardName.trim()) {
      setRecipientCardError("Enter the cardholder name");
      return;
    }
    if (!isValidExpiry(recipientCardExpiry)) {
      setRecipientCardError("Expiry must be MM/YY");
      return;
    }
    if (!/^\d{3,4}$/.test(recipientCardCvv)) {
      setRecipientCardError("CVV must be 3 or 4 digits");
      return;
    }
    setRecipientCardError("");
    setRecipientCardVerified(true);
    toast("Recipient card verified", "success");
  }

  function verifyLoadDestination() {
    if (!loadNetwork) {
      setLoadPhoneError("Select a payment method first");
      return;
    }
    if (loadNetwork === "Visa / Mastercard") {
      const number = cardNum.replace(/\D/g, "");
      if (!luhnCheck(number)) {
        setCardError("Enter a valid card number");
        return;
      }
      if (!isValidExpiry(cardExpiry)) {
        setCardError("Expiry must be MM/YY");
        return;
      }
      if (!/^\d{3,4}$/.test(loadCvv)) {
        setCardError("CVV must be 3 or 4 digits");
        return;
      }
      setCardError("");
      setCardVerified(true);
      toast("Card information verified", "success");
      return;
    }

    if (!loadPhone) {
      setLoadPhoneError("Enter a mobile money number");
      return;
    }
    if (!isValidPhoneNumber(loadPhone)) {
      setLoadPhoneError("Phone must be in international format, e.g. +233123456789");
      return;
    }
    setLoadPhoneError("");
    setLoadPhoneVerified(true);
    toast("Load destination verified", "success");
  }

  function handleSend() {
    const amountValue = parseFloat(amount);
    const recipientPhone = selectedContact?.phone || sendPhone;
    const recipientNetwork = selectedNetwork || selectedContact?.network;
    const recipientLabel = recipientMethod === "creditCard"
      ? recipientCardName ? `${recipientCardName} •${recipientCardNum.slice(-4)}` : `Card •${recipientCardNum.slice(-4)}`
      : selectedContact?.name || recipientPhone;

    if (!amountValue || amountValue <= 0) { toast("Enter a valid amount", "error"); return; }
    if (!selectedCountry) { toast("Choose a recipient country", "error"); return; }
    if (recipientMethod === "mobileMoney") {
      if (!recipientPhone) { toast("Enter recipient phone number", "error"); return; }
      if (!selectedContact && !sendPhoneVerified) { toast("Verify the recipient phone number", "error"); return; }
      if (!recipientNetwork) { toast("Choose a mobile money network", "error"); return; }
    } else {
      if (!recipientCardVerified) { toast("Verify the recipient card details", "error"); return; }
    }
    if (pin !== "1234") { setPinError(true); setTimeout(() => setPinError(false), 800); return; }

    if (amountValue > homeBalance) { toast("Insufficient balance", "error"); return; }

    if (!isOnline) {
      setOfflineQueue(q => [...q, {
        type: "send",
        method: recipientMethod,
        contact: selectedContact,
        phone: recipientPhone,
        card: recipientMethod === "creditCard" ? { name: recipientCardName, number: recipientCardNum, expiry: recipientCardExpiry } : null,
        amount: amountValue,
        country: selectedCountry
      }]);
      toast("Queued for when you're online", "info");
    } else {
      setHomeBalance(b => +(b - amountValue).toFixed(2));
      const received = convertCurrency(amountValue, homeCountry.currency, selectedCountry.currency);
      setSuccessMsg(`${formatCurrency(received, selectedCountry.currency, selectedCountry)} sent to ${recipientLabel} ${selectedCountry?.flag}`);
      setShowSuccess(true);
    }
    setAmount(""); setPin(""); setSendStep(1); setSelectedContact(null); setSelectedCountry(null); setSelectedNetwork(null); setSendPhone(""); setSendPhoneVerified(false); setRecipientCardNum(""); setRecipientCardName(""); setRecipientCardExpiry(""); setRecipientCardCvv(""); setRecipientCardVerified(false);
    setTimeout(() => { setShowSuccess(false); setScreen("home"); setActiveTab("home"); }, 2500);
  }

  function handleLoad() {
    const amountValue = parseFloat(loadAmount);
    if (!amountValue || amountValue <= 0) { toast("Enter a valid amount", "error"); return; }
    if (!loadNetwork) { toast("Choose a payment method", "error"); return; }
    if (loadNetwork === "Visa / Mastercard") {
      if (!cardVerified) { toast("Verify card information", "error"); return; }
    } else {
      if (!loadPhone || !loadPhoneVerified) { toast("Verify the mobile money number", "error"); return; }
    }
    setHomeBalance(b => +(b + amountValue).toFixed(2));
    setSuccessMsg(`${formatCurrency(amountValue, homeCountry.currency, homeCountry)} loaded to your Sendwave wallet`);
    setShowSuccess(true);
    setLoadAmount(""); setLoadStep(1); setLoadNetwork(null); setCardNum(""); setCardExpiry(""); setLoadCvv(""); setLoadPhone(""); setLoadPhoneVerified(false); setCardVerified(false);
    setTimeout(() => { setShowSuccess(false); setScreen("home"); setActiveTab("home"); }, 2500);
  }


  const country = selectedCountry || homeCountry || COUNTRIES[0];
  const amountInSendCurrency = amount ? convertCurrency(parseFloat(amount), homeCountry?.currency || "USD", selectedCountry?.currency || homeCountry?.currency) : 0;
  const receivedAmt = amountInSendCurrency ? (amountInSendCurrency).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";
  const receivedDisplay = amount && selectedCountry ? `${selectedCountry.symbol}${receivedAmt} ${selectedCountry.currency}` : "—";

  const nav = (tab) => {
    setActiveTab(tab);
    setScreen(tab);
    setSendStep(1); setLoadStep(1);
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchQ.toLowerCase()) || c.currency.toLowerCase().includes(searchQ.toLowerCase())
  );

  if (!userProfile) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem 1rem", minHeight: "100vh", background: "#F5F2EE" }}>
        <div style={{ width: 390, position: "relative", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
          <div style={{ background: "#0D1117", borderRadius: 48, padding: "12px 12px 0", boxShadow: "0 32px 80px rgba(0,0,0,0.45)", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 24px 0", color: "#fff", fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>9:41</span>
              <div style={{ width: 120, height: 32, background: "#0D1117", borderRadius: 20, position: "relative", left: "-10px" }} />
              <div style={{ fontSize: 10, background: "#22c55e", borderRadius: 10, padding: "2px 6px", color: "#fff", fontWeight: 700 }}>● LIVE</div>
            </div>
            <div style={{ background: "#F5F2EE", minHeight: 720, borderRadius: "32px 32px 0 0", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
              <div style={{ marginBottom: 24, width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #C7522A, #E07B4A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 32 }}>SW</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 12px" }}>Create your profile</h1>
              <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 32px", lineHeight: 1.5 }}>Enter your name and phone number to start</p>
              <div style={{ width: "100%", textAlign: "left", maxWidth: 320 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Full name</label>
                <input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Jane Doe" style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1.5px solid #E5E7EB", marginBottom: 16, outline: "none", fontSize: 14 }} />
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Phone number</label>
                <input value={profilePhone} onChange={e => { setProfilePhone(e.target.value); setProfileVerified(false); }} placeholder="+233123456789" style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1.5px solid #E5E7EB", marginBottom: 8, outline: "none", fontSize: 14 }} />
                {profileError && <p style={{ color: "#b91c1c", fontSize: 12, margin: "0 0 8px" }}>{profileError}</p>}
                <button onClick={() => {
                  if (!profileName.trim()) {
                    setProfileError("Please enter your name");
                    return;
                  }
                  if (!isValidPhoneNumber(profilePhone)) {
                    setProfileError("Phone must be international format, e.g. +233123456789");
                    return;
                  }
                  setProfileError("");
                  setProfileVerified(true);
                  toast("Profile phone verified", "success");
                }} style={{ width: "100%", border: "none", borderRadius: 14, background: "#C7522A", color: "#fff", padding: "14px", fontWeight: 800, cursor: "pointer", marginBottom: 12 }}>Verify phone</button>
                <button onClick={() => {
                  if (!profileName.trim()) {
                    setProfileError("Please enter your name");
                    return;
                  }
                  if (!profileVerified) {
                    setProfileError("Verify your phone first");
                    return;
                  }
                  setUserProfile({ name: profileName.trim(), phone: profilePhone.trim() });
                  setProfileError("");
                }} style={{ width: "100%", border: "none", borderRadius: 14, background: "#2D5016", color: "#fff", padding: "14px", fontWeight: 800, cursor: "pointer" }}>Create profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!homeCountry) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem 1rem", minHeight: "100vh", background: "#F5F2EE" }}>
        <div style={{ width: 390, position: "relative", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
          <div style={{ background: "#0D1117", borderRadius: 48, padding: "12px 12px 0", boxShadow: "0 32px 80px rgba(0,0,0,0.45)", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 24px 0", color: "#fff", fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>9:41</span>
              <div style={{ width: 120, height: 32, background: "#0D1117", borderRadius: 20, position: "relative", left: "-10px" }} />
              <div style={{ fontSize: 10, background: "#22c55e", borderRadius: 10, padding: "2px 6px", color: "#fff", fontWeight: 700 }}>● LIVE</div>
            </div>

            <div style={{ background: "#F5F2EE", minHeight: 720, borderRadius: "32px 32px 0 0", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
              <div style={{ marginBottom: 32, width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #C7522A, #E07B4A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 32 }}>SW</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 12px" }}>Welcome to Sendwave</h1>
              <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 32px", lineHeight: 1.5 }}>Pan-African Money Transfer</p>

              <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 16px" }}>Select your home country</p>
              
              <div style={{ width: "100%", maxHeight: 400, overflowY: "auto", borderRadius: 16, border: "1.5px solid #E5E7EB", background: "#fff", marginBottom: 20 }}>
                {COUNTRIES.map(c => (
                  <button key={c.code} onClick={() => setHomeCountry(c)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#fff", borderRadius: 0, border: "none", borderBottom: "1px solid #F0EDE8", cursor: "pointer", textAlign: "left", width: "100%" }}>
                    <span style={{ fontSize: 24 }}>{c.flag}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>{c.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{c.currency} • {c.symbol}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem 1rem", minHeight: "100vh", background: "transparent" }}>
      <div style={{ width: 390, position: "relative", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

        {/* Phone shell */}
        <div style={{ background: "#0D1117", borderRadius: 48, padding: "12px 12px 0", boxShadow: "0 32px 80px rgba(0,0,0,0.45)", overflow: "hidden" }}>
          {/* Status bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 24px 0", color: "#fff", fontSize: 12 }}>
            <span style={{ fontWeight: 600 }}>9:41</span>
            <div style={{ width: 120, height: 32, background: "#0D1117", borderRadius: 20, position: "relative", left: "-10px" }} />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 10, background: isOnline ? "#22c55e" : "#ef4444", borderRadius: 10, padding: "2px 6px", color: "#fff", fontWeight: 700 }}>
                {isOnline ? "●  LIVE" : "✕  OFFLINE"}
              </span>
            </div>
          </div>

          {/* App screen */}
          <div style={{ background: "#F5F2EE", minHeight: 720, borderRadius: "32px 32px 0 0", overflow: "hidden", position: "relative" }}>

            {/* Success overlay */}
            {showSuccess && (
              <div style={{ position: "absolute", inset: 0, zIndex: 100, background: "linear-gradient(145deg, #2D5016, #4A7C23)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>✓</div>
                <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, textAlign: "center", margin: 0, padding: "0 32px" }}>{successMsg}</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>Transaction complete</p>
              </div>
            )}

            {/* Toast notification */}
            {notification && (
              <div style={{ position: "absolute", top: 16, left: 16, right: 16, zIndex: 99, background: notification.type === "error" ? "#b91c1c" : notification.type === "info" ? "#1d4ed8" : "#15803d", color: "#fff", borderRadius: 14, padding: "12px 16px", fontSize: 13, fontWeight: 600, textAlign: "center" }}>
                {notification.msg}
              </div>
            )}

            {/* HOME SCREEN */}
            {screen === "home" && (
              <div>
                <div style={{ background: "linear-gradient(160deg, #2D5016 0%, #4A7C23 60%, #7AB648 100%)", padding: "24px 24px 48px", borderRadius: "32px 32px 0 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: 13 }}>Good morning, {userProfile.name.split(" ")[0]} 👋</p>
                      <p style={{ color: "#fff", margin: 0, fontSize: 18, fontWeight: 700 }}>Your Wallet</p>
                    </div>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#C7522A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>SW</div>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 4px", fontSize: 13, fontWeight: 500 }}>Available Balance</p>
                  <p style={{ color: "#fff", margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>{homeCountry.symbol}{homeBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span style={{ fontSize: 20 }}>{homeCountry.currency}</span></p>
                  <p style={{ color: "rgba(255,255,255,0.6)", margin: "8px 0 0", fontSize: 11 }}>{homeCountry.name} • {homeCountry.flag}</p>
                  {offlineQueue.length > 0 && (
                    <div style={{ marginTop: 12, background: "rgba(255,165,0,0.25)", borderRadius: 10, padding: "8px 12px", color: "#ffd700", fontSize: 12, fontWeight: 600 }}>
                      ⏳ {offlineQueue.length} transfer{offlineQueue.length > 1 ? "s" : ""} queued (offline)
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div style={{ margin: "-24px 20px 0", background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { icon: "↗", label: "Send", color: "#C7522A", action: () => { setScreen("send"); setActiveTab("send"); } },
                    { icon: "↙", label: "Load", color: "#2D5016", action: () => { setScreen("load"); setActiveTab("load"); } },
                    { icon: "⊘", label: "Request", color: "#7338AC", action: () => toast("Feature coming soon", "info") },
                  ].map(a => (
                    <button key={a.label} onClick={a.action} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "8px 4px" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 16, background: a.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: a.color, fontWeight: 900 }}>{a.icon}</div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{a.label}</span>
                    </button>
                  ))}
                </div>

                {/* Networks */}
                <div style={{ padding: "24px 20px 8px" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Supported Networks</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {Object.entries(NETWORKS).slice(0, 6).map(([name, n]) => (
                      <div key={name} style={{ background: n.color, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: n.text, display: "flex", alignItems: "center", gap: 4 }}>
                        {n.icon} {name.split(" ")[0]}
                      </div>
                    ))}
                    <div style={{ background: "#E5E7EB", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#374151" }}>+3 more</div>
                  </div>
                </div>

                {/* Recent contacts */}
                <div style={{ padding: "16px 20px 8px" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Recent Contacts</p>
                  <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
                    {DEMO_CONTACTS.map(c => (
                      <button key={c.name} onClick={() => { setSelectedContact(c); setSelectedCountry(COUNTRIES.find(x => x.code === c.country)); setScreen("send"); setActiveTab("send"); setSendStep(2); }}
                        style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 64 }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: avatarColor(c.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{c.avatar}</div>
                        <span style={{ fontSize: 11, color: "#374151", fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}>{c.name.split(" ")[0]}</span>
                        <span style={{ fontSize: 18, lineHeight: 1 }}>{c.flag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent transactions */}
                <div style={{ padding: "8px 20px 90px" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Recent Activity</p>
                  {TRANSACTIONS.slice(0, 3).map(tx => (
                    <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #F0EDE8" }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: tx.type === "loaded" ? "#2D5016" : "#C7522A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: tx.type === "loaded" ? 18 : 16 }}>
                        {tx.type === "loaded" ? "💳" : tx.flag}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{tx.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{tx.date} · {tx.network}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: tx.type === "loaded" ? "#2D5016" : "#C7522A" }}>
                          {tx.type === "loaded" ? "+" : "-"}${tx.amount}
                        </p>
                        <span style={{ fontSize: 10, fontWeight: 700, color: tx.status === "completed" ? "#16a34a" : "#d97706", background: tx.status === "completed" ? "#dcfce7" : "#fef3c7", padding: "2px 6px", borderRadius: 8 }}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEND SCREEN */}
            {screen === "send" && (
              <div>
                <div style={{ background: "linear-gradient(160deg, #C7522A, #E07B4A)", padding: "24px 24px 32px", borderRadius: "32px 32px 0 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => { setScreen("home"); setActiveTab("home"); setSendStep(1); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, width: 36, height: 36, color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: 12 }}>Step {sendStep} of 3</p>
                      <p style={{ color: "#fff", margin: 0, fontSize: 18, fontWeight: 700 }}>
                        {sendStep === 1 ? "Choose Country" : sendStep === 2 ? "Select Recipient" : "Confirm Transfer"}
                      </p>
                    </div>
                  </div>
                  {/* Step dots */}
                  <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
                    {[1,2,3].map(s => (
                      <div key={s} style={{ height: 4, borderRadius: 4, background: s <= sendStep ? "#fff" : "rgba(255,255,255,0.3)", flex: s === sendStep ? 2 : 1, transition: "flex 0.3s" }} />
                    ))}
                  </div>
                </div>

                <div style={{ padding: "20px" }}>
                  {/* Step 1: Choose country */}
                  {sendStep === 1 && (
                    <div>
                      <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="🔍 Search country or currency…"
                        style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1.5px solid #E5E7EB", fontSize: 14, background: "#fff", boxSizing: "border-box", marginBottom: 16, outline: "none" }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 480, overflowY: "auto", paddingBottom: 16 }}>
                        {filteredCountries.map(c => (
                          <button key={c.code} onClick={() => { setSelectedCountry(c); setSendStep(2); setSearchQ(""); }}
                            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#fff", borderRadius: 16, border: selectedCountry?.code === c.code ? "2px solid #C7522A" : "1.5px solid #E5E7EB", cursor: "pointer", textAlign: "left" }}>
                            <span style={{ fontSize: 28 }}>{c.flag}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{c.name}</p>
                              <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>1 USD = {c.symbol}{c.rate.toLocaleString()} · {c.currencyName}</p>
                            </div>
                            {selectedCountry?.code === c.code && <span style={{ color: "#C7522A", fontSize: 18 }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Recipient & Amount */}
                  {sendStep === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {selectedCountry && (
                        <div style={{ background: "#fff8f5", border: "1.5px solid #FECACA", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 24 }}>{selectedCountry.flag}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#C7522A" }}>{selectedCountry.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>1 USD = {selectedCountry.symbol}{selectedCountry.rate.toLocaleString()} {selectedCountry.currencyName}</p>
                          </div>
                          <button onClick={() => setSendStep(1)} style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Change</button>
                        </div>
                      )}

                      <div>
                        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#374151" }}>Quick Select</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {DEMO_CONTACTS.filter(c => !selectedCountry || c.country === selectedCountry.code || true).slice(0,3).map(c => (
                            <button key={c.name} onClick={() => { setSelectedContact(c); setSendPhone(""); setSendPhoneVerified(true); setSendPhoneError(""); }}
                              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: selectedContact?.name === c.name ? "#fff8f5" : "#fff", borderRadius: 14, border: selectedContact?.name === c.name ? "2px solid #C7522A" : "1.5px solid #E5E7EB", cursor: "pointer", textAlign: "left" }}>
                              <div style={{ width: 38, height: 38, borderRadius: "50%", background: avatarColor(c.name), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>{c.avatar}</div>
                              <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>{c.name}</p>
                                <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{c.phone} · {c.network}</p>
                              </div>
                              {selectedContact?.name === c.name && <span style={{ color: "#C7522A" }}>✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#374151" }}>Or enter phone number</p>
                        <input value={sendPhone} onChange={e => { setSendPhone(e.target.value); setSendPhoneVerified(false); setSendPhoneError(""); setSelectedContact(null); }} placeholder="+254700000000" style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1.5px solid #E5E7EB", fontSize: 14, background: "#fff", boxSizing: "border-box", outline: "none" }} />
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                          <button onClick={verifySendPhone} style={{ background: sendPhoneVerified ? "#16a34a" : "#C7522A", color: "#fff", border: "none", borderRadius: 14, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
                            {sendPhoneVerified ? "Verified" : "Verify"}
                          </button>
                          {sendPhoneVerified && <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>Phone confirmed</span>}
                        </div>
                        {sendPhoneError && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#b91c1c" }}>{sendPhoneError}</p>}
                      </div>

                      <div>
                        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#374151" }}>Receiving method</p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button onClick={() => { setRecipientMethod("mobileMoney"); setSelectedNetwork(null); setRecipientCardVerified(false); }}
                            style={{ flex: 1, minWidth: 140, padding: "12px 14px", borderRadius: 20, border: recipientMethod === "mobileMoney" ? "2px solid #C7522A" : "1.5px solid #E5E7EB", background: recipientMethod === "mobileMoney" ? "#FFEEE8" : "#fff", cursor: "pointer", textAlign: "left" }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Mobile Money</p>
                            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#6B7280" }}>Recipient receives on a mobile wallet</p>
                          </button>
                          <button onClick={() => { setRecipientMethod("creditCard"); setSelectedNetwork("Visa / Mastercard"); setSendPhoneVerified(false); }}
                            style={{ flex: 1, minWidth: 140, padding: "12px 14px", borderRadius: 20, border: recipientMethod === "creditCard" ? "2px solid #2D5016" : "1.5px solid #E5E7EB", background: recipientMethod === "creditCard" ? "#ECFDF5" : "#fff", cursor: "pointer", textAlign: "left" }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Credit / Debit Card</p>
                            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#6B7280" }}>Send directly to a card payout</p>
                          </button>
                        </div>
                      </div>

                      {recipientMethod === "mobileMoney" ? (
                        <>
                          <div>
                            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#374151" }}>Network</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                              {Object.entries(NETWORKS).filter(([n]) => n !== "Visa / Mastercard").map(([name, net]) => (
                                <button key={name} onClick={() => setSelectedNetwork(name)}
                                  style={{ padding: "8px 12px", borderRadius: 20, border: selectedNetwork === name ? `2px solid ${net.color}` : "1.5px solid #E5E7EB", background: selectedNetwork === name ? net.color + "22" : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#374151" }}>
                                  {net.icon} {name.split(" ")[0]}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#374151" }}>Or enter phone number</p>
                            <input value={sendPhone} onChange={e => { setSendPhone(e.target.value); setSendPhoneVerified(false); setSendPhoneError(""); setSelectedContact(null); }} placeholder="+254700000000" style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1.5px solid #E5E7EB", fontSize: 14, background: "#fff", boxSizing: "border-box", outline: "none" }} />
                            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                              <button onClick={verifySendPhone} style={{ background: sendPhoneVerified ? "#16a34a" : "#C7522A", color: "#fff", border: "none", borderRadius: 14, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
                                {sendPhoneVerified ? "Verified" : "Verify"}
                              </button>
                              {sendPhoneVerified && <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>Phone confirmed</span>}
                            </div>
                            {sendPhoneError && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#b91c1c" }}>{sendPhoneError}</p>}
                          </div>
                        </>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "#fff", borderRadius: 14, padding: 16, border: "1.5px solid #E5E7EB" }}>
                          <div>
                            <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Cardholder name</p>
                            <input value={recipientCardName} onChange={e => { setRecipientCardName(e.target.value); setRecipientCardVerified(false); setRecipientCardError(""); }} placeholder="Name on card" style={{ width: "100%", border: "none", outline: "none", fontSize: 16, fontWeight: 700, background: "transparent" }} />
                          </div>
                          <div>
                            <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Card number</p>
                            <input value={recipientCardNum} onChange={e => setRecipientCardNum(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())} placeholder="0000 0000 0000 0000" style={{ width: "100%", border: "none", outline: "none", fontSize: 18, fontWeight: 700, letterSpacing: 2, background: "transparent" }} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1.5px solid #E5E7EB" }}>
                              <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Expiry</p>
                              <input value={recipientCardExpiry} onChange={e => { setRecipientCardExpiry(e.target.value); setRecipientCardVerified(false); setRecipientCardError(""); }} placeholder="MM/YY" style={{ width: "100%", border: "none", outline: "none", fontSize: 16, fontWeight: 700, background: "transparent" }} />
                            </div>
                            <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1.5px solid #E5E7EB" }}>
                              <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>CVV</p>
                              <input value={recipientCardCvv} onChange={e => { setRecipientCardCvv(e.target.value.replace(/\D/g, "").slice(0,4)); setRecipientCardVerified(false); setRecipientCardError(""); }} placeholder="•••" type="password" maxLength={4} style={{ width: "100%", border: "none", outline: "none", fontSize: 16, fontWeight: 700, background: "transparent" }} />
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button onClick={verifyRecipientCard} style={{ background: recipientCardVerified ? "#16a34a" : "#2D5016", color: "#fff", border: "none", borderRadius: 14, padding: "12px 16px", fontWeight: 700, cursor: "pointer" }}>
                              {recipientCardVerified ? "Card Verified" : "Verify Card"}
                            </button>
                            {recipientCardVerified && <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>Verified</span>}
                          </div>
                          {recipientCardError && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#b91c1c" }}>{recipientCardError}</p>}
                        </div>
                      )}

                      <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1.5px solid #E5E7EB" }}>
                        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#374151" }}>Amount to send ({homeCountry.currency})</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 24, fontWeight: 800, color: "#C7522A" }}>{homeCountry.symbol}</span>
                          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" min="1"
                            style={{ flex: 1, border: "none", outline: "none", fontSize: 32, fontWeight: 800, color: "#1a1a1a", background: "transparent" }} />
                        </div>
                        {amount && selectedCountry && (
                          <div style={{ marginTop: 8, padding: "8px 12px", background: "#F0FDF4", borderRadius: 10, display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 12, color: "#6B7280" }}>Recipient gets</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: "#2D5016" }}>{receivedDisplay}</span>
                          </div>
                        )}
                        <p style={{ margin: "8px 0 0", fontSize: 11, color: "#9CA3AF" }}>Fee: {homeCountry.symbol}0.00 · Balance: {homeCountry.symbol}{homeBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                      </div>

                      {/* Quick amounts */}
                      <div style={{ display: "flex", gap: 8 }}>
                        {[50, 100, 250, 500].map(a => (
                          <button key={a} onClick={() => setAmount(String(a))} style={{ flex: 1, padding: "10px 4px", background: amount == a ? "#C7522A" : "#fff", border: "1.5px solid " + (amount == a ? "#C7522A" : "#E5E7EB"), borderRadius: 12, fontSize: 13, fontWeight: 700, color: amount == a ? "#fff" : "#374151", cursor: "pointer" }}>{homeCountry.symbol}{a}</button>
                        ))}
                      </div>

                      <button onClick={() => { if (!amount || parseFloat(amount) <= 0) { toast("Enter a valid amount", "error"); return; } setSendStep(3); }}
                        style={{ background: "#C7522A", color: "#fff", border: "none", borderRadius: 16, padding: "16px", fontSize: 16, fontWeight: 800, cursor: "pointer", width: "100%" }}>
                        Continue →
                      </button>
                    </div>
                  )}

                  {/* Step 3: Confirm + PIN */}
                  {sendStep === 3 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1.5px solid #E5E7EB" }}>
                        <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 800, color: "#1a1a1a" }}>Transfer Summary</p>
                        {[
                          ["Sending", `${homeCountry.symbol}${parseFloat(amount).toLocaleString()} ${homeCountry.currency}`],
                          ["To", recipientMethod === "creditCard" ? `Card •${recipientCardNum.slice(-4)} ${selectedCountry?.flag}` : selectedContact ? `${selectedContact.name} ${selectedCountry?.flag}` : `${sendPhone || "—"} ${selectedCountry?.flag}`],
                          ["Network", recipientMethod === "creditCard" ? "Visa / Mastercard" : selectedNetwork || selectedContact?.network || "—"],
                          ["Recipient gets", `${receivedDisplay}`],
                          ["Fee", `${homeCountry.symbol}0.00`],
                          ["Total deducted", `${homeCountry.symbol}${parseFloat(amount).toLocaleString()} ${homeCountry.currency}`],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F5F5F5" }}>
                            <span style={{ fontSize: 13, color: "#6B7280" }}>{k}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{v}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1.5px solid #E5E7EB" }}>
                        <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Enter your 4-digit PIN</p>
                        <p style={{ margin: "0 0 12px", fontSize: 11, color: "#9CA3AF" }}>Demo PIN: 1234</p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16 }}>
                          {[0,1,2,3].map(i => (
                            <div key={i} style={{ width: 48, height: 56, borderRadius: 12, border: `2px solid ${pinError ? "#ef4444" : pin.length > i ? "#C7522A" : "#E5E7EB"}`, background: pin.length > i ? "#fff8f5" : "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "#C7522A", transition: "all 0.2s" }}>
                              {pin.length > i ? "•" : ""}
                            </div>
                          ))}
                        </div>
                        {/* Keypad */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
                            <button key={i} onClick={() => {
                              if (!k) return;
                              if (k === "⌫") setPin(p => p.slice(0,-1));
                              else if (pin.length < 4) setPin(p => p + k);
                            }} style={{ padding: "14px", background: k ? "#F9FAFB" : "transparent", border: k ? "1.5px solid #E5E7EB" : "none", borderRadius: 14, fontSize: 20, fontWeight: 700, color: "#1a1a1a", cursor: k ? "pointer" : "default" }}>
                              {k}
                            </button>
                          ))}
                        </div>
                      </div>

                      {!isOnline && (
                        <div style={{ background: "#fef3c7", border: "1.5px solid #fcd34d", borderRadius: 12, padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#92400e", textAlign: "center" }}>
                          📵 You're offline. Transfer will be queued and sent automatically when you reconnect.
                        </div>
                      )}

                      <button onClick={handleSend}
                        style={{ background: pin.length === 4 ? "#C7522A" : "#E5E7EB", color: pin.length === 4 ? "#fff" : "#9CA3AF", border: "none", borderRadius: 16, padding: "16px", fontSize: 16, fontWeight: 800, cursor: pin.length === 4 ? "pointer" : "not-allowed", width: "100%", transition: "all 0.2s" }}>
                        {isOnline ? "✓ Confirm & Send" : "⏳ Queue Transfer"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LOAD SCREEN */}
            {screen === "load" && (
              <div>
                <div style={{ background: "linear-gradient(160deg, #2D5016, #4A7C23)", padding: "24px 24px 32px", borderRadius: "32px 32px 0 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => { setScreen("home"); setActiveTab("home"); setLoadStep(1); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, width: 36, height: 36, color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: 12 }}>Step {loadStep} of 2</p>
                      <p style={{ color: "#fff", margin: 0, fontSize: 18, fontWeight: 700 }}>Load Wallet</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
                    {[1,2].map(s => <div key={s} style={{ height: 4, borderRadius: 4, background: s <= loadStep ? "#fff" : "rgba(255,255,255,0.3)", flex: s === loadStep ? 2 : 1, transition: "flex 0.3s" }} />)}
                  </div>
                </div>

                <div style={{ padding: "20px", paddingBottom: 90 }}>
                  {loadStep === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Choose payment method</p>
                      {Object.entries(NETWORKS).map(([name, net]) => (
                        <button key={name} onClick={() => { setLoadNetwork(name); setLoadStep(2); }}
                          style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "#fff", borderRadius: 16, border: loadNetwork === name ? `2px solid ${net.color}` : "1.5px solid #E5E7EB", cursor: "pointer", textAlign: "left" }}>
                          <div style={{ width: 44, height: 44, borderRadius: 14, background: net.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{net.icon}</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>
                              {name === "Visa / Mastercard" ? "Debit or Credit card" : `Mobile money · ${net.countries.length} countries`}
                            </p>
                          </div>
                          <span style={{ color: "#D1D5DB" }}>›</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {loadStep === 2 && loadNetwork && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ background: NETWORKS[loadNetwork]?.color + "22", border: `1.5px solid ${NETWORKS[loadNetwork]?.color}66`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 24 }}>{NETWORKS[loadNetwork]?.icon}</span>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>{loadNetwork}</p>
                          <button onClick={() => setLoadStep(1)} style={{ background: "none", border: "none", color: "#C7522A", fontSize: 11, cursor: "pointer", padding: 0, fontWeight: 600 }}>← Change</button>
                        </div>
                      </div>

                      {loadNetwork === "Visa / Mastercard" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1.5px solid #E5E7EB" }}>
                            <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Card Number</p>
                            <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())}
                              placeholder="0000 0000 0000 0000" style={{ width: "100%", border: "none", outline: "none", fontSize: 18, fontWeight: 700, letterSpacing: 2, background: "transparent", boxSizing: "border-box" }} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1.5px solid #E5E7EB" }}>
                              <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Expiry</p>
                              <input value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" style={{ width: "100%", border: "none", outline: "none", fontSize: 16, fontWeight: 700, background: "transparent" }} />
                            </div>
                            <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1.5px solid #E5E7EB" }}>
                              <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>CVV</p>
                              <input value={loadCvv} onChange={e => setLoadCvv(e.target.value.replace(/\D/g, "").slice(0,4))} placeholder="•••" type="password" maxLength={4} style={{ width: "100%", border: "none", outline: "none", fontSize: 16, fontWeight: 700, background: "transparent" }} />
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button onClick={verifyLoadDestination} style={{ background: cardVerified ? "#16a34a" : "#2D5016", color: "#fff", border: "none", borderRadius: 14, padding: "12px 16px", fontWeight: 700, cursor: "pointer" }}>
                              {cardVerified ? "Card Verified" : "Verify Card"}
                            </button>
                            {cardVerified && <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>Verified</span>}
                          </div>
                          {cardError && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#b91c1c" }}>{cardError}</p>}
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1.5px solid #E5E7EB" }}>
                          <div>
                            <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Mobile Money Number</p>
                            <input value={loadPhone} onChange={e => { setLoadPhone(e.target.value); setLoadPhoneVerified(false); setLoadPhoneError(""); }} placeholder="+233240000000" style={{ width: "100%", border: "none", outline: "none", fontSize: 18, fontWeight: 700, background: "transparent" }} />
                          </div>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button onClick={verifyLoadDestination} style={{ background: loadPhoneVerified ? "#16a34a" : "#2D5016", color: "#fff", border: "none", borderRadius: 14, padding: "12px 16px", fontWeight: 700, cursor: "pointer" }}>
                              {loadPhoneVerified ? "Verified" : "Verify number"}
                            </button>
                            {loadPhoneVerified && <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>Verified</span>}
                          </div>
                          {loadPhoneError && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#b91c1c" }}>{loadPhoneError}</p>}
                        </div>
                      )}

                      <div style={{ background: "#fff", borderRadius: 16, padding: 16, border: "1.5px solid #E5E7EB" }}>
                        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "#374151" }}>Amount ({homeCountry.currency})</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <span style={{ fontSize: 24, fontWeight: 800, color: "#2D5016" }}>{homeCountry.symbol}</span>
                          <input type="number" value={loadAmount} onChange={e => setLoadAmount(e.target.value)} placeholder="0.00" min="1"
                            style={{ flex: 1, border: "none", outline: "none", fontSize: 32, fontWeight: 800, color: "#1a1a1a", background: "transparent" }} />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {[1000, 2500, 5000, 10000].map(a => (
                            <button key={a} onClick={() => setLoadAmount(String(a))} style={{ flex: 1, padding: "10px 4px", background: loadAmount == a ? "#2D5016" : "#F9FAFB", border: "1.5px solid " + (loadAmount == a ? "#2D5016" : "#E5E7EB"), borderRadius: 12, fontSize: 13, fontWeight: 700, color: loadAmount == a ? "#fff" : "#374151", cursor: "pointer" }}>{homeCountry.symbol}{a.toLocaleString()}</button>
                          ))}
                        </div>
                      </div>

                      <button onClick={handleLoad}
                        style={{ background: loadAmount ? "#2D5016" : "#E5E7EB", color: loadAmount ? "#fff" : "#9CA3AF", border: "none", borderRadius: 16, padding: "16px", fontSize: 16, fontWeight: 800, cursor: loadAmount ? "pointer" : "not-allowed", width: "100%", transition: "all 0.2s" }}>
                        ↙ Load {loadAmount ? `${homeCountry.symbol}${parseFloat(loadAmount).toLocaleString()}` : "0"} to Wallet
                      </button>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                        <span style={{ fontSize: 16 }}>🔒</span>
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>256-bit encrypted · PCI DSS compliant · SSL secured</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HISTORY SCREEN */}
            {screen === "history" && (
              <div>
                <div style={{ background: "linear-gradient(160deg, #1d3461, #2e5fa3)", padding: "24px 24px 32px", borderRadius: "32px 32px 0 0" }}>
                  <p style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 4px", fontSize: 13 }}>All Transactions</p>
                  <p style={{ color: "#fff", margin: 0, fontSize: 24, fontWeight: 800 }}>Activity</p>
                </div>
                <div style={{ padding: "20px", paddingBottom: 90 }}>
                  {TRANSACTIONS.map(tx => (
                    <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid #F0EDE8" }}>
                      <div style={{ width: 46, height: 46, borderRadius: "50%", background: tx.type === "loaded" ? "#2D5016" : "#C7522A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                        {tx.type === "loaded" ? "💳" : tx.flag}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{tx.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{tx.date}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>{tx.network}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: tx.type === "loaded" ? "#2D5016" : "#C7522A" }}>
                          {tx.type === "loaded" ? "+" : "-"}${tx.amount}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6B7280" }}>{tx.received}</p>
                        <span style={{ fontSize: 10, fontWeight: 700, color: tx.status === "completed" ? "#16a34a" : "#d97706", background: tx.status === "completed" ? "#dcfce7" : "#fef3c7", padding: "2px 8px", borderRadius: 8 }}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {offlineQueue.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>⏳ Pending (offline queue)</p>
                      {offlineQueue.map((tx, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#fef3c7", borderRadius: 14, marginBottom: 8 }}>
                          <span style={{ fontSize: 20 }}>{tx.country?.flag}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{tx.contact?.name || "Unknown"}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#92400e" }}>Will send when online</p>
                          </div>
                          <span style={{ fontWeight: 800, color: "#C7522A" }}>-${tx.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROFILE SCREEN */}
            {screen === "profile" && (
              <div>
                <div style={{ background: "linear-gradient(160deg, #4A1942, #7338AC)", padding: "24px 24px 48px", borderRadius: "32px 32px 0 0" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#C7522A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 28, border: "3px solid rgba(255,255,255,0.3)" }}>SW</div>
                    <p style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: 0 }}>{userProfile.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}>{userProfile.phone} · Verified ✓</p>
                  </div>
                </div>
                <div style={{ margin: "-24px 20px 0", background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Sent", value: "225", color: "#C7522A" },
                      { label: "Countries", value: "4", color: "#2D5016" },
                      { label: "Balance", value: `${homeCountry.symbol}${homeBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "#7338AC" },
                    ].map(s => (
                      <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "20px", paddingBottom: 90 }}>
                  <div style={{ background: "#fff8f5", borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#C7522A" }}>{homeCountry.flag} {homeCountry.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>{homeCountry.currency} • {homeCountry.symbol}</p>
                    </div>
                    <button onClick={() => setHomeCountry(null)} style={{ background: "#C7522A", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Change</button>
                  </div>
                  {[
                    { icon: "🌍", label: "Supported Countries", sub: "20 African nations" },
                    { icon: "📶", label: "Offline Mode", sub: isOnline ? "Online" : "Offline — transfers queued" },
                    { icon: "🔒", label: "Security & PIN", sub: "4-digit PIN protected" },
                    { icon: "📱", label: "Linked Networks", sub: "MTN, Airtel, M-Pesa, Wave + 5 more" },
                    { icon: "💬", label: "Help & Support", sub: "24/7 via WhatsApp & Chat" },
                    { icon: "📊", label: "Transaction Limits", sub: `${homeCountry.symbol}500K/day · ${homeCountry.symbol}2.5M/month` },
                    { icon: "💱", label: "Exchange Rates", sub: `Live rates${exchangeRates ? " (live)" : " (cached)"}` },
                  ].map(item => (
                    <button key={item.label} onClick={() => toast(`${item.label} settings`, "info")}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", background: "transparent", border: "none", borderBottom: "1px solid #F0EDE8", cursor: "pointer", width: "100%", textAlign: "left" }}>
                      <span style={{ fontSize: 22 }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{item.label}</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{item.sub}</p>
                      </div>
                      <span style={{ color: "#D1D5DB", fontSize: 18 }}>›</span>
                    </button>
                  ))}

                  <div style={{ marginTop: 16, padding: "12px 16px", background: isOnline ? "#dcfce7" : "#fef3c7", borderRadius: 14, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{isOnline ? "🟢" : "🟡"}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: isOnline ? "#15803d" : "#92400e" }}>{isOnline ? "Connected" : "Offline Mode Active"}</p>
                      <p style={{ margin: 0, fontSize: 11, color: isOnline ? "#16a34a" : "#b45309" }}>{isOnline ? "All features available" : `${offlineQueue.length} transfers queued`}</p>
                    </div>
                    <button onClick={() => { setIsOnline(o => !o); toast(isOnline ? "Switched to offline mode" : "Back online!", "info"); }}
                      style={{ background: isOnline ? "#15803d" : "#d97706", border: "none", color: "#fff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {isOnline ? "Go Offline" : "Go Online"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom nav */}
            <div style={{ position: "sticky", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", padding: "8px 0 20px" }}>
              {[
                { id: "home", icon: "⌂", label: "Home" },
                { id: "send", icon: "↗", label: "Send" },
                { id: "history", icon: "↺", label: "History" },
                { id: "load", icon: "↙", label: "Load" },
                { id: "profile", icon: "◉", label: "Profile" },
              ].map(tab => (
                <button key={tab.id} onClick={() => nav(tab.id)}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0" }}>
                  <span style={{ fontSize: 20, color: activeTab === tab.id ? "#C7522A" : "#9CA3AF", transition: "color 0.2s" }}>{tab.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: activeTab === tab.id ? "#C7522A" : "#9CA3AF", transition: "color 0.2s" }}>{tab.label}</span>
                  {activeTab === tab.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C7522A" }} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Brand tag below phone */}
        <div style={{ textAlign: "center", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #C7522A, #E07B4A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12 }}>SW</div>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: "var(--color-text-primary)" }}>Sendwave Africa</p>
            <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Pan-African Money Transfer · 20 Countries · 9 Networks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Sendwave = Sendwave;
