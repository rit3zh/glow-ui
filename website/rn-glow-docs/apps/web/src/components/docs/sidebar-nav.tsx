'use client'

import { Fragment } from 'react'

import type { LocaleOptions } from '@/lib/opendocs/types/i18n'
import type { SidebarNavItem } from '@/lib/opendocs/types/nav'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

import { getObjectValueByLocale } from '@/lib/opendocs/utils/locale'
import { usePathname, Link as DesktopLink } from '@/navigation'
import { MobileLink } from '../mobile-link'
import { cn } from '@/lib/utils'

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
  locale: LocaleOptions
  isMobile?: boolean
  handleMobileSidebar?: (state: boolean) => void
}

export function DocsSidebarNav({
  items,
  locale,
  isMobile,
  handleMobileSidebar,
}: DocsSidebarNavProps) {
  const pathname = usePathname()

  return items.length > 0 ? (
    <div
      className={cn(
        !isMobile && 'w-full',
        isMobile && 'flex flex-col space-y-3 pt-6 pr-3'
      )}
    >
      {items.map((item, index) => (
        <div key={index} className={cn('pb-4')}>
          <h4
            className={cn(
              !isMobile && 'mb-1 rounded-md px-2 py-1 text-sm font-semibold',
              isMobile && 'font-medium'
            )}
          >
            {getObjectValueByLocale(item.title, locale)}
          </h4>
          {item?.items?.length > 0 && (
            <DocsSidebarNavItems
              items={item.items}
              locale={locale}
              pathname={pathname}
              isMobile={isMobile}
              handleMobileSidebar={handleMobileSidebar}
            />
          )}
        </div>
      ))}
    </div>
  ) : null
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  locale: LocaleOptions
  pathname: string | null
  isMobile?: boolean
  handleMobileSidebar?: (state: boolean) => void
}

const accordionsStates = new Map<string, boolean>()

export function DocsSidebarNavItems({
  items,
  pathname,
  locale,
  isMobile,
  handleMobileSidebar,
}: DocsSidebarNavItemsProps) {
  const Link = !isMobile ? DesktopLink : MobileLink

  function toggleAccordionState(id: string) {
    accordionsStates.set(id, !accordionsStates.get(id))
  }

  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item) => {
        const ChildrenComponent = () => {
          const activeChild = item?.items?.find(
            (childItem) => childItem.href === pathname
          )

          return (
            item.items.length > 0 && (
              <Accordion
                type="single"
                className="py-2"
                collapsible
                onValueChange={() =>
                  toggleAccordionState(
                    getObjectValueByLocale(item.title, locale)
                  )
                }
                defaultValue={
                  activeChild?.title ||
                  accordionsStates.get(
                    getObjectValueByLocale(item.title, locale)
                  )
                    ? getObjectValueByLocale(item.title, locale)
                    : ''
                }
              >
                <AccordionItem
                  value={getObjectValueByLocale(item.title, locale)}
                >
                  <AccordionTrigger className="py-0 pb-3">
                    <h4 className="flex items-center gap-2 rounded-md pl-4 text-sm font-semibold">
                      {getObjectValueByLocale(item.title, locale)}

                      {item.label && (
                        <span className="h-fit rounded-md bg-primary-active px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                          {getObjectValueByLocale(item.label, locale)}
                        </span>
                      )}
                    </h4>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="pl-4">
                      <DocsSidebarNavItems
                        items={item.items}
                        locale={locale}
                        pathname={pathname}
                        isMobile={isMobile}
                        handleMobileSidebar={handleMobileSidebar}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )
          )
        }

        const key =
          getObjectValueByLocale(item.title, locale) + item.href! + pathname

        const props =
          isMobile && item.href ? { onOpenChange: handleMobileSidebar } : {}

        return item.href && !item.disabled ? (
          <Fragment key={key}>
            <Link
              href={item.href}
              {...props}
              className={cn(
                'group my-1 ml-2 flex h-fit w-full items-center gap-2 rounded-md border border-transparent px-2 hover:underline',
                item.disabled && 'cursor-not-allowed opacity-60',
                pathname?.endsWith(item.href)
                  ? 'text-foreground border-l-primary-active rounded-none border-l-2 font-medium'
                  : 'text-muted-foreground'
              )}
              target={item.external ? '_blank' : ''}
              rel={item.external ? 'noreferrer' : ''}
            >
              {getObjectValueByLocale(item.title, locale)}

              {item.label && (
                <span className="rounded-md bg-primary-active px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                  {getObjectValueByLocale(item.label, locale)}
                </span>
              )}
            </Link>
          </Fragment>
        ) : (
          <Fragment key={key}>
            <ChildrenComponent />
          </Fragment>
        )
      })}
    </div>
  ) : null
}
