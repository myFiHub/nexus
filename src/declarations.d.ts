// TypeScript module declaration for importing PNG files
// Allows import podiumLogo from '../../assets/images/podiumNexuslogo.png';
declare module '*.png' {
  const value: string;
  export default value;
} 