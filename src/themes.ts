export type Theme = {
    id: string;
    name: string;
    vectorLabel?: string;
    googleFontUrl?: string;
    vars: {
        '--bg-color': string;
        '--surface-color': string;
        '--panel-border': string;
        '--text-main': string;
        '--text-muted': string;
        '--accent-cyan': string;
        '--accent-magenta': string;
        '--accent-yellow': string;
        '--accent-green': string;
        '--font-mono': string;
        '--font-sans': string;
        '--radius': string;
        '--shadow-glow': string;
        '--ticket-bg': string;
        '--ball-bg': string;
        '--ball-border': string;
        '--ball-color': string;
        '--workspace-bg'?: string;
        '--bg-pattern'?: string;
        '--bg-pattern-size'?: string;
        '--bg-blend'?: string;
    };
};

export const themes: Theme[] = [
    {
        id: 'quant-terminal',
        name: '1. Quant Terminal',
        vectorLabel: 'Target Vector',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700;900&display=swap',
        vars: {
            '--bg-color': '#050505',
            '--surface-color': '#0a0a0c',
            '--panel-border': '#1a1a24',
            '--text-main': '#e0e5ff',
            '--text-muted': '#6b7280',
            '--accent-cyan': '#00f0ff',
            '--accent-magenta': '#ff003c',
            '--accent-yellow': '#f0e68c',
            '--accent-green': '#00ff88',
            '--font-mono': '"JetBrains Mono", "Fira Code", monospace',
            '--font-sans': '"Inter", system-ui, sans-serif',
            '--radius': '4px',
            '--shadow-glow': '0 0 10px rgba(0, 240, 255, 0.2)',
            '--ticket-bg': 'rgba(0, 0, 0, 0.5)',
            '--ball-bg': '#ffffff',
            '--ball-border': '#ffffff',
            '--ball-color': '#000000',
            '--bg-pattern': 'radial-gradient(rgba(0, 240, 255, 0.15) 1px, transparent 1px)',
            '--bg-pattern-size': '24px 24px',
        }
    },
    {
        id: '8-bit-arcade',
        name: '2. 8-Bit Arcade',
        vectorLabel: 'Game Select',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
        vars: {
            '--bg-color': '#111111',
            '--surface-color': '#222244',
            '--panel-border': '#ff0055',
            '--text-main': '#ffffff',
            '--text-muted': '#aaaaaa',
            '--accent-cyan': '#00ffff',
            '--accent-magenta': '#ff00ff',
            '--accent-yellow': '#ffff00',
            '--accent-green': '#00ff00',
            '--font-mono': '"Press Start 2P", monospace, "Courier New"',
            '--font-sans': '"Press Start 2P", monospace',
            '--radius': '0px',
            '--shadow-glow': 'none',
            '--ticket-bg': '#000000',
            '--ball-bg': '#000000',
            '--ball-border': '#ffffff',
            '--ball-color': '#ffffff',
        }
    },
    {
        id: 'casino-royale',
        name: '3. Casino Royale',
        vectorLabel: 'Choose Table',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Playfair+Display:wght@400;700;900&display=swap',
        vars: {
            '--bg-color': '#1a0b0f',
            '--surface-color': '#281116',
            '--panel-border': '#d4af37', // Gold
            '--text-main': '#fdfbf7',
            '--text-muted': '#d4af37',
            '--accent-cyan': '#e5e4e2', // Platinum
            '--accent-magenta': '#c1121f', // Ruby
            '--accent-yellow': '#ffd700', // Gold
            '--accent-green': '#004b23', // Felt Green
            '--font-mono': '"Cormorant Garamond", "Times New Roman", serif',
            '--font-sans': '"Playfair Display", serif',
            '--radius': '2px',
            '--shadow-glow': '0 4px 12px rgba(212, 175, 55, 0.1)',
            '--ticket-bg': '#14080a',
            '--ball-bg': '#d4af37',
            '--ball-border': '#ffd700',
            '--ball-color': '#000000',
        }
    },
    {
        id: 'vaporwave',
        name: '4. Vaporwave',
        vectorLabel: 'Virtual Domain',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syncopate:wght@400;700&display=swap',
        vars: {
            '--bg-color': '#2b1055',
            '--surface-color': '#1a0833',
            '--panel-border': '#ff71ce',
            '--text-main': '#01cdfe',
            '--text-muted': '#b967ff',
            '--accent-cyan': '#05ffa1',
            '--accent-magenta': '#ff71ce',
            '--accent-yellow': '#fffb96',
            '--accent-green': '#05ffa1',
            '--font-mono': '"Space Mono", monospace',
            '--font-sans': '"Syncopate", sans-serif',
            '--radius': '0px',
            '--shadow-glow': '4px 4px 0px #ff71ce',
            '--ticket-bg': '#1a0833',
            '--ball-bg': '#ff71ce',
            '--ball-border': '#01cdfe',
            '--ball-color': '#ffffff',
            '--workspace-bg': 'linear-gradient(180deg, #2b1055 0%, #752277 100%)',
            '--bg-pattern': 'linear-gradient(transparent 95%, rgba(255, 113, 206, 0.3) 100%), linear-gradient(90deg, transparent 95%, rgba(1, 205, 254, 0.3) 100%)',
            '--bg-pattern-size': '40px 40px',
        }
    },
    {
        id: 'e-ink',
        name: '5. E-Ink Reader',
        vectorLabel: 'Active Chapter',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Lora:wght@400;700&display=swap',
        vars: {
            '--bg-color': '#f4f4f4',
            '--surface-color': '#ffffff',
            '--panel-border': '#333333',
            '--text-main': '#111111',
            '--text-muted': '#555555',
            '--accent-cyan': '#222222',
            '--accent-magenta': '#000000',
            '--accent-yellow': '#444444',
            '--accent-green': '#222222',
            '--font-mono': '"Courier Prime", "SF Mono", monospace',
            '--font-sans': '"Lora", serif',
            '--radius': '2px',
            '--shadow-glow': 'none',
            '--ticket-bg': '#ececec',
            '--ball-bg': '#ffffff',
            '--ball-border': '#111111',
            '--ball-color': '#111111',
        }
    },
    {
        id: 'cyberpunk-2077',
        name: '6. Cyberpunk',
        vectorLabel: 'Mainframe Link',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Teko:wght@400;600;700&display=swap',
        vars: {
            '--bg-color': '#000000',
            '--surface-color': '#080808',
            '--panel-border': '#fcee0a',
            '--text-main': '#d1d1d1',
            '--text-muted': '#00ff9f',
            '--accent-cyan': '#00ff9f',
            '--accent-magenta': '#ff003c',
            '--accent-yellow': '#fcee0a',
            '--accent-green': '#00ff9f',
            '--font-mono': '"Rajdhani", "Share Tech Mono", monospace',
            '--font-sans': '"Rajdhani", "Teko", sans-serif',
            '--radius': '0px',
            '--shadow-glow': '-4px 0 0 #ff003c, 4px 0 0 #00ff9f',
            '--ticket-bg': 'rgba(252, 238, 10, 0.05)',
            '--ball-bg': '#fcee0a',
            '--ball-border': '#ff003c',
            '--ball-color': '#000000',
        }
    },
    {
        id: 'blueprint',
        name: '7. Architectural Blueprint',
        vectorLabel: 'Project Scope',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Jura:wght@400;600;700&display=swap',
        vars: {
            '--bg-color': '#0f4c81',
            '--surface-color': '#0d406d',
            '--panel-border': '#4bb5d8',
            '--text-main': '#ffffff',
            '--text-muted': '#80cbea',
            '--accent-cyan': '#ffffff',
            '--accent-magenta': '#ffffff',
            '--accent-yellow': '#ffffff',
            '--accent-green': '#ffffff',
            '--font-mono': '"Architects Daughter", monospace',
            '--font-sans': '"Jura", sans-serif',
            '--radius': '0px',
            '--shadow-glow': 'none',
            '--ticket-bg': '#12548e',
            '--ball-bg': 'transparent',
            '--ball-border': '#ffffff',
            '--ball-color': '#ffffff',
            '--workspace-bg': '#0f4c81',
            '--bg-pattern': 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            '--bg-pattern-size': '50px 50px, 50px 50px, 10px 10px, 10px 10px',
        }
    },
    {
        id: 'glassmorphism',
        name: '8. Glassmorphism',
        vectorLabel: 'Select Application',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
        vars: {
            '--bg-color': '#f0f2f5',
            '--surface-color': 'rgba(255, 255, 255, 0.65)',
            '--panel-border': 'rgba(255, 255, 255, 0.9)',
            '--text-main': '#1c1e21',
            '--text-muted': '#606770',
            '--accent-cyan': '#1877f2',
            '--accent-magenta': '#f02849',
            '--accent-yellow': '#f5a623',
            '--accent-green': '#42b72a',
            '--font-mono': '"SF Mono", "Menlo", monospace',
            '--font-sans': '"Plus Jakarta Sans", system-ui, sans-serif',
            '--radius': '24px',
            '--shadow-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
            '--ticket-bg': 'rgba(255, 255, 255, 0.85)',
            '--ball-bg': 'rgba(255, 255, 255, 0.9)',
            '--ball-border': 'rgba(255, 255, 255, 1)',
            '--ball-color': '#1c1e21',
        }
    },
    {
        id: 'terminal-green',
        name: '9. Monochrome Green',
        vectorLabel: 'System Node',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=VT323&display=swap',
        vars: {
            '--bg-color': '#001100',
            '--surface-color': '#000a00',
            '--panel-border': '#003300',
            '--text-main': '#33ff33',
            '--text-muted': '#009900',
            '--accent-cyan': '#33ff33',
            '--accent-magenta': '#33ff33',
            '--accent-yellow': '#33ff33',
            '--accent-green': '#33ff33',
            '--font-mono': '"VT323", "Courier New", monospace',
            '--font-sans': '"VT323", monospace',
            '--radius': '0px',
            '--shadow-glow': '0 0 5px #33ff33',
            '--ticket-bg': '#000500',
            '--ball-bg': '#001100',
            '--ball-border': '#33ff33',
            '--ball-color': '#33ff33',
        }
    },
    {
        id: 'neumorphism',
        name: '10. Neumorphism',
        vectorLabel: 'Game Type',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Nunito:wght@400;700;900&display=swap',
        vars: {
            '--bg-color': '#e0e5ec',
            '--surface-color': '#e0e5ec',
            '--panel-border': 'transparent',
            '--text-main': '#4a5568',
            '--text-muted': '#a0aec0',
            '--accent-cyan': '#3182ce',
            '--accent-magenta': '#e53e3e',
            '--accent-yellow': '#d69e2e',
            '--accent-green': '#38a169',
            '--font-mono': '"Fira Code", monospace',
            '--font-sans': '"Nunito", sans-serif',
            '--radius': '20px',
            '--shadow-glow': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
            '--ticket-bg': '#e0e5ec',
            '--ball-bg': '#e0e5ec',
            '--ball-border': 'transparent',
            '--ball-color': '#4a5568',
        }
    },
    {
        id: 'rose-all-day',
        name: '11. Rosé All Day',
        vectorLabel: 'Current Obsession',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap',
        vars: {
            '--bg-color': '#fcf5f7',
            '--surface-color': '#ffffff',
            '--panel-border': '#f4d1d6',
            '--text-main': '#5c4146',
            '--text-muted': '#b38d94',
            '--accent-cyan': '#b5d5c5', // Sage
            '--accent-magenta': '#dd8b95', // Rose
            '--accent-yellow': '#f3d3a5', // Champagne
            '--accent-green': '#a4b79e',
            '--font-mono': '"Playfair Display", serif',
            '--font-sans': '"Montserrat", sans-serif',
            '--radius': '16px',
            '--shadow-glow': '0 8px 24px rgba(221, 139, 149, 0.1)',
            '--ticket-bg': '#fffafb',
            '--ball-bg': '#fcf5f7',
            '--ball-border': '#eebbc3',
            '--ball-color': '#5c4146',
        }
    },
    {
        id: 'corporate-minimalist',
        name: '12. Corporate Professional',
        vectorLabel: 'Primary Asset',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
        vars: {
            '--bg-color': '#000000', // Deep Obsidian Black
            '--surface-color': '#0A0A0A',
            '--panel-border': '#222222',
            '--text-main': '#EDEDED',
            '--text-muted': '#888888',
            '--accent-cyan': '#0070F3', // Enterprise Blue
            '--accent-magenta': '#7928CA',
            '--accent-yellow': '#F5A623',
            '--accent-green': '#17c964',
            '--font-mono': '"SFMono-Regular", Menlo, Monaco, Consolas, monospace',
            '--font-sans': '"Inter", system-ui, -apple-system, sans-serif',
            '--radius': '6px',
            '--shadow-glow': 'none',
            '--ticket-bg': '#050505',
            '--ball-bg': '#111111',
            '--ball-border': '#333333',
            '--ball-color': '#EDEDED',
        }
    },
    {
        id: 'sports-betting',
        name: '13. Sports Draft',
        vectorLabel: 'Active Wager',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Teko:wght@500;700&display=swap',
        vars: {
            '--bg-color': '#0B0D12',
            '--surface-color': '#181C25',
            '--panel-border': '#2A2E38',
            '--text-main': '#FFFFFF',
            '--text-muted': '#888D96',
            '--accent-cyan': '#45ABFF',
            '--accent-magenta': '#FF4757',
            '--accent-yellow': '#FFA200',
            '--accent-green': '#00E25B', // Neon Draft Green
            '--font-mono': '"Teko", sans-serif',
            '--font-sans': '"Roboto Condensed", sans-serif',
            '--radius': '6px',
            '--shadow-glow': '0 0 12px rgba(0, 226, 91, 0.2)',
            '--ticket-bg': '#1E232E',
            '--ball-bg': '#00E25B',
            '--ball-border': '#00E25B',
            '--ball-color': '#0B0D12',
        }
    },
    {
        id: 'gen-alpha',
        name: '14. Gen-Alpha Vegas',
        vectorLabel: 'CHOOSE UR PATH',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Rubik:wght@700;900&display=swap',
        vars: {
            '--bg-color': '#410cd9', // Hyper Violet
            '--surface-color': '#FF0055', // Hot Pink
            '--panel-border': '#00FFCC', // Cyber Cyan
            '--text-main': '#FFFFFF',
            '--text-muted': '#ffb3cc',
            '--accent-cyan': '#2BF8E6',
            '--accent-magenta': '#FF2B8A',
            '--accent-yellow': '#E2FF00', // Electric Yellow
            '--accent-green': '#A5F82B',
            '--font-mono': '"Rubik", sans-serif',
            '--font-sans': '"Fredoka", cursive, sans-serif',
            '--radius': '24px',
            '--shadow-glow': '8px 8px 0px #00FFCC', // Hard brutalist shadow
            '--ticket-bg': '#2b00ff',
            '--ball-bg': '#E2FF00',
            '--ball-border': '#000000',
            '--ball-color': '#000000',
        }
    },
    {
        id: 'tactical-gear',
        name: '15. Tactical Gear',
        vectorLabel: 'Mission Objective',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Oswald:wght@400;700&display=swap',
        vars: {
            '--bg-color': '#1A1C16',
            '--surface-color': '#2C2E24', // Olive Drab
            '--panel-border': '#4A4C3D',
            '--text-main': '#E8E6D9',
            '--text-muted': '#8C8E7D',
            '--accent-cyan': '#E8A81E', // Tactical Orange
            '--accent-magenta': '#C83B22',
            '--accent-yellow': '#E8A81E',
            '--accent-green': '#5A7545',
            '--font-mono': '"Black Ops One", cursive',
            '--font-sans': '"Oswald", sans-serif',
            '--radius': '2px',
            '--shadow-glow': 'none',
            '--ticket-bg': '#1A1C16',
            '--ball-bg': '#2C2E24',
            '--ball-border': '#4A4C3D',
            '--ball-color': '#E8A81E',
        }
    },
    {
        id: 'mass-market',
        name: '16. Mass Market (App Style)',
        vectorLabel: 'Select Game',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
        vars: {
            '--bg-color': '#F5F5F7', // Apple Light Grey
            '--surface-color': '#FFFFFF',
            '--panel-border': 'transparent',
            '--text-main': '#1D1D1F', // Apple Dark Grey
            '--text-muted': '#86868B',
            '--accent-cyan': '#0071E3', // iOS Blue
            '--accent-magenta': '#FF3B30',
            '--accent-yellow': '#FF9500',
            '--accent-green': '#34C759',
            '--font-mono': '"SF Mono", monospace',
            '--font-sans': '"Outfit", system-ui, -apple-system, sans-serif',
            '--radius': '20px',
            '--shadow-glow': '0 4px 24px rgba(0,0,0,0.06)',
            '--ticket-bg': '#FFFFFF',
            '--ball-bg': '#F5F5F7',
            '--ball-border': 'transparent',
            '--ball-color': '#1D1D1F',
        }
    },
    {
        id: 'golden-ticket',
        name: '17. Golden Lotto',
        vectorLabel: 'Select Lottery',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap',
        vars: {
            '--bg-color': '#0a0a0a',
            '--surface-color': '#111',
            '--panel-border': '#ffd700',
            '--text-main': '#fff',
            '--text-muted': '#b8860b',
            '--accent-cyan': '#e5e4e2',
            '--accent-magenta': '#ff4500',
            '--accent-yellow': '#ffd700',
            '--accent-green': '#32cd32',
            '--font-mono': '"Courier New", monospace',
            '--font-sans': '"Cinzel", serif',
            '--radius': '8px',
            '--shadow-glow': '0 0 15px rgba(255, 215, 0, 0.3)',
            '--ticket-bg': '#1a180d',
            '--ball-bg': 'radial-gradient(circle, #ffd700 0%, #daa520 100%)',
            '--ball-border': '#fff8dc',
            '--ball-color': '#000',
        }
    },
    {
        id: 'cozy-coffee',
        name: '18. Cozy Coffee Shop',
        vectorLabel: 'Today\'s Order',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Quicksand:wght@400;600;700&display=swap',
        vars: {
            '--bg-color': '#f3eee8', // Crema
            '--surface-color': '#ffffff',
            '--panel-border': '#e2d5c8',
            '--text-main': '#4a3b32', // Espresso
            '--text-muted': '#967e6c', // Latte
            '--accent-cyan': '#789b88', // Sage green
            '--accent-magenta': '#d48c82', // Terracotta
            '--accent-yellow': '#e3b86c', // Caramel
            '--accent-green': '#789b88',
            '--font-mono': '"Kalam", cursive',
            '--font-sans': '"Quicksand", sans-serif',
            '--radius': '12px',
            '--shadow-glow': '0 4px 15px rgba(74, 59, 50, 0.05)',
            '--ticket-bg': '#ffffff',
            '--ball-bg': '#fffefa',
            '--ball-border': '#e2d5c8',
            '--ball-color': '#4a3b32',
        }
    },
    {
        id: 'luxury-editorial',
        name: '19. Luxury Editorial',
        vectorLabel: 'Featured Edition',
        googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500&display=swap',
        vars: {
            '--bg-color': '#F7F5F0', // Muslin/Cream
            '--surface-color': '#FCFBF8', // Alabaster
            '--panel-border': '#E1D9CD', // Greige
            '--text-main': '#1C1B1A', // Espresso Black
            '--text-muted': '#8E867A', // Muted taupe
            '--accent-cyan': '#9A8B73', // Muted Gold
            '--accent-magenta': '#9A8B73',
            '--accent-yellow': '#C5B496',
            '--accent-green': '#9A8B73',
            '--font-mono': '"Cormorant Garamond", serif',
            '--font-sans': '"Jost", sans-serif',
            '--radius': '0px',
            '--shadow-glow': '0 20px 40px rgba(26,26,24,0.05)',
            '--ticket-bg': '#FFFFFF',
            '--ball-bg': '#F4F0EB',
            '--ball-border': '#C5B496',
            '--ball-color': '#1C1B1A',
        }
    },
    {
        id: 'frutiger-aero',
        name: '20. Web 2.0 (Frutiger Aero)',
        vectorLabel: 'Choose Application',
        vars: {
            '--bg-color': '#e1f0fe', // Sky blue
            '--surface-color': '#ffffff',
            '--panel-border': '#a5d0f6',
            '--text-main': '#234b71',
            '--text-muted': '#6b92b6',
            '--accent-cyan': '#01c5ff',
            '--accent-magenta': '#ff5de3',
            '--accent-yellow': '#ffe820',
            '--accent-green': '#58e000', // Glossy grass green
            '--font-mono': '"Lucida Console", Monaco, monospace',
            '--font-sans': '"Trebuchet MS", "Lucida Grande", Tahoma, sans-serif',
            '--radius': '8px',
            '--shadow-glow': 'inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 4px rgba(0,0,0,0.1)',
            '--ticket-bg': 'linear-gradient(180deg, #ffffff 0%, #eef6fc 100%)',
            '--ball-bg': 'linear-gradient(180deg, #ffffff 0%, #cdf2ab 100%)',
            '--ball-border': '#86ca3a',
            '--ball-color': '#115b00',
        }
    }
];
