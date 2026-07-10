import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

export default function Button({
  children,
  href,
  variant = 'primary',
  type = 'button',
  onClick,
  className = '',
  disabled = false,
  target,
  rel,
}: ButtonProps) {
  const base = `px-6 py-3 rounded-full font-bold transition-all duration-300 inline-block text-center ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;
  const variants = {
    primary: 'bg-gradient-to-r from-[#1a3c34] to-[#2d5a4b] hover:shadow-lg hover:shadow-[#1a3c34]/40 text-white',
    secondary: 'border-2 border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10',
  };
  const classes = `${base} ${variants[variant]}`;

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}