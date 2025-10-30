
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Poppins', 'Inter', 'sans-serif'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '300' }],
				'sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '300' }],
				'base': ['1rem', { lineHeight: '1.5', fontWeight: '300' }],
				'lg': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],
				'xl': ['1.25rem', { lineHeight: '1.5', fontWeight: '400' }],
				'2xl': ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }],
				'3xl': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
				'4xl': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
				'5xl': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				terex: {
					dark: '#141414',
					darker: '#1e1e1e',
					accent: '#3B968F',
					'accent-light': '#4BA89F',
					gray: '#2A2A2A',
					'gray-light': '#3A3A3A',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			},
			typography: {
				DEFAULT: {
					css: {
						'--tw-prose-body': 'hsl(0 0% 80%)',
						'--tw-prose-headings': 'hsl(0 0% 95%)',
						'--tw-prose-links': 'hsl(142.1 76.2% 36.3%)',
						'--tw-prose-bold': 'hsl(0 0% 95%)',
						'--tw-prose-code': 'hsl(142.1 76.2% 36.3%)',
						'--tw-prose-quotes': 'hsl(0 0% 80%)',
						h2: {
							fontWeight: '400',
							marginTop: '2em',
							marginBottom: '1em',
						},
						h3: {
							fontWeight: '400',
							marginTop: '1.6em',
							marginBottom: '0.6em',
						},
						a: {
							fontWeight: '400',
							textDecoration: 'underline',
							'&:hover': {
								color: 'hsl(142.1 76.2% 46.3%)',
							},
						},
						code: {
							backgroundColor: 'hsl(240 3.7% 15.9%)',
							padding: '0.25rem 0.375rem',
							borderRadius: '0.25rem',
							fontWeight: '400',
						},
						strong: {
							fontWeight: '500',
						},
					},
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
