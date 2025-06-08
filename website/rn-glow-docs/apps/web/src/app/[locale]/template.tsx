'use client'

import { motion } from 'framer-motion'

import type { ComponentProps } from 'react'

import { useMounted } from '@/lib/opendocs/hooks/use-mounted'

export default function Template({ children }: ComponentProps<'div'>) {
  const isMounted = useMounted()

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.7 }}
    >
      {children}
    </motion.div>
  )
}
