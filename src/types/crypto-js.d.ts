declare module "crypto-js/sha256" {
  const sha256: (message: string) => { toString: () => string };
  export default sha256;
}
