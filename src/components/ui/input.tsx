// Input component extends from shadcnui - https://ui.shadcn.com/docs/components/input
'use client'

import * as React from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  loadingSubmit?: boolean
  onSubmit?: () => void
  onStop?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, loadingSubmit, onSubmit, onStop, ...props }, ref) => {
    const radius = 100 // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = React.useState(false)

    let mouseX = useMotionValue(0)
    let mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect()

      mouseX.set(clientX - left)
      mouseY.set(clientY - top)
    }
    return (
      <motion.div
        style={{
          background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
          #4ae3f5,
          transparent 80%
        )
      `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="rounded-lg p-[2px] transition duration-300 group/input relative"
      >
        <input
          type={type}
          className={cn(
            `dark:placeholder-text-neutral-600 duration-400 flex h-12 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white`,
            'shadow-input group-hover/input:shadow-none dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]',
            'focus-visible:ring-[2px] focus-visible:ring-gray-950 dark:focus-visible:ring-neutral-600',
            'pr-28',
            className,
          )}
          ref={ref}
          {...props}
        />
        <div className="flex h-[22px] px-1 top-[15px] right-14 text-[14px] text-gray-300 leading-[14px] absolute items-center">
          / input
        </div>
        <button
          className={cn(
            'absolute right-2 top-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-white transition-colors',
            loadingSubmit
              ? 'bg-destructive hover:bg-destructive/80'
              : 'bg-gray-950 hover:bg-gray-950/80',
          )}
          onClick={loadingSubmit ? onStop : onSubmit}
        >
          {loadingSubmit ? (
            <span className="i-mingcute-stop-fill" />
          ) : (
            <span className="i-mingcute-arrow-up-fill" />
          )}
        </button>
      </motion.div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
