export interface LayoutProps {
  children?: React.ReactNode;
  gap?: string;
  maxHeight?: string;
  rowHeight?: string;
  justifyItems?: 'end';
}

export const Layout = ({
  children,
  gap,
  maxHeight,
  rowHeight,
  justifyItems
}: LayoutProps) => {
  return (
    <div
      className={["ui-layout", `ui-layout--${justifyItems}`].join(' ')}
      style={{
        gap: gap,
        gridAutoRows: rowHeight,
        maxHeight: maxHeight
      }}>
      {children}
    </div>
  )
}