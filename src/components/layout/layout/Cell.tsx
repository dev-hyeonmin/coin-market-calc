export interface CellProps {
  children?: React.ReactNode;
  span?: number;
  rows?: number;
}

export const Cell = ({
  children,
  span = 12,
  rows = 1,
}: CellProps) => {
  return (
    <div
      className={["ui-layout__cell"].join(' ')}
      style={{
        gridArea: `span ${rows} / span ${span} / auto / auto`
      }}>
      {children}
    </div>
  )
}