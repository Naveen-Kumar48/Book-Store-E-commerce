exports.maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!domain) return email;

    let maskedName;
    if (name.length <= 3) {
        maskedName = name.charAt(0) + "*".repeat(name.length - 1);
    } else {
        maskedName = name.substring(0, 3) + "*".repeat(name.length - 3);
    }

    return `${maskedName}@${domain}`;
};
