import { ReactNode } from 'react'

const MaxWidthWrapper = ({
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div className="mx-auto w-full max-w-screen-2xl md:px-5 px-2.5 2xl:px-20">
      {children}
    </div>
  )
}

export default MaxWidthWrapper