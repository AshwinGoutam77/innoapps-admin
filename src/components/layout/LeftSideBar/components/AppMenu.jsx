"use client";

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { findAllParent, findMenuItem, getMenuItemFromURL } from '@/helpers/Manu';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutContext } from '@/context/useLayoutContext'
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
const MenuItemWithChildren = ({
  item,
  className,
  linkClassName,
  subMenuClassName,
  activeMenuItems,
  toggleMenu,
  level
}) => {
  const [open, setOpen] = useState(activeMenuItems.includes(item.key));
  const level1 = level === 1;
  useEffect(() => {
    setOpen(activeMenuItems.includes(item.key));
  }, [activeMenuItems, item]);
  const toggleMenuItem = e => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
    return false;
  };
  const getActiveClass = useCallback(item => {
    return activeMenuItems?.includes(item.key) ? 'active' : '';
  }, [activeMenuItems]);
  return <li className={className}>
      <div onClick={toggleMenuItem} aria-expanded={open} role="button" className={clsx(linkClassName)}>
        {item.icon && <span className="menu-icon">
            <IconifyIcon icon={item.icon} />
          </span>}
        {level1 ? <span className="menu-text">{item.label}</span> : <Link href="" className='side-nav-link '><span className="menu-text">{item.label}</span>
            <div className='menu-arrow content-none'>
              <IconifyIcon icon="tabler:chevron-right" width={19} height={19} />
            </div>
          </Link>}
        {!item.badge ? <>
            {level1 && <span className='menu-arrow content-none'>
                <IconifyIcon icon="tabler:chevron-right" width={19} height={19} />
              </span>}
          </> : <>
            <span className={`badge rounded-pill text-end bg-${item.badge.variant}`}>{item.badge.text}</span>
          </>}

      </div>
      <Collapse in={open}>
        <div>
          <ul className={clsx(subMenuClassName)}>
            {(item.children || []).map((child, idx) => {
            return <Fragment key={child.key + idx}>
                  {child.children ? <MenuItemWithChildren item={child} linkClassName={clsx('nav-link', getActiveClass(child))} activeMenuItems={activeMenuItems} className={clsx('side-nav-item', getActiveClass(child))} level={level + 1} subMenuClassName="sub-menu" toggleMenu={toggleMenu} /> : <MenuItem level={level + 1} item={child} className={clsx('side-nav-item', getActiveClass(child))} linkClassName={clsx('side-nav-link', getActiveClass(child))} />}
                </Fragment>;
          })}
          </ul>
        </div>
      </Collapse>
    </li>;
};
const MenuItem = ({
  item,
  className,
  linkClassName,
  level
}) => {
  return <li className={className}>
      <MenuItemLink item={item} level={level + 1} className={linkClassName} />
    </li>;
};
const MenuItemLink = ({
  item,
  className
}) => {
  const {toggleBackdrop, mainMenu} = useLayoutContext()

  const ToggleMenu = () => {
    if (mainMenu.size == 'full') {
      toggleBackdrop()
    }
  }

  return <Link href={item.url ?? ''} onClick={ToggleMenu} target={item.target} className={clsx(className, {
    disabled: item.isDisabled
  })}>
      {item.icon && <span className="menu-icon">
          <IconifyIcon icon={item.icon} />
        </span>}
      {/* {!item.icon && <IconifyIcon icon="tabler:circle-filled" />} */}
      <span className="menu-text">{item.label}</span>
      {item.badge && <span className={`badge rounded-pill text-end bg-${item.badge.variant}`}>{item.badge.text}</span>}
      {item?.badgeIcon && <OverlayTrigger placement="top" overlay={<Tooltip className="tooltip-warning">Your wallet balance is <b>low!</b></Tooltip>}>
          <span className="badge p-0 menu-alert fs-16 text-danger">
            <IconifyIcon icon={item.badgeIcon} data-bs-html="true" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="" data-bs-title="" />
          </span>
        </OverlayTrigger>}
    </Link>;
};
const AppMenu = ({
  menuItems
}) => {
  const pathname = usePathname();
  const [activeMenuItems, setActiveMenuItems] = useState([]);
  const toggleMenu = (menuItem, show) => {
    if (show) setActiveMenuItems([menuItem.key, ...findAllParent(menuItems, menuItem)]);
  };
  const getActiveClass = useCallback(item => {
    return activeMenuItems?.includes(item.key) ? 'active' : '';
  }, [activeMenuItems]);
  const activeMenu = useCallback(() => {
    const trimmedURL = pathname?.replaceAll('', '');
    const matchingMenuItem = getMenuItemFromURL(menuItems, trimmedURL);
    if (matchingMenuItem) {
      const activeMt = findMenuItem(menuItems, matchingMenuItem.key);
      if (activeMt) {
        setActiveMenuItems([activeMt.key, ...findAllParent(menuItems, activeMt)]);
      }
      setTimeout(() => {
        const activatedItem = document.querySelector(`#leftside-menu-container .simplebar-content a[href="${trimmedURL}"]`);
        if (activatedItem) {
          const simplebarContent = document.querySelector('#leftside-menu-container .simplebar-content-wrapper');
          if (simplebarContent) {
            const offset = activatedItem.offsetTop - window.innerHeight * 0.4;
            scrollTo(simplebarContent, offset, 600);
          }
        }
      }, 400);

      // scrollTo (Left Side Bar Active Menu)
      const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      };
      const scrollTo = (element, to, duration) => {
        const start = element.scrollTop,
          change = to - start,
          increment = 20;
        let currentTime = 0;
        const animateScroll = function () {
          currentTime += increment;
          const val = easeInOutQuad(currentTime, start, change, duration);
          element.scrollTop = val;
          if (currentTime < duration) {
            setTimeout(animateScroll, increment);
          }
        };
        animateScroll();
      };
    }
  }, [pathname, menuItems]);
  useEffect(() => {
    if (menuItems && menuItems.length > 0) activeMenu();
  }, [activeMenu, menuItems]);
  return <ul className="side-nav">
      {(menuItems || []).map((item, idx) => {
      return <Fragment key={item.key + idx}>
            {item.isTitle ? <li className={clsx('side-nav-title', {
          'mt-2': idx != 0
        })}>{item.label}</li> : <>
                {item.children ? <MenuItemWithChildren item={item} toggleMenu={toggleMenu} className={clsx('side-nav-item', getActiveClass(item))} level={1} linkClassName={clsx('side-nav-link', getActiveClass(item))} subMenuClassName="sub-menu" activeMenuItems={activeMenuItems} /> : <MenuItem item={item} level={1} linkClassName={clsx('side-nav-link', getActiveClass(item))} className={clsx('side-nav-item', getActiveClass(item))} />}
              </>}
          </Fragment>;
    })}
    </ul>;
};
export default AppMenu;