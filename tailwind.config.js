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
  		animation: {
  			'wiggle': 'wiggle 0.5s ease-in-out',
  			'float': 'float 2s ease-in-out infinite',
  			'glow': 'glow 1.5s ease-in-out infinite',
  			'drop-zone-glow': 'dropZoneGlow 1s ease-in-out infinite',
  			'drop-success': 'dropSuccess 0.4s ease-in-out',
  			'bounce-invalid': 'bounce 0.6s ease-in-out',
  		},
  		keyframes: {
  			wiggle: {
  				'0%, 7%': { transform: 'rotateZ(0)' },
  				'15%': { transform: 'rotateZ(-15deg)' },
  				'20%': { transform: 'rotateZ(10deg)' },
  				'25%': { transform: 'rotateZ(-10deg)' },
  				'30%': { transform: 'rotateZ(6deg)' },
  				'35%': { transform: 'rotateZ(-4deg)' },
  				'40%, 100%': { transform: 'rotateZ(0)' },
  			},
  			float: {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-10px)' },
  			},
  			glow: {
  				'0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
  				'50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' },
  			},
  			dropZoneGlow: {
  				'0%, 100%': { boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.3)' },
  				'50%': { boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.6)' },
  			},
  			dropSuccess: {
  				'0%': { transform: 'scale(1)' },
  				'50%': { transform: 'scale(1.1)' },
  				'100%': { transform: 'scale(1)' },
  			},
  			bounce: {
  				'0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0, 0, 0)' },
  				'40%, 43%': { transform: 'translate3d(0, -10px, 0)' },
  				'70%': { transform: 'translate3d(0, -5px, 0)' },
  				'90%': { transform: 'translate3d(0, -2px, 0)' },
  			},
  		},
  		colors: {
  			primary: {
  				'30': 'var(--primary-30)',
  				'100': 'var(--primary)',
                '45': 'var(--primary-45)',
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
                    'mask-size': 'contain',
                    '-webkit-mask-size': 'contain',
                    'mask-position': 'center',
                    '-webkit-mask-position': 'center'
                },
                '.scrollbar-hide': {
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }
            })
        }
    ],
}
