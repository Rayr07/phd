
import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { COLORS } from '../constants.tsx';

const OAuthButtons: React.FC = () => {
  const { theme } = useTheme();
  const colors = COLORS[theme];

  const handleOAuth = (provider: string) => {
    console.log(`Redirecting to ${provider} OAuth 2.0...`);
    alert(`OAuth 2.0 redirection for ${provider} would happen here in a production environment.`);
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-grow bg-current opacity-10"></div>
        <span className="text-xs font-bold uppercase tracking-widest opacity-40">or continue with</span>
        <div className="h-px flex-grow bg-current opacity-10"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleOAuth('Google')}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border font-medium hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ borderColor: theme === 'light' ? colors.accent : '#333', color: colors.text }}
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-4 h-4" alt="Google" />
          Google
        </button>
        <button
          onClick={() => handleOAuth('GitHub')}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border font-medium hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ borderColor: theme === 'light' ? colors.accent : '#333', color: colors.text }}
        >
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" className="w-4 h-4 invert dark:invert-0" alt="GitHub" />
          GitHub
        </button>
      </div>
    </div>
  );
};

export default OAuthButtons;
