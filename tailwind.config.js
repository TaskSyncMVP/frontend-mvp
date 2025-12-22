/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/entities/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontSize: {
  			xs: 'var(--text-xs)',
  			sm: 'var(--text-sm)',
  			base: 'var(--text-base)',
  			lg: 'var(--text-lg)',
  			xl: 'var(--text-xl)',
  			'2xl': 'var(--text-2xl)'
  		},
  		colors: {
  			primary: {
  				'30': 'var(--primary-30)',
  				'100': 'var(--primary)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},

  			text: {
  				primary: 'var(--text-primary)',
  				main: 'var(--text-main)',
  				secondary: 'var(--text-secondary)',
                muted: 'var(--text-muted)',
  			},

  			/* Уровни задач */
  			'level-task': {
  				medium: {
  					text: 'var(--level-task-medium-text)',
  					bg: 'var(--level-task-medium-bg)'
  				},
  				high: {
  					text: 'var(--level-task-high-text)',
  					bg: 'var(--level-task-high-bg)'
  				},
  				low: {
  					text: 'var(--level-task-low-text)',
  					bg: 'var(--level-task-low-bg)'
  				}
  			},

  			/* Pomodoro */
  			pomodoro: {
  				timer: 'var(--pomodoro-timer)',
  				background: 'var(--pomodoro-timer-background)'
  			},

  			/* Shadcn/ui совместимые цвета */
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			muted: 'var(--muted)',

  			/* Компоненты UI */
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',

  			/* Карточки и поповеры */
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},

  			/* Акценты и состояния */
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			}
  		},
  		borderRadius: {
  			soft: 'var(--soft-radius)',
  			large: 'var(--large-radius)',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			drop: 'var(--drop-shadow-length) var(--drop-shadow)',
  			largeDrop: 'var(--large-drop-shadow-length) var(--large-drop-shadow)',
  			extraLargeDrop: 'var(--extra-large-drop-shadow-length) var(--extra-large-drop-shadow)'
  		},
  		backgroundColor: {
  			'modal-overlay': 'rgba(0, 0, 0, var(--bg-opacity))'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      addUtilities({
        '.mask1': {
          '-webkit-mask-image': 'url(/buttonForm.svg)',
          'mask-image': 'url(/buttonForm.svg)',
          'mask-repeat': 'no-repeat',
          'mask-size': '100% 100%',
          '-webkit-mask-size': '100% 100%'
        }
      })
    }
  ],
}
