'use client';
import Footer from '@/components/layout/Footer';
import HorizontalNavBar from '@/components/layout/HorizontalNav/page';
import LeftSideBar from '@/components/layout/LeftSideBar';
import TopBar from '@/components/layout/TopBar';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useLayoutContext } from '@/context/useLayoutContext';
import { getHorizontalMenuItems } from '@/helpers/Manu';
import React from 'react';
import { Card } from 'react-bootstrap';
import './admin-css.css'
import { usePathname } from 'next/navigation';

const AdminLayout = ({
  children
}) => {
  const {
    orientation,
    changeTitle
  } = useLayoutContext();
  const pathname = usePathname();

  const hideSidebarRoutes = [
    '/',
  ];
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);
  const menuItems = getHorizontalMenuItems();
  
  return <>
    <div className="wrapper">
      {!shouldHideSidebar && <TopBar />}
      {!shouldHideSidebar && <HorizontalNavBar menuItems={menuItems} />}
      <div className="modal fade" id="searchModal" tabIndex={-1} aria-labelledby="searchModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content bg-transparent">
            <form>
              <Card className="mb-1">
                <div className="px-3 py-2 d-flex flex-row align-items-center" id="top-search">
                  <IconifyIcon icon='ri:search-line' className="fs-22" />
                  <input type="search" className="form-control border-0" id="search-modal-input" placeholder="Search for actions, people," />
                  <button type="submit" className="btn p-0" data-bs-dismiss="modal" aria-label="Close">[esc]</button>
                </div>
              </Card>
            </form>
          </div>
        </div>
      </div>
      <div className="page-content">
        <div className="page-container">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  </>;
};
export default AdminLayout;