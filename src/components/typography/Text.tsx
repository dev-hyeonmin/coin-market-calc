export interface TextProps {
  children: React.ReactNode;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  weight?: 'thin' | 'normal' | 'bold';
  skin?: 'warning' | 'standard' | 'error' | 'disabled' | 'primary';
  align?: 'left' | 'center' | 'right';
}

export const Text = ({
  children,
  size = 'medium',
  weight = 'normal',
  skin = 'standard',
  align = 'left'
}: TextProps) => {

  return (
    <div className={[`ui-text`, 
    `ui-text--${size}`, 
    `ui-text--${weight}`, 
    `ui-text--${skin}`,
    `ui-text--${align}`,].join(' ')}>
      {children}
    </div>
  )
}