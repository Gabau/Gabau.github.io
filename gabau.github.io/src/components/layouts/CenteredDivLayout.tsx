

export default function CenteredDivLayout({ children }: {
  children: JSX.Element | string
}) {
  return <div className="flex flex-col items-center justify-center">
    <div className="flex flex-row items-center justify-center">
      {children}
    </div>
  </div>
}
