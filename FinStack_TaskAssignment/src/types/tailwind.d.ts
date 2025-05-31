declare module 'tailwindcss' {
  export interface Config {
    darkMode?: string | string[];
    content?: string[];
    theme?: {
      extend?: {
        colors?: Record<string, any>;
        fontFamily?: Record<string, any>;
        borderRadius?: Record<string, any>;
        keyframes?: Record<string, any>;
        animation?: Record<string, any>;
      };
      container?: {
        center?: boolean;
        padding?: string;
        screens?: Record<string, string>;
      };
    };
    plugins?: any[];
  }
}

declare module 'tailwindcss/defaultTheme' {
  const defaultTheme: {
    fontFamily: {
      sans: string[];
      mono: string[];
    };
  };
  export default defaultTheme;
}

declare module 'tailwindcss-animate' {
  const animate: any;
  export default animate;
}

declare module '@tailwindcss/typography' {
  const typography: any;
  export default typography;
}

declare module '@tailwindcss/forms' {
  const forms: any;
  export default forms;
} 