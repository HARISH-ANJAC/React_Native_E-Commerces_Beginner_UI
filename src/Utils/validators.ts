export const isValidEmail = (email: string) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

export const isValidPassword = (pw: string) => pw.length >= 6;
export const isValidUsername = (username: string) => username.length >= 3;
export const isValidName = (name: string) => name.length >= 2;
export const isValidPhone = (phone: string) => {
  const re = /^\d{10}$/;
  return re.test(phone);
}