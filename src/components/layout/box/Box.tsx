
export interface BoxProps {
  children?: React.ReactNode;
  className?: string;
  width?: string;
  height?: string;
  direction?: "horizontal" | "vertical";
  gap?: string;
  align?: "left" | "right" | "center" | "space-between",
  verticalAlign?:  "top" | "middle" | "bottom" | "space-between",
  wrap?: boolean;
  padding?: string;
  margin?: string;
  scroll?: boolean;
}

export const Box = ({
  children,
  className = '',
  width,
  height,
  direction = "horizontal",
  gap,
  align,
  verticalAlign,
  wrap = false,
  padding,
  margin,
  scroll = false
}: BoxProps) => {
  const directionType = direction === "horizontal" ? "row" : "column";

  return (
    <div 
      className={[
        className,
        "ui-box",
        `ui-box--${directionType}`,
        `ui-box--align-${align}`,
        `ui-box--vertical-${verticalAlign}`,
        scroll && `ui-box--scroll`,
        wrap && `ui-box--wrap`].join(' ')
      }
      style={{
        width: width,
        height: height,
        gap: gap,
        padding: padding,
        margin: margin
      }}
    >
      {children}
    </div>
  )
}